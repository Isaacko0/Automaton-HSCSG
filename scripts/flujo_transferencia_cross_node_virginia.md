# Flujo en disco: transferencia cross_node con contención de fuga de capital (Virginia + RIDF + HSCSG)

Este archivo describe el flujo de ejecución condicional para que una salida de capital de un nodo federado requiera aprobación de Virginia (MJ Gate + asamblea D1–D8) y firma dual RIDF.

## Actores
- **Nodo Emisor** (Automaton-HSCSG): propone el transfer, firma Ed25519, ejecuta el débito en ledger mutual.
- **Nodo Receptor** (RIDF / otro nodo federado): firma Ed25519 del payload.
- **Virginia** (Marca-Blanca-Zeitnus): MJ Gate + asamblea D1–D8, emite autorización firmada.
- **Ledger HSCSG** (`src/ledger/mutual-credit.ts`): aplica débito/crédito solo si todo válido.
- **Gossip RIDF** (`internal/federation/gossip.go`): propaga la entrada de cadena hash a peers.

## Flujo paso a paso

### Paso 1 — Propuesta (Nodo Emisor)
El operador o autómata crea un `cross_node` con `txID`, `sender_node`, `receiver_node`, `amount`, `currency`, `tax_amount`, `created_at`, `purpose`.
- Verifica límites bilaterales/globales mediante `GET /federation/limits/check`.
- Envía `POST /federation/virginia/propose`.
- Estado: `PROPOSED`.

### Paso 2 — MJ Gate (Virginia)
Virginia evalúa antes de permitir votación:
1. **Umbral:** ¿el monto supera el tope de transferencia sin asamblea?
2. **Verificación triaxial:** Mental (impacto en nodo emisor), Simulación (escenario de fuga de capital), Laboratorio (replay del ledger histórico).
3. **Límites RIDF:** ¿se respetan los límites de nodo?

Si falla cualquiera → `REJECTED_MJ_GATE`, fin del flujo.
Si pasa → estado `MJ_GATE_VALIDADO`.

### Paso 3 — Votación asamblearia (Virginia)
Miembros de la asamblea D1–D8 votan mediante `POST /federation/virginia/assembly/vote`.
- Opciones: aprobar / rechazar / abstener.
- Umbral configurado por tipo de fondo (memoria, comida, cuidado preventivo, excedente libre).
- Si no se alcanza el umbral en el plazo → `REJECTED_ASAMBLEA`.
- Si se alcanza → estado `VOTANDO` → `AUTORIZADO`.

### Paso 4 — Autorización firmada (Virginia)
Virginia emite `authorization_token` firmado por la asamblea mediante `POST /federation/virginia/authorize`.
- Estado: `AUTORIZADO`.

### Paso 5 — Firma dual (Nodo Receptor + RIDF)
El nodo receptor firma el payload Ed25519 sobre `txID|sender_node|receiver_node|amount|created_at` y envía `POST /federation/transfer/sign`.
- Verificación contra `node_federation_keys`; falla cerrado si falta clave del peer.
- Sin firma del receptor → `REJECTED_FIRMA_DUAL`.
- Estado: `FIRMADO_DUAL`.

### Paso 6 — Ejecución condicional (Ledger HSCSG)
El ledger mutual aplica el débito/crédito mediante `POST /federation/transfer/execute` solo si:
- `authorization_token` válido (Virginia)
- ambas firmas Ed25519 válidas
- límites de nodo no excedidos

Si falla cualquiera → `REJECTED_LEDGER`.
Si todo válido → `EXECUTED`.

### Paso 7 — Sincronización federada (Gossip RIDF)
El gossip propaga la entrada de cadena hash (`prevHash`/`currentHash`) a los peers federados.
- La reconciliación periódica verifica consistencia entre nodos.
- Estado final: `SINCRONIZADO_FEDERADO`.

## Estados posibles
| Estado | Significado |
|--------|-------------|
| PROPOSED | Propuesta creada, pendiente MJ Gate |
| MJ_GATE_VALIDADO | Pasó verificación triaxial y umbrales |
| VOTANDO | En votación asamblearia D1–D8 |
| AUTORIZADO | Asamblea aprobó, token emitido |
| FIRMADO_DUAL | Ambas firmas Ed25519 válidas |
| EXECUTED | Débito/crédito aplicado en ledger |
| SINCRONIZADO_FEDERADO | Propagado y reconciliado en red |
| REJECTED_MJ_GATE | Rechazado por MJ Gate (fuga de capital) |
| REJECTED_ASAMBLEA | Rechazado por falta de quórum/umbral |
| REJECTED_FIRMA_DUAL | Rechazado por firma inválida o faltante |
| REJECTED_LEDGER | Rechazado por ledger (límite excedido) |

## Regla de contención de fuga
Ningún `cross_node` sale del nodo sin:
1. Autorización de Virginia (MJ Gate + asamblea).
2. Firma dual Ed25519 (emisor + receptor).
3. Registro inmutable en libro federado con reconciliación de pares.

## Archivos relacionados
- `docs/FEDERACION_VIRGINIA_MJ_GATE.md` — especificación de endpoints.
- `src/ledger/mutual-credit.ts` — ledger mutuo con `cross_node`.
- `internal/federation/gossip.go` — propagación RIDF (repo separado, LPF-1.0).
- `src/heartbeat/gossip.ts` — esqueleto gossip HSCSG (pendiente de cliente HTTP real).
