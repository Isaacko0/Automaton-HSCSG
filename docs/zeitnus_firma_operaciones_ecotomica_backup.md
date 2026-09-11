# Backup: Zeitnus-Firma-Operaciones-Ecotomica

**Repo origen:** https://github.com/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica (private)
**Clonado local:** /c/Users/Isaacko0/Zeitnus-Firma-Operaciones-Ecotomica/
**Fecha asimilación:** 2026-09-11

## Qué es
Repo de despliegue para "Zeitnus Firma Operaciones Ecotomica" — contiene el **HSCSG Tool Forge** (CaaS-powered Micro-SaaS Generator) completo con:
- Frontend Next.js 14 (React + TypeScript + Tailwind)
- Backend Edge Functions (CaaS Engine, Tool Generator, QR 3D Generator)
- CI/CD GitHub Actions (Lint → Test → Build → Deploy Vercel → Daily CaaS Tick)
- Skill de deployment documentada

## Stack
- **Frontend:** Next.js 14.1, React 18, TypeScript 5.3, Tailwind 3.4, lucide-react
- **Backend:** TypeScript (Edge Functions), Three.js, qrcode, zustand
- **Deploy:** Vercel (Frontend + Backend), GitHub Actions CI/CD
- **Economía:** CaaS (ZNU/FRNE/Trustlines/LoopEngine/PriceParity)

## Estructura clave
```
tool-forge/
├── frontend/          # Next.js 14 App Router
│   ├── src/app/page.tsx              # Landing SEO + CaaS Economy + AdSense
│   ├── src/app/tools/[slug]/page.tsx # Runner universal + 3D preview + Export
│   ├── src/components/CaaSWallet.tsx # Wallet DID, ZNU/FRNE, Tier upgrade
│   ├── src/lib/caas-engine.ts        # Cliente CaaS (SSR-safe)
│   ├── src/lib/tool-generator.ts     # Types + 5 MVP specs
│   └── src/tools/qr-3d-generator.ts  # QR 3D logic
├── backend/             # Edge Functions (mismo código que tool-forge-backend/)
│   ├── caas-engine.ts
│   ├── tool-generator.ts
│   └── qr-3d-generator.ts
├── tool-forge-backend/  # Backend standalone deployado
└── .github/workflows/tool-forge.yml  # CI/CD completo
```

## Licencia
MIT (heredado de HSCSG_v15_OS)

## Despliegue actual
- **Frontend:** https://frontend-rouge-eta-35.vercel.app
- **Backend:** https://tool-forge-backend.vercel.app
