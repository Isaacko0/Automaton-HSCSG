# GAIA_INTEGRATION Workstream Detail — hscsg-next-steps-orchestrator

**Session:** 2026-08-22 | **Context:** Alianza Gaia-Mycelium integration fully specified

---

## Workstream: GAIA_INTEGRATION (8 Tasks)

### Task Registry (Enhanced from gaia_mycelium_integration.md)

```json
{
  "GAIA_INTEGRATION": [
    {
      "id": "GAIA-gov-sync",
      "title": "Implementar governance:sync CDS↔Gaia DAO",
      "deps": ["P0-copiosis", "COACH-automaton"],
      "effort": 5,
      "value": 95,
      "workstream": "GAIA_INTEGRATION",
      "source": "agent",
      "priority": 95,
      "blocks": ["GAIA-trust-bridge", "GAIA-infra-connect"],
      "notes": "CDS Decision Records → Gaia DAO proposals (VC signed), MJ Gate veto functional"
    },
    {
      "id": "GAIA-trust-bridge",
      "title": "Implementar trust:bridge NetBenefitFlow↔VC + RAO↔Trust Registry",
      "deps": ["GAIA-gov-sync", "P0-valueflows"],
      "effort": 5,
      "value": 95,
      "workstream": "GAIA_INTEGRATION",
      "source": "agent",
      "priority": 95,
      "blocks": ["GAIA-intel-match", "GAIA-app-federate"],
      "notes": "Requiere: Weave DIDComm specs, FPP VC schemas, Trust Registry API"
    },
    {
      "id": "GAIA-infra-connect",
      "title": "Implementar infra:connect neko↔**Discovery Layer** + Boundaries↔Project Weave",
      "deps": ["MIG-P1-BranDNA"],
      "effort": 5,
      "value": 90,
      "workstream": "GAIA_INTEGRATION",
      "source": "agent",
      "priority": 90,
      "blocks": ["GAIA-intel-match"],
      "notes": "Requiere: **Discovery Layer** discovery API, Project Weave protocol specs"
    },
    {
      "id": "GAIA-intel-match",
      "title": "Implementar intel:match Autómata E²R↔Gaia Matching + CoachFAB unificado",
      "deps": ["COACH-automaton", "COACH-integration", "GAIA-trust-bridge", "GAIA-infra-connect"],
      "effort": 5,
      "value": 95,
      "workstream": "GAIA_INTEGRATION",
      "source": "agent",
      "priority": 95,
      "blocks": ["GAIA-app-federate"],
      "notes": "Requiere: Gaia Matching API, Weave Recommendation Engine specs"
    },
    {
      "id": "GAIA-app-federate",
      "title": "Implementar app:federate CaaS-BM↔Gaia Market + Commonomics + ZNU settlement",
      "deps": ["GAIA-trust-bridge", "GAIA-intel-match"],
      "effort": 5,
      "value": 95,
      "workstream": "GAIA_INTEGRATION",
      "source": "agent",
      "priority": 95,
      "blocks": ["GAIA-eco-sync", "GAIA-funding-proposal"],
      "notes": "Requiere: Gaia Market commission specs, Commonomics rules, Weave Canal Funds model"
    },
    {
      "id": "GAIA-eco-sync",
      "title": "Implementar eco:sync CAC/PGS↔Gaia Score bidireccional + pipelines multidimensionales",
      "deps": ["GAIA-app-federate"],
      "effort": 5,
      "value": 90,
      "workstream": "GAIA_INTEGRATION",
      "source": "agent",
      "priority": 90,
      "blocks": ["GAIA-funding-proposal"],
      "notes": "Requiere: Gaia Impact Measurement pipelines, OpenHaven verification signals"
    },
    {
      "id": "GAIA-funding-proposal",
      "title": "Redactar propuesta financiamiento conjunto Sección 15 (data+trust+AI+edu+territorios+economía+regeneración)",
      "deps": ["GAIA-eco-sync"],
      "effort": 3,
      "value": 95,
      "workstream": "GAIA_INTEGRATION",
      "source": "agent",
      "priority": 95,
      "blocks": ["GAIA-marketplace-level3"],
      "notes": "Basado en: Commonomics + Weave 6 Capital Streams + ZNU/CaaS-BM + Fondo Solarpunk"
    },
    {
      "id": "GAIA-marketplace-level3",
      "title": "Implementar Gaia Marketplace Level 3 ↔ CoachFAB + Gaia AI Agent unificado",
      "deps": ["GAIA-funding-proposal", "GAIA-app-federate"],
      "effort": 5,
      "value": 90,
      "workstream": "GAIA_INTEGRATION",
      "source": "agent",
      "priority": 90,
      "notes": "Requiere: Gaia AI Agent specs, CoachFAB Level 3 features, LucidezVerifier compartido"
    }
  ]
}
```

