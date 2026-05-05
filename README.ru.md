<div align="center">

<img src="assets/hero.svg" alt="Claude Operator Stack — 7 продуктов · 4 месяца · 1 человек" width="100%"/>

[English](README.md) · **Русский** · [Español](README.es.md) · [Português (BR)](README.pt-br.md) · [Türkçe](README.tr.md) · [中文](README.zh.md) · [日本語](README.ja.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-Claude_Code_+_4_marketplaces-7c3aed)](#стек)
[![Status](https://img.shields.io/badge/status-active-22c55e)](#)
[![Last commit](https://img.shields.io/github/last-commit/mccarthy606/claude-operator-stack)](https://github.com/mccarthy606/claude-operator-stack/commits/main)
[![Built by](https://img.shields.io/badge/built_by-%40mccarthy606-orange)](https://github.com/mccarthy606)

**7 продуктов · 4 месяца · 0 инвестиций · 0 команды · 1 человек**

> Я начал писать код в январе 2026 года через Cursor + Claude.
> Через четыре месяца: 3 живых сайта, 4 готовых к запуску SaaS, 1 активный YouTube-канал.
> Соло. Без команды. Без CS-образования.
>
> Этот репозиторий — стек и плейбук, благодаря которым это стало возможным.

</div>

---

## Содержание

- [Что это такое](#что-это-такое)
- [Стек](#стек)
- [7 продуктов за 4 месяца](#7-продуктов-за-4-месяца)
- [Quick Start](#quick-start)
- [Что внутри](#что-внутри)
- [Operator Playbook](#operator-playbook)
- [Зачем это нужно](#зачем-это-нужно)
- [Благодарности](#благодарности)
- [Статус](#статус)
- [Лицензия](#лицензия)

---

## Что это такое

**Claude Operator Stack — это не форк.** Это набор куратора + operator-плейбук для соло-фаундеров, которые хотят запускать несколько AI-продуктов параллельно без команды.

Большинство «awesome Claude»-репозиториев просто сваливают список скилов в кучу. Этот делает обратное: выбирает **минимальный набор высокорычаговых компонентов**, которые реально складываются в дневной workflow, ссылается на оригинальных авторов и показывает *как они работают вместе* через реальные запущенные проекты.

Если ты:

- Соло-фаундер, ведущий 2+ продукта одновременно
- Не из CS-бэкграунда, используешь AI чтобы сжать build-цикл
- Оператор, для которого Claude Code должен быть тиммейтом, а не чатботом

— это для тебя.

---

## Стек

| Слой | Компонент | Автор | Что делает для меня |
|------|-----------|-------|---------------------|
| **Скилы + агенты** | [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) | [@affaan-m](https://github.com/affaan-m) | 182 скила, 48 агентов — основа для любой задачи |
| **SEO + реклама** | [Toprank](https://github.com/nowork-studio/toprank) | nowork-studio | Google Ads, Meta Ads, GEO, проверка битых ссылок |
| **Генерация UI** | [Frontend-Design](https://github.com/anthropics/claude-plugins-official) | Anthropic | Производство непохожих на шаблоны UI |
| **Память** | OMEGA Memory | local | Постоянный контекст между сессиями |
| **Second Brain** | [Obsidian](https://obsidian.md) | Obsidian | Vault `~/Brain` как контекст проектов и личности |
| **Оркестрация** | [Claude Code](https://www.anthropic.com/claude-code) | Anthropic | Среда выполнения |

Каждый скил, агент и промпт в стеке указывает оригинального автора. **Ничего не переименовано.** Если кусок откуда-то — ссылка ведёт туда.

См. [stack/](stack/) — разбор по компонентам.

---

## 7 продуктов за 4 месяца

Что этот стек реально запустил между январём и маем 2026.

| # | Продукт | Статус | Стек |
|---|---------|--------|------|
| 1 | Niche Booking Trio — 3 нишевых букинг-сайта | **Live** (3 домена) | Next.js · Supabase · GA4 · Sentry |
| 2 | P2P Marketplace — аренда классических авто | Код готов | Next.js · Stripe Connect · Prisma |
| 3 | WhatsApp B2B SaaS — для автодилеров | Код готов | FastAPI · Docker · WhatsApp Cloud API |
| 4 | AI Legal Tool — обжалование штрафов | Код готов | Next.js · Prisma · Claude API |
| 5 | YouTube production pipeline | **Live** (активно) | Python · yt-dlp · Whisper · Claude |
| 6 | Jarvis Workspace — личный AI-ассистент | **Live** (ежедневно) | Claude Code · Obsidian · OMEGA |
| 7 | Внутренняя ops-автоматизация | **Live** | hooks + skills + cron |

Подробнее в [case-studies/](case-studies/).

---

## Quick Start

Поднимает весь стек на чистой машине меньше чем за 5 минут. macOS + Linux, Windows через WSL.

> **Только один путь установки.** Стек жёстко придерживается одного метода. Не складывай `curl | bash` поверх ручного клона — конфликт гарантирован.

**Рекомендуемый — клон, аудит, запуск:**

```bash
git clone https://github.com/mccarthy606/claude-operator-stack.git
cd claude-operator-stack
less install.sh           # сначала прочитай
./install.sh --dry-run    # посмотри что будет сделано
./install.sh              # применить
```

Установщик:

1. Проверит, что `claude` CLI установлен (если нет — выйдет с инструкцией)
2. Покажет команды для marketplaces и плагинов, которые надо запустить внутри Claude Code
3. Скопирует sanitized шаблоны `settings.json` и `mcp-servers.json` в `~/.claude/` как **sidecar-файлы** — твой существующий конфиг никогда не перезаписывается молча
4. Распечатает чек-лист следующих шагов для добавления API-ключей

В `~/.claude/` ничего не пишется без явного подтверждения. Установщик поддерживает флаги `--dry-run` и `--yes`.

---

## Что внутри

```
claude-operator-stack/
├── README.md                    ← вы здесь
├── install.sh                   ← установщик (прочитай перед запуском)
├── CLAUDE.md                    ← мой проектный конфиг Claude (sanitized)
│
├── stack/                       ← разбор по компонентам
│   ├── ecc.md                   ← ECC — что использую, почему
│   ├── toprank.md               ← Toprank — SEO + Ads workflow
│   ├── frontend-design.md       ← генерация UI
│   ├── obsidian-brain.md        ← Obsidian как second brain
│   ├── omega-memory.md          ← OMEGA persistent memory
│   └── mcp-servers.md           ← MCP-серверы которые я запускаю
│
├── workflows/                   ← как я реально работаю
│   ├── ship-a-product-in-a-day.md
│   ├── parallel-projects.md     ← как ведутся 7 проектов одновременно
│   ├── obsidian-as-context.md   ← петля «второго мозга»
│   ├── content-pipeline.md      ← YouTube + IG автоматизация
│   └── solo-ops.md              ← как руководить компанией из одного человека
│
├── case-studies/                ← реальные продукты, не демо
│   ├── niche-booking-trio.md
│   ├── ai-legal-tool.md
│   ├── whatsapp-b2b-saas.md
│   └── youtube-pipeline.md
│
├── configs/                     ← sanitized конфиги для копирования
│   ├── settings.json.example
│   ├── mcp-servers.json.example
│   ├── hooks/                   ← мои кастомные hooks (читай перед установкой)
│   └── rules/                   ← мои правила
│
└── credits/                     ← атрибуция всех оригинальных авторов
    └── README.md
```

---

## Operator Playbook

Пять workflow которые реально определяют мою неделю.

### 1. Запустить продукт за день
От идеи до live URL за одну сфокусированную сессию. См. [workflows/ship-a-product-in-a-day.md](workflows/ship-a-product-in-a-day.md).

### 2. Параллельные проекты
Как 7 проектов остаются в работе без коллапса контекста. См. [workflows/parallel-projects.md](workflows/parallel-projects.md).

### 3. Obsidian как контекст
Почему каждый проект — это ещё и заметка в `~/Brain` — и как Claude Code из неё читает. См. [workflows/obsidian-as-context.md](workflows/obsidian-as-context.md).

### 4. Контент-пайплайн
YouTube + Instagram + drive2 на 3 бренда, в основном автоматизировано. См. [workflows/content-pipeline.md](workflows/content-pipeline.md).

### 5. Solo ops
Как один человек закрывает поддержку клиентов, биллинг, расписание и инфраструктуру. См. [workflows/solo-ops.md](workflows/solo-ops.md).

---

## Зачем это нужно

Большая часть AI-tooling-контента написана AI-инженерами для AI-инженеров. Этот написан оператором для операторов.

Я не пытаюсь убедить, что AI заменяет инженеров. Я показываю что **не-инженер с чётким списком проектов, выверенным стеком и петлёй, которая компаундирует**, может выпускать больше чем маленькая команда — если стек собран правильно.

Инструменты в этом репо — на ~95% работа других людей. Остальные 5% — это **клей, workflows и кейсы, которые превращают стек в одно целое вместо семи разрозненных штук**.

---

## Благодарности

Этот стек стоит на плечах:

- **[@affaan-m](https://github.com/affaan-m)** — Everything Claude Code. Основа из скилов и агентов.
- **nowork-studio** — Toprank. SEO, Google Ads, Meta Ads.
- **Anthropic** — Claude Code, Frontend-Design, API.
- **Команда Obsidian** — среда second-brain.
- **Каждый автор отдельных скилов**, указанный в `origin:` frontmatter и в [credits/README.md](credits/README.md).

Если ваша работа здесь и не указана — откройте issue, поправлю в тот же день.

---

## Статус

Репо **молодой**. v0.1 — это структура + sanitized конфиги + 5 workflow-черновиков. Кейсы заполняются в порядке shipping. CHANGELOG отслеживает что готово.

Issues, PR, форки — приветствуются. Особенно форки: стек предполагается кастомизировать под свой operator-профиль, а не копировать слово в слово.

---

## Лицензия

MIT. См. [LICENSE](LICENSE).

Компоненты, от которых зависит этот стек, имеют каждый свою лицензию — см. репозиторий каждого компонента и [credits/README.md](credits/README.md).
