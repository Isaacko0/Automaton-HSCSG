# Backup: red-de-intercambio-federada-isaacko

**Repo origen:** https://github.com/Isaacko0/red-de-intercambio-federada-isaacko (private)
**Clonado local:** /c/Users/Isaacko0/red-de-intercambio-federada-isaacko/
**Fecha asimilación:** 2026-09-11

## Qué es
Red de intercambio federada — backend Go 1.25 para infraestructura de intercambio económico federado, con arquitectura de microservicios, orquestador PSG (Motor PSG), y nodos satélite. Incluye:
- **cmd/**: entrypoints CLI (install, installer, investment-agent, nfc-pkg, node)
- **internal/**: paquetes Go internos (agent, skills, orchestrator, governance, cron, scratchpad, llm, governance)
- **network/**: protocolos de red federada
- **pos/**: punto de venta (Android POS)
- **firmware/**: firmware para dispositivos
- **docker/**: containerización
- **scripts/**: scripts de instalación y operación

## Stack
- **Lenguaje:** Go 1.25
- **Arquitectura:** Microservicios + Orchestrator PSG
- **Base de datos:** YugabyteDB (distributed SQL)
- **Mensajería:** NATS / gRPC
- **Infra:** Docker + Docker Compose, Kubernetes (KubeVela)
- **Frontend POS:** Android (Kotlin)
- **Firmware:** C/Embedded

## Estructura clave
```
red-de-intercambio-federada-isaacko/
├── cmd/
│   ├── install/           # Instalador CLI
│   ├── installer/         # Instalador avanzado
│   ├── investment-agent/  # Agente de inversión autónomo
│   ├── nfc-pkg/           # Paquete NFC
│   └── node/              # Nodo de red
├── internal/
│   ├── agent/             # Agentes autónomos
│   ├── skills/            # Sistema de skills
│   ├── orchestrator/      # Orquestador PSG
│   ├── governance/        # Gobernanza federada
│   ├── cron/              # Cron jobs
│   ├── scratchpad/        # Scratchpad persistente
│   ├── llm/               # Multi-provider LLM
│   └── governance/        # Gobernanza
├── network/               # Protocolos red federada
├── pos/                   # Punto de venta Android
├── firmware/              # Firmware dispositivos
├── docker/                # Dockerfiles
├── docs/                  # Documentación técnica
└── scripts/               # Scripts operativos
```

## Documentación clave
- `PLAN_FEDERACION_GLOBAL.md` — Plan de federación global
- `PLAN_BACKUPS_YUGABYTE.md` — Backups YugabyteDB
- `PROBLEMAS_PENDIENTES.md` — Issues abiertos
- `ridf-orchestrator-state.json` — Estado orquestador RIDF

## Licencia
MIT / Apache-2.0 (verificar en repo)
