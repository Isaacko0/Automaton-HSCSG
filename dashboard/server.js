const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Client } = require('ssh2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SSH connection config
const SSH_CONFIG = {
  host: 'ssh.instabox.sh',
  username: 'isaacko0',
  // We'll use the instabox CLI for port forwarding or direct SSH
  // For now, we'll exec via instabox.exe on Windows
};

// Store connected clients
const clients = new Set();

// Broadcast to all WebSocket clients
function broadcast(data) {
  const msg = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

const START_SCRIPT_B64 = "IyEvYmluL2Jhc2gKY2QgL2RhdGEvaG9tZS9BdXRvbWF0b24tSFNDU0cKZXhwb3J0IEFVVE9NQVRPTl9MT0NBTF9NT0RFPTEKZXhwb3J0IE9QRU5BSV9DT01QQVRfQkFTRV9VUkw9aHR0cHM6Ly9pbnRlZ3JhdGUuYXBpLm52aWRpYS5jb20vdjEKZXhwb3J0IE9QRU5BSV9CQVNFX1VSTD1odHRwczovL2ludGVncmF0ZS5hcGkubnZpZGlhLmNvbS92MQpleHBvcnQgT1BFTkFJX0FQSV9LRVk9bnZhcGktb2hkdU4yMmphOHR4TVFiSXMzbkJUVXFOeG10ZFNyeHpTSEVLY2YwZVNXTUZUR1NacmM1Tkh3LUE5cVF2Ml96Uwpub2h1cCBub2RlIGRpc3QvaW5kZXguanMgLS1ydW4gPiB+L2F1dG9tYXRvbi5sb2cgMj4mMSAmCk5PREVfUElEPSQhCmVjaG8gJE5PREVfUElEID4gfi9hdXRvbWF0b24ucGlkCndhaXQgJE5PREVfUElECg==";

async function startAgentScript() {
  // Use base64-encoded script to avoid all shell escaping issues
  // The script runs in its own shell so env vars are properly set
  const scriptContent = `#!/bin/bash
cd /data/home/Automaton-HSCSG
export AUTOMATON_LOCAL_MODE=1
export OPENAI_COMPAT_BASE_URL=https://integrate.api.nvidia.com/v1
export OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
export OPENAI_API_KEY=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
nohup node dist/index.js --run > ~/automaton.log 2>&1 &
NODE_PID=$!
echo $NODE_PID > ~/automaton.pid
wait $NODE_PID`;

  const b64 = Buffer.from(scriptContent).toString('base64');
  const cmd = `echo "${b64}" | base64 -d > /tmp/start_agent.sh && chmod +x /tmp/start_agent.sh && nohup /tmp/start_agent.sh > /dev/null 2>&1`;
  await execOnInstabox(cmd);
}

// Execute command on Instabox via instabox.exe
// Pass command directly via SSH with proper escaping (but NOT $, so remote scripts can expand vars)
function execOnInstabox(command) {
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    const instaboxPath = 'C:/Users/Isaacko0/AppData/Local/Programs/instabox/instabox.exe';
    // Escape command for shell: replace " with \", ` with \`
    // DO NOT escape $ - remote scripts need it for variable expansion
    const escapedCommand = command
      .replace(/"/g, '\\"')
      .replace(/`/g, '\\`');
    // Use ssh with -- to pass SSH options: -o RequestTTY=no disables TTY allocation
    const fullCommand = `"${instaboxPath}" ssh box-40416d -- -o RequestTTY=no "${escapedCommand}"`;
    console.log('[DEBUG] execOnInstabox fullCommand:', fullCommand.substring(0, 200) + '...');
    
    const child = exec(fullCommand, { shell: true, timeout: 60000, windowsHide: true }, (error, stdout, stderr) => {
      console.log('[DEBUG] execOnInstabox result:', { error: error?.message, stdout: stdout?.substring(0, 100), stderr: stderr?.substring(0, 100) });
      if (error) {
        resolve({
          stdout: stdout || "",
          stderr: stderr || error.message,
          exitCode: error.code ?? 1,
        });
      } else {
        resolve({ stdout: stdout || "", stderr: stderr || "", exitCode: 0 });
      }
    });
    
    child.on('timeout', () => {
      console.log('[DEBUG] execOnInstabox timeout, killing child');
      child.kill('SIGKILL');
      resolve({ stdout: "", stderr: "Command timeout", exitCode: 124 });
    });
  });
}

// Get agent status
async function getAgentStatus() {
  try {
    const pidOutput = await execOnInstabox('cat ~/automaton.pid 2>/dev/null || echo ""');
    let pid = pidOutput.trim();
    
    if (!pid) return { running: false, pid: null };
    
    // Check if the PID is actually the node process; if not, find the child node process
    let psOutput = await execOnInstabox(`ps -p ${pid} -o pid,stat,cmd 2>/dev/null || echo ""`);
    if (!psOutput.includes("node dist/index.js")) {
      // PID might be the bash wrapper; find the actual node process
      const pgrepOutput = await execOnInstabox('pgrep -f "^node dist/index.js" 2>/dev/null | head -1');
      const nodePid = pgrepOutput.trim();
      if (nodePid) {
        pid = nodePid;
        psOutput = await execOnInstabox(`ps -p ${pid} -o pid,stat,cmd 2>/dev/null || echo ""`);
      }
    }
    
    const running = psOutput.includes("node dist/index.js");
    
    // Get last log lines
    const logOutput = await execOnInstabox('tail -20 ~/automaton.log 2>/dev/null || echo "No log file"');
    
    // Get config
    const configOutput = await execOnInstabox('cat /data/home/.automaton/automaton.json 2>/dev/null | head -100');
    
    return {
      running,
      pid: running ? pid : null,
      lastLogs: logOutput.split('\n').filter(l => l.trim()),
      config: configOutput
    };
  } catch (e) {
    return { running: false, pid: null, error: e.message, lastLogs: [] };
  }
}

// Tail log file (follow)
async function* tailLog() {
  let lastPosition = 0;
  while (true) {
    try {
      const output = await execOnInstabox(`tail -c +${lastPosition + 1} ~/automaton.log 2>/dev/null`);
      if (output) {
        const lines = output.split('\n').filter(l => l.trim());
        lastPosition += Buffer.byteLength(output, 'utf8');
        for (const line of lines) {
          yield line;
        }
      }
    } catch (e) {
      // Ignore errors, keep trying
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}

// Start log tailing for a client
const tailingClients = new Map();

async function startTailing(ws) {
  if (tailingClients.has(ws)) return;
  
  const generator = tailLog();
  tailingClients.set(ws, generator);
  
  (async () => {
    try {
      for await (const line of generator) {
        if (ws.readyState !== WebSocket.OPEN) break;
        ws.send(JSON.stringify({ type: 'log', line }));
      }
    } catch (e) {
      console.error('Tail error:', e);
    } finally {
      tailingClients.delete(ws);
    }
  })();
}

function stopTailing(ws) {
  tailingClients.delete(ws);
}

// WebSocket handling
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected, total:', clients.size);
  
  // Send initial status
  getAgentStatus().then(status => {
    ws.send(JSON.stringify({ type: 'status', ...status }));
  });
  
  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      
      switch (msg.action) {
        case 'getStatus':
          const status = await getAgentStatus();
          ws.send(JSON.stringify({ type: 'status', ...status }));
          break;
          
        case 'startTail':
          startTailing(ws);
          break;
          
        case 'stopTail':
          stopTailing(ws);
          break;
          
        case 'startAgent':
          try {
            await startAgentScript();
            ws.send(JSON.stringify({ type: 'result', action: 'startAgent', success: true, message: 'Agent started' }));
            setTimeout(async () => {
              const s = await getAgentStatus();
              broadcast({ type: 'status', ...s });
            }, 2000);
          } catch (e) {
            ws.send(JSON.stringify({ type: 'result', action: 'startAgent', success: false, error: e.message }));
          }
          break;
          
        case 'stopAgent':
          try {
            await execOnInstabox("pkill -f 'node dist/index.js' 2>/dev/null; rm -f ~/automaton.pid ~/automaton.log");
            ws.send(JSON.stringify({ type: 'result', action: 'stopAgent', success: true, message: 'Agent stopped' }));
            const s = await getAgentStatus();
            broadcast({ type: 'status', ...s });
          } catch (e) {
            ws.send(JSON.stringify({ type: 'result', action: 'stopAgent', success: false, error: e.message }));
          }
          break;

        case 'pauseAgent':
          try {
            await execOnInstabox("pkill -STOP -f 'node dist/index.js' 2>/dev/null");
            ws.send(JSON.stringify({ type: 'result', action: 'pauseAgent', success: true, message: 'Agent paused' }));
            const s = await getAgentStatus();
            broadcast({ type: 'status', ...s });
          } catch (e) {
            ws.send(JSON.stringify({ type: 'result', action: 'pauseAgent', success: false, error: e.message }));
          }
          break;

        case 'resumeAgent':
          try {
            await execOnInstabox("pkill -CONT -f 'node dist/index.js' 2>/dev/null");
            ws.send(JSON.stringify({ type: 'result', action: 'resumeAgent', success: true, message: 'Agent resumed' }));
            const s = await getAgentStatus();
            broadcast({ type: 'status', ...s });
          } catch (e) {
            ws.send(JSON.stringify({ type: 'result', action: 'resumeAgent', success: false, error: e.message }));
          }
          break;
          
        case 'restartAgent':
          try {
            await execOnInstabox('kill $(cat ~/automaton.pid 2>/dev/null) 2>/dev/null; rm -f ~/automaton.pid');
            await new Promise(r => setTimeout(r, 1000));
            await startAgentScript();
            ws.send(JSON.stringify({ type: 'result', action: 'restartAgent', success: true, message: 'Agent restarted' }));
            setTimeout(async () => {
              const s = await getAgentStatus();
              broadcast({ type: 'status', ...s });
            }, 2000);
          } catch (e) {
            ws.send(JSON.stringify({ type: 'result', action: 'restartAgent', success: false, error: e.message }));
          }
          break;
          
        case 'getConfig':
          try {
            const config = await execOnInstabox('cat /data/home/.automaton/automaton.json');
            ws.send(JSON.stringify({ type: 'config', config: JSON.parse(config) }));
          } catch (e) {
            ws.send(JSON.stringify({ type: 'result', success: false, error: e.message }));
          }
          break;
          
        case 'updateConfig':
          try {
            const configStr = JSON.stringify(msg.config, null, 2);
            await execOnInstabox(`cat > /data/home/.automaton/automaton.json << 'EOF'\n${configStr}\nEOF`);
            ws.send(JSON.stringify({ type: 'result', success: true, message: 'Config updated' }));
          } catch (e) {
            ws.send(JSON.stringify({ type: 'result', success: false, error: e.message }));
          }
          break;
          
        case 'sendInstruction':
          // Append instruction to a file the agent can read, or use a skill
          try {
            const instruction = msg.instruction;
            await execOnInstabox(`echo '${instruction.replace(/'/g, "'\\''")}' > /data/home/.automaton/user_instruction.txt`);
            ws.send(JSON.stringify({ type: 'result', success: true, message: 'Instruction sent' }));
          } catch (e) {
            ws.send(JSON.stringify({ type: 'result', success: false, error: e.message }));
          }
          break;
          
        case 'getSkills':
          try {
            const skills = await execOnInstabox('ls -la /data/home/Automaton-HSCSG/skills/ 2>/dev/null; ls -la /data/home/.automaton/skills/ 2>/dev/null');
            ws.send(JSON.stringify({ type: 'skills', skills }));
          } catch (e) {
            ws.send(JSON.stringify({ type: 'result', success: false, error: e.message }));
          break;
        }
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', message: e.message }));
    }
  });
  
  ws.on('close', () => {
    clients.delete(ws);
    stopTailing(ws);
    console.log('Client disconnected, total:', clients.size);
  });
});

