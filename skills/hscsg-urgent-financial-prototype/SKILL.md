---
name: hscsg-urgent-financial-prototype
description: Deploy HSCSG Tool Forge CaaS Micro-SaaS to Vercel.
---

# HSCSG Urgent Financial Prototype — Deployment Skill

## Contexto
- **Origen**: Skilio "5 skills para ganar dinero" + HSCSG v15 OS
- **Modelo**: CaaS con 3 tiers: FREE (ads), PRO (ZNU burn), ENTERPRISE (Trustlines B2B)
- **MVP Tool #1**: QR 3D Generator (PNG/SVG/3MF/STL + Three.js preview)
- **Deploy**: GitHub + Vercel (sin Hostinger, solo free tiers)

## Acciones Completadas ✅

### 1. Auditoría Legal Completa
- `docs/LICENSE_AUDIT_ASIMILACIONES.md` — 133 fuentes auditadas
- `fuentes_indice.json` actualizado con campos `licencia`, `riesgo_legal`, `tipo_contenido`, `auditada`
- NC-ND movidos a `docs/_licencia_incompatible/`
- GPL/AGPL aislados para microservicios

### 2. Skill "Botón Rojo Monumental"
- Ubicación: `~/.hermes/skills/boton-rojo-monumental-auditoria-licencias/`
- 6 fases automatizadas

### 3. Asimilación Nieves (8 PDFs → 6 docs + 6 módulos TS)
- Polignac, Beal, Subset Sum, Ecuación Funcional, Turing-Scriven/Blindcoin

### 4. HSCSG Tool Forge — Prototipo Completo
```
tool-forge/
├── frontend/          # Next.js 14 - DEPLOYADO EN VERCEL
│   ├── src/app/page.tsx              # Landing SEO + CaaS Economy + AdSense
│   ├── src/app/tools/[slug]/page.tsx # Runner universal + 3D preview
│   ├── src/components/CaaSWallet.tsx # Wallet DID, ZNU/FRNE, Tier upgrade
│   ├── src/lib/caas-engine.ts        # Cliente CaaS (SSR-safe)
│   └── src/tools/qr-3d-generator.ts  # QR 3D logic
├── tool-forge-backend/  # Backend Edge Functions - PENDIENTE
└── .github/workflows/tool-forge.yml  # CI/CD completo
```

### 5. Deploy Frontend Exitoso
- **Production**: `https://frontend-junyryr7p-holosociocibersimbiogenesis.vercel.app`
- **Alias**: `https://frontend-rouge-eta-35.vercel.app`
- Build: ✅ PASS

## Pendientes ⚠️

### 1. Deploy Backend (Edge Functions)
```bash
cd /c/Users/Isaacko0/HSCSG_v15_OS/tool-forge-backend
vercel --prod
```
- Configurar `NEXT_PUBLIC_CAAS_API_URL=https://<backend>.vercel.app`

### 2. AdSense Submit (empezar YA, tarda 1-2 semanas)
```
URL: https://frontend-rouge-eta-35.vercel.app
```

### 3. Daily CaaS Tick Automation
- GitHub Action configurado (2AM UTC)
- Requiere `GITHUB_TOKEN` con repo scope

## Rollback HSCSG v15
Commit objetivo: `b9ea2ed` (previo a `7c2ff34` - Skilio work)
```bash
git reset --hard b9ea2ed
git push --force-with-lease origin main
```

## Nuevo Repo: "Zeitnus Firma Operaciones Ecotomica"
- Fork/clone de HSCSG v15 en nuevo repo GitHub
- Conectar a Vercel deploy existente
- Mantener solo código Tool Forge + economics
