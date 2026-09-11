# hscsg-monetary-integration

Skill de Hermes Agent para integrar sistemas monetarios alternativos en documentos HSCSG.

## Qué hace

- Integra profundamente referentes monetarios (Moneda Libre G1, Túmin, Moneda PAR, Bitcoin, stablecoins soberanas, bancos de tiempo) en `modelo-negocio-objetivos-civilizatorios-hscsg.md`.
- Extrapola principios estructurales, no solo describe las referencias.
- Actualiza arquitectura ZCS/ZNU, métricas, riesgos y glosario.
- Incluye scripts de verificación post-integración.

## Estructura

```
hscsg-monetary-integration/
├── SKILL.md                              # Skill principal
├── README.md                             # Este archivo
├── scripts/
│   ├── verify_hscsg.py                  # Verifica integridad del documento
│   └── integrate_reference.py           # Placeholder para nuevas integraciones
└── references/
    └── monetary-integrations.md         # Historial de integraciones aplicadas
```

## Uso rápido

```bash
# Verificar estado del documento HSCSG
python scripts/verify_hscsg.py

# Verificar estado de un referente
python scripts/integrate_reference.py --referente PAR

# Integrar nuevo referente (manual, siguiendo SKILL.md)
# 1. Leer sección 14 del documento
# 2. Extraer principios
# 3. Aplicar modificaciones con patch/execute_code
# 4. Verificar con verify_hscsg.py
```

## Integraciones incluidas

| Referente | Tipo | Sección HSCSG |
|-----------|------|---------------|
| Moneda Libre G1 | Creación democrática / DU | 14.1, 14.2, Glosario |
| Túmin | Circuito cerrado local | 14.1, 14.2, Glosario |
| Moneda PAR | Trueque comunitario | 14.1, 14.2, 14.6, Glosario |

## Notas

- El documento objetivo es `C:\Users\Isaacko0\modelo-negocio-objetivos-civilizatorios-hscsg.md`.
- Esta skill está diseñada para ser ejecutada desde Hermes Agent con herramientas `read_file`, `patch`, `execute_code`, `web_search`, `web_extract`.
- Desarrollada para el proyecto HSCSG (Holosociocibersimbiogénesis) bajo La Cuaternidad Soberana.