---

## Dependency Graph (GAIA_INTEGRATION)

```
P0-copiosis ──► COACH-automaton ──┐
                                  ├──► GAIA-gov-sync ──► GAIA-trust-bridge ──► GAIA-intel-match ──► GAIA-app-federate ──► GAIA-eco-sync ──► GAIA-funding-proposal ──► GAIA-marketplace-level3
P0-valueflows ──►                   │
                                   │
MIG-P1-BranDNA ────────────────────┘
```

### Parallel Execution Opportunities

| Phase | Parallel Tasks | Sequential Blocker |
|-------|---------------|-------------------|
| **Phase 1** (Week 1-2) | P0-netbenefit, P0-cds_jurados, P0-copiosis, P0-valueflows | None |
| **Phase 2** (Week 2-3) | COACH-automaton, GAIA-gov-sync | P0-copiosis + COACH-automaton |
| **Phase 3** (Week 3-4) | GAIA-trust-bridge, MIG-P1-BranDNA | GAIA-gov-sync + P0-valueflows |
| **Phase 4** (Week 4-5) | GAIA-infra-connect, GAIA-intel-match | GAIA-trust-bridge + COACH-integration + MIG-P1 |
| **Phase 5** (Week 5-6) | GAIA-app-federate | GAIA-trust-bridge + GAIA-intel-match |
| **Phase 6** (Week 6-7) | GAIA-eco-sync | GAIA-app-federate |
| **Phase 7** (Week 7-8) | GAIA-funding-proposal | GAIA-eco-sync |
| **Phase 8** (Week 8-9) | GAIA-marketplace-level3 | GAIA-funding-proposal + GAIA-app-federate |

---

## Required External Specs (Blocking)

| Spec | Source | Needed By | Status |
|------|--------|-----------|--------|
| **Discovery Layer Discovery API** | Equipo Gaia-Mycelium/Gaia | GAIA-infra-connect | ❌ Pendiente |
| **Project Weave Protocol Specs** (DIDComm, Trust Registry, VC schemas) | Equipo Gaia-Mycelium/Weave | GAIA-trust-bridge, GAIA-infra-connect | ❌ Pendiente |
| **FPP (First Person Project) VC Schemas** | Kaliya/Weave | GAIA-trust-bridge | ❌ Pendiente |
| **4 Trust Levels VC Types** (self/community/ambassador/third-party) | Mycelium/Gaia | GAIA-trust-bridge | ❌ Pendiente |
| **Gaia Matching/Recommendation Engine API** | Felipe/Gaia | GAIA-intel-match | ❌ Pendiente |
| **Gaia Market Commission + Commonomics Specs** | Felipe/Gaia | GAIA-app-federate | ❌ Pendiente |
| **Gaia Impact Measurement Pipelines** | Felipe/Gaia | GAIA-eco-sync | ❌ Pendiente |
| **First Person / Sovereign Stack Refs** | Equipo Gaia-Mycelium/Weave | GAIA-infra-connect, GAIA-trust-bridge | ❌ Pendiente |
| **OpenHaven Matrix API** | OpenHaven Team | GAIA-infra-connect, GAIA-eco-sync | ❌ Pendiente |

---

## HSCSG Modules to Create/Extend (8 New Files)

| Module | Path | Purpose |
|--------|------|---------|
| `gaia_sync.ts` | `src/core/lib/gaia_sync.ts` | CDS Decision Records ↔ Gaia DAO proposals (VC signed) |
| `trust_bridge.ts` | `src/core/lib/trust_bridge.ts` | NetBenefitFlow ↔ VC settlement, Trust Registry ↔ RAO sync |
| `discovery_adapter.ts` | `src/core/lib/discovery_adapter.ts` | neko rooms discovery via **Discovery Layer** API |
| `ai_matching_bridge.ts` | `src/core/lib/ai_matching_bridge.ts` | Autómata E²R ↔ Gaia Recommendation Engine |
| `marketplace_federation.ts` | `src/core/lib/marketplace_federation.ts` | CaaS-BM offers in Gaia Market, custom commission + Commonomics |
| `impact_bridge.ts` | `src/core/lib/impact_bridge.ts` | CAC/PGS ↔ Gaia Score bidirectional, multidimensional pipelines |
| `funding_proposal.md` | `docs/funding_proposal.md` | Joint funding proposal Section 15 |
| `GaiaAgentBridge.tsx` | `packages/ui/src/GaiaAgentBridge.tsx` | Unified CoachFAB + Gaia AI Agent interface |

