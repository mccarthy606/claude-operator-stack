<div align="center">

<img src="assets/hero.svg" alt="Claude Operator Stack — 7 продуктов · 4 месяца · 1 человек" width="100%"/>

[English](README.md) · **Русский** · [Español](README.es.md) · [Português (BR)](README.pt-br.md) · [Türkçe](README.tr.md) · [中文](README.zh.md) · [日本語](README.ja.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-Claude_Code_+_4_marketplaces-7c3aed)](#стек)
[![Status](https://img.shields.io/badge/status-active-22c55e)](#)
[![Last commit](https://img.shields.io/github/last-commit/mccarthy606/claude-operator-stack)](https://github.com/mccarthy606/claude-operator-stack/commits/main)
[![Built by](https://img.shields.io/badge/built_by-%40mccarthy606-orange)](https://github.com/mccarthy606)

**7 продуктов за 4 месяца · соло · до выручки**

> Я начал писать код в январе 2026 года через Cursor и Claude. Через четыре месяца: 3 живых сайта, 4 готовых к деплою SaaS-кодбейза, 1 активный YouTube-канал. Этот репозиторий — стек и плейбук, по которым я работаю.

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
- [Как это сравнивается](#как-это-сравнивается)
- [Благодарности](#благодарности)
- [Статус](#статус)
- [Лицензия](#лицензия)

---

## Что это такое

Подобранный набор инструментов и плейбук для соло-фаундеров, которые ведут несколько AI-продуктов одновременно.

Стек — это то, что я ставлю и обновляю. Плейбук — то, как я этим пользуюсь в течение недели: к чему обращаться в каком порядке, что читать первым, где швы.

Большая часть стека — это работа других людей, упомянутая там, где используется. Что добавлено здесь: путь установки, workflows которые соединяют части, и четыре кейса продуктов, построенных на этом стеке.

Адресовано тем, кто ведёт 2+ продукта одновременно, фаундерам без CS-бэкграунда, и всем кому нужно чтобы Claude Code делал реальную работу, а не был чат-собеседником.

---

## Стек

**Ядро (ставить всегда):**

| Слой | Компонент | Автор | Что делает для меня |
|------|-----------|-------|---------------------|
| **Оркестрация** | [Claude Code](https://www.anthropic.com/claude-code) | Anthropic | Среда выполнения |
| **Second Brain** | [Obsidian](https://obsidian.md) | Obsidian | Vault `~/Brain` как контекст проектов и личности |
| **Граф знаний** | graphify | local | Папка файлов → навигируемый граф знаний с детекцией сообществ |
| **Генерация UI** | [Frontend-Design](https://github.com/anthropics/claude-plugins-official) | Anthropic | Производство непохожих на шаблоны UI |

**Опционально (ставить под use case):**

| Слой | Компонент | Автор | Когда добавлять |
|------|-----------|-------|-----------------|
| **Скилы + агенты** | [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) | [@affaan-m](https://github.com/affaan-m) | Если нужен большой каталог skills + agents (182 скила, 48 агентов) |
| **SEO + реклама** | [Toprank](https://github.com/nowork-studio/toprank) | nowork-studio | Если делаешь SEO-аудиты или ведёшь Google/Meta Ads |

Каждый скил и агент в стеке указывает оригинального автора. Если кусок откуда-то, ссылка ведёт туда.

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
| 6 | Jarvis Workspace — личный AI-ассистент | **Live** (ежедневно) | Claude Code · Obsidian · graphify |
| 7 | Внутренняя ops-автоматизация | **Live** | hooks + skills + cron |

Подробнее в [case-studies/](case-studies/).

---

## Quick Start

Ставит стек на чистой машине. macOS и Linux; Windows через WSL.

> Выбери один путь установки. Не запускай `curl | bash` поверх ручного клона — они конфликтуют.

### Через bash (рекомендуется — клонировать, аудитировать, запустить)

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

### Через npm (node-native путь)

> **Будет доступно после публикации пакета в Phase 9.** До публичного запуска npm registry возвращает 404. Используй bash-путь выше, пока пакет не опубликован.

```bash
npx claude-operator-stack init --dry-run    # превью
npx claude-operator-stack init              # применить
npx claude-operator-stack verify            # аудит существующей установки
npx claude-operator-stack list-stack        # показать установленные компоненты
```

Тот же результат, что и `install.sh`, но другая эргономика. Визард ведёт через выбор marketplaces, копирует sanitized конфиги как sidecar-файлы (`*.from-operator-stack`) и печатает команды `/plugin`, которые ты запустишь внутри Claude Code.

---

## Что внутри

> Структура репозитория на v0.1 — обновление до v1.0 (cookbook, scaffolds, profiles, skills, packages) в [issue #8](https://github.com/mccarthy606/claude-operator-stack/issues/8). Полное актуальное дерево — в [англоязычном README](README.md#whats-inside).

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
│   ├── graphify.md              ← graphify слой графа знаний
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

Пять workflow, которые определяют мою неделю.

### 1. Запустить продукт за день
От идеи до live URL за одну сессию. См. [workflows/ship-a-product-in-a-day.md](workflows/ship-a-product-in-a-day.md).

### 2. Параллельные проекты
Семь проектов в работе без потери контекста между ними. См. [workflows/parallel-projects.md](workflows/parallel-projects.md).

### 3. Obsidian как контекст
У каждого проекта есть заметка в `~/Brain`; Claude Code читает её при старте сессии. См. [workflows/obsidian-as-context.md](workflows/obsidian-as-context.md).

### 4. Контент-пайплайн
YouTube, Instagram и drive2 на три бренда с большей частью продакшна автоматизированной. См. [workflows/content-pipeline.md](workflows/content-pipeline.md).

### 5. Solo ops
Поддержка клиентов, биллинг, расписание и инфраструктура из календаря одного человека. См. [workflows/solo-ops.md](workflows/solo-ops.md).

---

## Зачем это нужно

Большая часть материалов про AI-инструменты написана для инженеров. Это написано для операторов.

Ставка такая: не-инженер с компактным списком проектов, подобранным стеком и workflow, который компаундирует, может выпускать больше чем маленькая команда — при правильной настройке. Я не доказываю что AI заменяет инженеров; я документирую что один оператор может сделать с правильно загруженными инструментами.

Большая часть компонентов здесь — работа других людей. Моё — это клей: путь установки, workflows и кейсы, которые превращают семь отдельных проектов в один стек.

---

<!-- canonical: README.md § How this compares — keep in sync -->

## Как это сравнивается

Несколько человек заходят сюда с вопросом: это просто форк [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) или ещё один стартовый шаблон? Ни то, ни другое.

Три варианта ниже — это то, между чем обычно выбирает первый посетитель. Они местами пересекаются, но каждый закрывает свой тип работы. Таблица — это карта, а не рейтинг; выбирай колонку, которая совпадает с тем, как реально проходит твоя неделя.

Что такое каждая колонка:

- **Solo Stack** — это данный репозиторий. Установка из 4 ядерных + 2 опциональных компонентов плюс workflow, cookbook и case-studies, обёрнутые вокруг неё.
- **Everything Claude Code** — апстрим-библиотека skills и agents, на которой держится этот репозиторий. Делает и поддерживает [@affaan-m](https://github.com/affaan-m).
- **Стартовые шаблоны** — это ведро для `create-next-app`, ванильного Vite + Tailwind, T3 stack и других односреднефреймворковых скелетов.

| Параметр | Solo Stack | Everything Claude Code | Стартовые шаблоны |
|----------|------------|------------------------|-------------------|
| Аудитория | Соло-фаундер, ведущий 2+ продукта одновременно | Инженеры и AI dev-команды | Новички в веб-разработке и быстрые прототипы |
| Голос | Operator-first — workflow идёт перед кодом | Engineer-first — глубина по языковым экосистемам | Framework-first — форму задаёт Next.js / Vite / и т. д. |
| Объём стека | Подобранный набор из 4-ядро + 2-опционально с одним установочным путём | 182 skills + 48 agents в 12+ языковых экосистемах | Один фреймворк + стартер для auth/db |
| Поддержка нескольких сред | Только Claude Code | Claude Code, Cursor, Codex, OpenCode, Gemini, Antigravity | Привязано к фреймворку |
| Реально запущенное | 4 анонимизированных кейса из продуктов одного оператора | Свой продукт автора (`zenith.chat`) и шаблонные конфиги | Нет — это стартовая точка |
| Что добавлено своего | Workflows, cookbook на 12 рецептов, 6 хуков, 6 собственных skills | Большой каталог skills + agents, два npm-пакета | Скелет + boilerplate |

Коротко по аудитории:

- Возьми **Solo Stack**, если ведёшь несколько продуктов сразу и тебе нужен workflow, а не только конфиг.
- Возьми **Everything Claude Code**, если нужен большой каталог skills + agents и поддержка нескольких сред.
- Возьми **стартовый шаблон**, если делаешь свой первый веб-проект и хочешь happy path одного фреймворка.

Solo Stack и Everything Claude Code задуманы как совместимые — многие читатели здесь поставят и то, и другое. Cookbook-рецепты, profiles и case-studies в этом репозитории рассчитаны на то, что каталог скилов ECC уже стоит рядом; workflows описывают, как этот каталог реально используется на 2+ продуктах параллельно.

Если пришёл со стартового шаблона и в итоге у тебя открыто 3 разных проекта в 3 папках — та часть, которую Solo Stack пытается закрыть, лежит *над* шаблоном: workflow, cookbook, установочный путь под профиль и case-studies, показывающие что вышло на реальных продуктах.

Если пришёл с Everything Claude Code и хочешь рабочий пример того, как оператор гоняет каталог не на одном репозитории, а на списке продуктов — case-studies и workflows здесь как раз и сделаны как этот рабочий пример.

---

## Благодарности

Собрано с использованием:

- [@affaan-m](https://github.com/affaan-m) — Everything Claude Code (скилы и агенты)
- nowork-studio — Toprank (SEO, Google Ads, Meta Ads)
- Anthropic — Claude Code, Frontend-Design, API
- Команда Obsidian — среда second-brain
- Каждый автор отдельных скилов, указанный в `origin:` frontmatter и в [credits/README.md](credits/README.md)

Если ваша работа здесь и не указана, откройте issue — поправлю в тот же день.

---

## Статус

Молодой репо. В v0.2 добавлены hero-баннер, Mermaid-диаграммы, навигация на 7 языков и полные переводы на RU и ES. Кейсы заполняются по мере shipping. CHANGELOG отслеживает остальное.

Issues, PR, форки приветствуются. Стек спроектирован для кастомизации: бери что подходит, отбрасывай что нет.

---

## Лицензия

MIT. См. [LICENSE](LICENSE).

Компоненты, от которых зависит этот стек, имеют каждый свою лицензию — см. репозиторий каждого компонента и [credits/README.md](credits/README.md).
