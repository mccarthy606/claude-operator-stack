<div align="center">

<img src="assets/hero.svg" alt="Claude Operator Stack — 7 productos · 4 meses · 1 persona" width="100%"/>

[English](README.md) · [Русский](README.ru.md) · **Español** · [Português (BR)](README.pt-br.md) · [Türkçe](README.tr.md) · [中文](README.zh.md) · [日本語](README.ja.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-Claude_Code_+_4_marketplaces-7c3aed)](#el-stack)
[![Status](https://img.shields.io/badge/status-active-22c55e)](#)
[![Last commit](https://img.shields.io/github/last-commit/mccarthy606/claude-operator-stack)](https://github.com/mccarthy606/claude-operator-stack/commits/main)
[![Built by](https://img.shields.io/badge/built_by-%40mccarthy606-orange)](https://github.com/mccarthy606)

**7 productos · 4 meses · 0 inversión · 0 equipo · 1 persona**

> Empecé a escribir código en enero de 2026 con Cursor + Claude.
> Cuatro meses después: 3 sitios en vivo, 4 SaaS listos para lanzar, 1 canal de YouTube activo.
> Solo. Sin equipo. Sin título de CS.
>
> Este repo es el stack y el playbook que lo hicieron posible.

</div>

---

## Contenido

- [Qué es esto](#qué-es-esto)
- [El Stack](#el-stack)
- [7 productos en 4 meses](#7-productos-en-4-meses)
- [Quick Start](#quick-start)
- [Qué hay adentro](#qué-hay-adentro)
- [El Playbook del Operador](#el-playbook-del-operador)
- [Por qué existe](#por-qué-existe)
- [Agradecimientos](#agradecimientos)
- [Estado](#estado)
- [Licencia](#licencia)

---

## Qué es esto

**Claude Operator Stack no es un fork.** Es un toolkit curado + el playbook del operador para fundadores solo que quieren lanzar varios productos AI en paralelo sin equipo.

La mayoría de los repos «awesome Claude» tiran skills y listo. Este hace lo contrario: elige el **conjunto mínimo de componentes de alto apalancamiento** que realmente componen un workflow diario, atribuye a los autores originales y explica *cómo se usan juntos* a través de proyectos reales lanzados.

Si sos:

- Fundador solo lanzando 2+ productos al mismo tiempo
- Persona no-CS usando AI para comprimir el ciclo de build
- Operador que quiere que Claude Code sea un compañero de equipo real, no un chatbot

— esto es para vos.

---

## El Stack

| Capa | Componente | Autor | Qué hace por mí |
|------|-----------|-------|-----------------|
| **Skills + Agents** | [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) | [@affaan-m](https://github.com/affaan-m) | 182 skills, 48 agents — base para cualquier tarea |
| **SEO + Ads** | [Toprank](https://github.com/nowork-studio/toprank) | nowork-studio | Google Ads, Meta Ads, GEO, chequeo de links rotos |
| **Generación de UI** | [Frontend-Design](https://github.com/anthropics/claude-plugins-official) | Anthropic | UI distintiva, no template |
| **Memoria** | OMEGA Memory | local | Contexto persistente entre conversaciones |
| **Second Brain** | [Obsidian](https://obsidian.md) | Obsidian | Vault `~/Brain` como contexto de proyectos e identidad |
| **Orquestación** | [Claude Code](https://www.anthropic.com/claude-code) | Anthropic | El runtime |

Cada skill, cada agent y cada prompt en este stack acredita a su autor original. **Nada acá está re-marqueado.** Si una pieza viene de otro lado, es donde el link te lleva.

Ver [stack/](stack/) para notas de setup componente por componente.

---

## 7 productos en 4 meses

Lo que este stack realmente lanzó entre enero y mayo de 2026.

| # | Producto | Estado | Stack |
|---|---------|--------|------|
| 1 | Niche Booking Trio — 3 sitios de booking nicho | **Live** (3 dominios) | Next.js · Supabase · GA4 · Sentry |
| 2 | P2P Marketplace — alquiler P2P de autos clásicos | Código completo | Next.js · Stripe Connect · Prisma |
| 3 | WhatsApp B2B SaaS — para concesionarias | Código completo | FastAPI · Docker · WhatsApp Cloud API |
| 4 | AI Legal Tool — apelación de multas con AI | Código completo | Next.js · Prisma · Claude API |
| 5 | Pipeline de producción de YouTube | **Live** (activo) | Python · yt-dlp · Whisper · Claude |
| 6 | Jarvis Workspace — asistente AI personal | **Live** (uso diario) | Claude Code · Obsidian · OMEGA |
| 7 | Automatización ops interna | **Live** | hooks + skills + cron |

Ver [case-studies/](case-studies/) para el *cómo*.

---

## Quick Start

Levanta el stack completo en una máquina nueva en menos de 5 minutos. macOS + Linux soportados, Windows vía WSL.

> **Elegí un solo camino.** Este stack es opinionado sobre los métodos de install. No combines `curl | bash` encima de un clone manual — van a entrar en conflicto.

**Recomendado — clonar, auditar, correr:**

```bash
git clone https://github.com/mccarthy606/claude-operator-stack.git
cd claude-operator-stack
less install.sh           # auditalo primero
./install.sh --dry-run    # ver qué va a hacer
./install.sh              # aplicar
```

El instalador va a:

1. Verificar que `claude` CLI esté instalado (si no, sale con instrucciones)
2. Imprimir los comandos de marketplace + plugins que tenés que correr dentro de Claude Code
3. Copiar los templates sanitizados de `settings.json` y `mcp-servers.json` a `~/.claude/` como **archivos sidecar** — tu config existente nunca se sobrescribe en silencio
4. Imprimir el checklist de próximos pasos para sumar tus API keys

Nada se commitea a tu `~/.claude/` sin confirmación explícita. El instalador soporta los flags `--dry-run` y `--yes`.

---

## Qué hay adentro

```
claude-operator-stack/
├── README.md                    ← estás acá
├── install.sh                   ← instalador (auditalo antes de correr)
├── CLAUDE.md                    ← mi config Claude a nivel proyecto (sanitizada)
│
├── stack/                       ← setup componente por componente
│   ├── ecc.md                   ← ECC — qué uso, por qué
│   ├── toprank.md               ← Toprank — SEO + Ads workflow
│   ├── frontend-design.md       ← generación de UI
│   ├── obsidian-brain.md        ← Obsidian como second brain
│   ├── omega-memory.md          ← OMEGA persistent memory
│   └── mcp-servers.md           ← los MCP servers que corro
│
├── workflows/                   ← cómo trabajo realmente
│   ├── ship-a-product-in-a-day.md
│   ├── parallel-projects.md     ← 7 proyectos en vuelo a la vez
│   ├── obsidian-as-context.md   ← el loop del «second brain»
│   ├── content-pipeline.md      ← automatización YouTube + IG
│   └── solo-ops.md              ← manejar una empresa de una sola persona
│
├── case-studies/                ← productos reales lanzados, no demos
│   ├── niche-booking-trio.md
│   ├── ai-legal-tool.md
│   ├── whatsapp-b2b-saas.md
│   └── youtube-pipeline.md
│
├── configs/                     ← configs sanitizados para copiar
│   ├── settings.json.example
│   ├── mcp-servers.json.example
│   ├── hooks/                   ← mis hooks custom (auditalos)
│   └── rules/                   ← mis reglas
│
└── credits/                     ← atribución a cada autor original
    └── README.md
```

---

## El Playbook del Operador

Cinco workflows que realmente manejan mi semana.

### 1. Lanzar un producto en un día
De idea a URL en vivo en una sola sesión enfocada. Ver [workflows/ship-a-product-in-a-day.md](workflows/ship-a-product-in-a-day.md).

### 2. Proyectos paralelos
Cómo siete proyectos siguen en vuelo sin colapsar el contexto. Ver [workflows/parallel-projects.md](workflows/parallel-projects.md).

### 3. Obsidian como contexto
Por qué cada proyecto también es una nota en `~/Brain` — y cómo Claude Code lee de ahí. Ver [workflows/obsidian-as-context.md](workflows/obsidian-as-context.md).

### 4. Pipeline de contenido
YouTube + Instagram + drive2 en 3 marcas, casi todo automatizado. Ver [workflows/content-pipeline.md](workflows/content-pipeline.md).

### 5. Solo ops
Soporte al cliente, billing, scheduling e infra desde el calendario de una sola persona. Ver [workflows/solo-ops.md](workflows/solo-ops.md).

---

## Por qué existe

La mayoría del contenido sobre AI tooling lo escriben ingenieros de AI, para ingenieros de AI. Esto está escrito por un operador, para operadores.

No estoy tratando de convencerte de que AI reemplaza ingenieros. Te muestro que un **no-ingeniero con una lista clara de proyectos, un stack curado y un loop que compone** puede lanzar más que un equipo chico — si el stack está bien armado.

Las herramientas en este repo son ~95% trabajo de otra gente. El otro 5% es el **pegamento, los workflows y los case studies que hacen que el stack funcione como una sola cosa en lugar de siete**.

---

## Agradecimientos

Este stack se para sobre los hombros de:

- **[@affaan-m](https://github.com/affaan-m)** — Everything Claude Code. La base de skills + agents.
- **nowork-studio** — Toprank. SEO, Google Ads, Meta Ads.
- **Anthropic** — Claude Code, Frontend-Design, la API.
- **Equipo de Obsidian** — el runtime del second-brain.
- **Cada autor individual de skill** acreditado en el frontmatter `origin:` y en [credits/README.md](credits/README.md).

Si tu trabajo está acá y no está acreditado, abrí un issue — lo arreglo el mismo día.

---

## Estado

Este repo es **joven**. v0.1 es estructura + configs sanitizados + 5 workflow drafts. Los case studies se llenan en orden de shipping. El CHANGELOG trackea qué está hecho.

Issues, PRs y forks bienvenidos. Sobre todo forks — el stack está pensado para customizarse a tu propio perfil de operador, no para copiarse al pie de la letra.

---

## Licencia

MIT. Ver [LICENSE](LICENSE).

Los componentes de los que depende este stack tienen sus propias licencias — ver el repo de cada componente y [credits/README.md](credits/README.md).