---

## Type Extensions Required

| Type File | Extensions |
|-----------|------------|
| `src/core/lib/valueflows.ts` | `referralSplit`, `gaiaMarketCommission`, `trustLevel`, `vcCredential` |
| `src/core/state/cds.ts` | `gaiaDAOProposalId`, `vcSignature`, `mjGateVeto` |
| `src/core/state/automaton.ts` | `trustFirstMode`, `lucidezVerifier`, `gaiaMatchingEndpoint` |
| `src/core/state/store.ts` | `gaiaSync`, `trustBridge`, `aiMatching`, `marketplaceFederation` slices |

---

## Verification Checklists (Per Vaso Comunicante)

### governance:sync (GAIA-gov-sync)
- [ ] CDS Decision Record → Gaia DAO Proposal (VC signed)
- [ ] MJ Gate veto functional on Gaia proposals
- [ ] Bidirectional sync: Gaia decision → CDS record
- [ ] Audit trail in RAO

### trust:bridge (GAIA-trust-bridge)
- [ ] NetBenefitFlow ↔ VC settlement working
- [ ] Trust Registry (Mycelium 4 niveles) ↔ RAO sync
- [ ] DIDComm (Project Weave) working end-to-end
- [ ] FPP credentials recognized in HSCSG

### infra:connect (GAIA-infra-connect)
- [ ] neko rooms discoverable via **Discovery Layer** API
- [ ] Boundaries CEL allows Project Weave protocols
- [ ] TSP (Trust Spanning Protocol) integrated for secure comms

### intel:match (GAIA-intel-match)
- [ ] Autómata E²R ↔ Gaia Recommendation Engine connected
- [ ] Verifiable inference chains (raw data + provenance)
- [ ] CoachFAB unified interface for both matchings

### app:federate (GAIA-app-federate)
- [ ] CaaS-BM offers appear in Gaia Market
- [ ] Custom commission + Commonomics rules working
- [ ] ZNU settlement functional (with USDC bridge option)
- [ ] Referral economy 30/70 working

### eco:sync (GAIA-eco-sync)
- [ ] CAC/PGS ↔ Gaia Score bidirectional sync
- [ ] Multidimensional impact pipelines operational
- [ ] OpenHaven verification signals integrated

---

## Quick Commands for This Workstream

```bash
# Phase 1: Foundation (unlocks GAIA)
node scripts/orchestrator-next-steps.js run P0-netbenefit
node scripts/orchestrator-next-steps.js run P0-cds_jurados
node scripts/orchestrator-next-steps.js run P0-copiosis
node scripts/orchestrator-next-steps.js run P0-valueflows
node scripts/orchestrator-next-steps.js run COACH-automaton

# Phase 2: First Vaso - governance:sync
node scripts/orchestrator-next-steps.js run GAIA-gov-sync

# Phase 3: Trust Bridge
node scripts/orchestrator-next-steps.js run GAIA-trust-bridge

# Phase 4: Infra + Intel (parallel)
node scripts/orchestrator-next-steps.js run MIG-P1-BranDNA
node scripts/orchestrator-next-steps.js run GAIA-infra-connect
node scripts/orchestrator-next-steps.js run COACH-integration
node scripts/orchestrator-next-steps.js run GAIA-intel-match

# Phase 5: App Federation
node scripts/orchestrator-next-steps.js run GAIA-app-federate

# Phase 6: Eco Sync + Funding
node scripts/orchestrator-next-steps.js run GAIA-eco-sync
node scripts/orchestrator-next-steps.js run GAIA-funding-proposal
node scripts/orchestrator-next-steps.js run GAIA-marketplace-level3

# Continuous: Brief detector cycle
node scripts/brief-detector-recommender.cjs full-cycle
```

---

*Generated: 2026-08-22 | Skill: hscsg-next-steps-orchestrator | Workstream: GAIA_INTEGRATION (8 tasks, 33-day critical path)*