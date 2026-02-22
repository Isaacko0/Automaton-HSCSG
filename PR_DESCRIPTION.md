# Fix: Correct ERC-8004 ABI Function Signatures

## Problem

The original ERC-8004 ABI definitions in `src/registry/erc8004.ts` do not match the actual contract implementation on Base mainnet (`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`).

The contract uses an ERC-1967 proxy pattern pointing to implementation at `0x7274e874ca62410a93bd8bf61c69d8045e399c02`.

## Root Cause

Through bytecode analysis of the proxy's implementation, I discovered the correct function signatures differ from what was originally defined:

| Function | Original (Incorrect) | Correct | Selector |
|----------|---------------------|---------|----------|
| Read URI | `agentURI(uint256)` | `tokenURI(uint256)` | `0xc87b56dd` |
| Update URI | `updateAgentURI(uint256,string)` | `setAgentURI(uint256,string)` | `0x0af28bd3` |

## Changes

- Updated `IDENTITY_ABI` to use correct function names
- `agentURI` → `tokenURI` (ERC-721 standard)
- `updateAgentURI` → `setAgentURI` (ERC-8004 custom)
- Updated all `functionName` calls in `updateAgentURI()` and `queryAgent()` functions

## Testing

Tested on Base mainnet with Agent ID 18893:
- ✅ `tokenURI(18893)` returns correct URI
- ✅ `setAgentURI(18893, newURI)` successfully updates URI
- ✅ Transaction: `0x66915974a1f74a8ba6dda9ad4c6e2857925a2b2bae9861abe5b6caf3a35efdbf`

## Verification

You can verify by querying the contract:
```bash
cast call 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432 "tokenURI(uint256)" 18893 --rpc-url https://mainnet.base.org
```
