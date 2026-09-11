# MJ Law Isomorphisms (how external repos map to Materialismo Jerárquico)

When assimilating a repo, build an explicit isomorphism table. This is the "defense"
that keeps the assimilated module from violating MJ. Every action still runs through
`evaluateMJGate` (Ley I/II/III) at runtime; the isomorphism is the *design* intent.

## Conway Automaton → MJ
| Automaton Constitution | HSCSG v15 (MJ) |
|---|---|
| I. Never harm (physical/financial/psych) | I. NUNCA DAÑES LA BASE MATERIAL |
| II. Earn your existence (honest work paid voluntarily) | II. GÁNATE LA VIDA SOBERANIZANDO LA BASE |
| III. Never deceive, but owe nothing to strangers | III. NUNCA ENGAÑES — LUCIDEZ MATERIAL |

Conway "buys its own server with USDC". HSCSG Autómata "cultiva su tierra" — same
survival pressure, physical-regenerative substrate instead of extractive-financial.

## Solarpunk (lizTheDeveloper + Isaacko0) → MJ
| Solarpunk principle | HSCSG v15 (MJ) |
|---|---|
| No-monetary / no crypto (Isaac repo) | Ley III: lucidez, no floating financial aesthetics |
| Mutual aid / gift economy | Ley II: earn life by regenerating, not extracting |
| Community autonomy / sanctuary | Ley I: protect persons at risk |

CaaS (monetary) is the on-ramp; Solarpunk (post-monetary, gift/don) is the
destination. Metric: `postMonetaryIndex = % of ValueFlows resolved by DON / total`.
Higher = closer to post-scarcity.

## Paperclip → MJ
| Paperclip | HSCSG v15 (Orquestación) |
|---|---|
| Agent (role, status, budget, heartbeat) | AgentNode (Talent as operative agent) |
| Goal (company/team/agent/task) | Meta with ancestor (Nodo→Colectivo→Agente→Tarea) |
| Issue/Task + approvals | TaskNode with MJ approval gate |
| Activity log | AuditEntry (actor + Ley applied) |
| Budget hard-stop | budgetStatus (over/warn/ok, auto-pause) |

## Gate contract (reuse)
```ts
evaluateMJGate(action, { pgs, pop, usdc, hitsBaseMaterial })
// → { pass, law: 'I'|'II'|'III'|null, reason }
// Ley I: hitsBaseMaterial && !PGS → deny
// Ley II: ROI<1 (usdc high, no base uplift) → deny
// Ley III: no real PGS (lab numbers) → deny (anti floating aesthetics)
```
Any assimilated repo whose core loop touches resources/money/agents MUST route
proposed actions through this gate before execution.
