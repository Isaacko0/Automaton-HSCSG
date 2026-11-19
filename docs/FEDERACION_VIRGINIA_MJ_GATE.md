# Especificación: Federación Virginia — MJ Gate + RIDF (contención de fuga de capital)

Objetivo: evitar que capital salga de la federación posmonetaria sin aprobación asamblearia y firma dual. Cada repo conserva su licencia (MIT vs LPF-1.0); se comunican por HTTP firmado entre servicios separados.

## Endpoints federados (nodo Virginia como gobernanza)

### 1. Proponer transferencia cross_node
`POST /federation/virginia/propose`

Cuerpo:
```json
{
  "txID": "string (ulid)",
  "sender_node": "string",
  "receiver_node": "string",
  "amount": "bigint (unidad menor ZNU/FRNE)",
  "currency": "ZNU | FRNE | EUR",
  "tax_amount": "bigint",
  "created_at": "ISO8601",
  "purpose": "memoria | comida | cuidado_preventivo | excedente_libre",
  "metadata": {}
}
```

Respuesta: `202 Accepted` con `proposal_id` y estado `PROPOSED`.

### 2. Validación MJ Gate (pre-votación)
`POST /federation/virginia/mj-gate/validate`

Cuerpo: `{ "proposal_id": "string" }`

Validaciones:
- Umbral: monto <= tope de transferencia sin asamblea?
- Verificación triaxial: Mental (impacto nodo emisor), Simulación (escenario de fuga), Laboratorio (replay ledger histórico).
- Límites bilaterales/globales RIDF no excedidos.

Respuesta: `200` con `{ "authorized_to_vote": true|false, "motivo": "..." }`. Si `false`, la propuesta queda `REJECTED_MJ_GATE`.

### 3. Votación asamblearia D1–D8
`POST /federation/virginia/assembly/vote`

Cuerpo:
```json
{
  "proposal_id": "string",
  "miembro_id": "string (DID)",
  "voto": "aprobar | rechazar | abstener",
  "fondo_destino": "memoria | comida | cuidado_preventivo | excedente_libre"
}
```

Respuesta: `200` con conteo actual y `{ "umbral_alcanzado": true|false }`.

### 4. Autorización firmada por asamblea
`POST /federation/virginia/authorize`

Cuerpo: `{ "proposal_id": "string" }`

Requisito previo: MJ Gate aprobado + umbral de votación alcanzado.

Respuesta: `200` con `authorization_token` firmado por la asamblea (JWT o Ed25519).

### 5. Firma dual del nodo receptor (RIDF)
`POST /federation/transfer/sign`

Cuerpo:
```json
{
  "txID": "string",
  "receiver_node": "string",
  "receiver_signature": "string (Ed25519 sobre txID|sender_node|receiver_node|amount|created_at)",
  "authorization_token": "string"
}
```

El nodo emisor ya firmó al proponer. Sin `receiver_signature` válida contra `node_federation_keys`, la transacción se rechaza cerrado.

### 6. Ejecución condicional en ledger HSCSG
`POST /federation/transfer/execute`

Cuerpo:
```json
{
  "txID": "string",
  "sender_signature": "string",
  "receiver_signature": "string",
  "authorization_token": "string"
}
```

El ledger mutual (`src/ledger/mutual-credit.ts`) aplica débito/crédito solo si:
- `authorization_token` válido (Virginia)
- ambas firmas Ed25519 válidas
- límites de nodo no excedidos

Estado resultante: `EXECUTED` o `REJECTED`.

### 7. Consulta de estado
`GET /federation/transfer/status/{txID}`

Respuesta: `{ "txID", "estado", "sender_node", "receiver_node", "amount", "firma_dual", "autorizacion_virginia", "ejecutado_en" }`.

### 8. Consulta de límites
`GET /federation/limits/check?node={dominio}&amount={n}&currency={c}`

Respuesta: `{ "global_credit_limit", "global_debit_limit", "bilateral_credit_limit", "bilateral_debit_limit", "disponible" }`.

## Propagación federada
Después de `EXECUTED`, el gossip de RIDF (`internal/federation/gossip.go`) propaga la entrada de cadena hash (`prevHash`/`currentHash`) a los peers federados. La reconciliación periódica verifica consistencia entre nodos.

## Estados de la transferencia
`PROPOSED` → `MJ_GATE_VALIDADO` → `VOTANDO` → `AUTORIZADO` → `FIRMADO_DUAL` → `EXECUTED` → `SINCRONIZADO_FEDERADO`
Ramas de rechazo en cualquier paso: `REJECTED_MJ_GATE`, `REJECTED_ASAMBLEA`, `REJECTED_FIRMA_DUAL`, `REJECTED_LEDGER`.