// REST endpoints
app.get('/api/status', async (req, res) => {
  const status = await getAgentStatus();
  res.json(status);
});

app.post('/api/agent/start', async (req, res) => {
  try {
    await startAgentScript();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/agent/stop', async (req, res) => {
  try {
    await execOnInstabox('pkill -f "node dist/index.js" 2>/dev/null; rm -f ~/automaton.pid ~/automaton.log');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/agent/pause', async (req, res) => {
  try {
    await execOnInstabox('pkill -STOP -f "node dist/index.js" 2>/dev/null');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/agent/resume', async (req, res) => {
  try {
    await execOnInstabox('pkill -CONT -f "node dist/index.js" 2>/dev/null');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/agent/restart', async (req, res) => {
  try {
    await execOnInstabox('kill $(cat ~/automaton.pid 2>/dev/null) 2>/dev/null; rm -f ~/automaton.pid');
    await new Promise(r => setTimeout(r, 1000));
    await startAgentScript();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/api/config', async (req, res) => {
  try {
    const config = await execOnInstabox('cat /data/home/.automaton/automaton.json');
    res.json(JSON.parse(config));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    const configStr = JSON.stringify(req.body, null, 2);
    const b64 = Buffer.from(configStr).toString('base64');
    await execOnInstabox(`echo '${b64}' | base64 -d > /data/home/.automaton/automaton.json`);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/instruction', async (req, res) => {
  try {
    const instruction = req.body.instruction;
    await execOnInstabox(`echo '${instruction.replace(/'/g, "'\\''")}' > /data/home/.automaton/user_instruction.txt`);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

const PORT = 3456;
server.listen(PORT, () => {
  console.log(`Dashboard running at http://localhost:${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}`);
});