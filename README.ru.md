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
- [Длинные доки](#длинные-доки)
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

Репозиторий — четырёхслойный набор: `stack/` с подобранными компонентами, `workflows/` которые их соединяют, артефакты (`cookbook/`, `case-studies/`, `scaffolds/`, `profiles/`, `skills/`) и обвязка (`configs/`, `commands/`, `docs/`, `tests/`, `credits/`). Верхний уровень:

```
claude-operator-stack/
├── stack/                       ← разбор 4 ядерных + 2 опциональных компонентов
├── workflows/                   ← 5 операторских плейбуков
├── case-studies/                ← 4 анонимизированных продукта
├── cookbook/                    ← 12 рецептов для копипасты
├── skills/                      ← 6 собственных SKILL.md пакетов
├── commands/                    ← 6 slash-команд поверх skills
├── scaffolds/                   ← web-saas + whatsapp-saas
├── profiles/                    ← 4 архетипа установки
├── packages/cli/                ← npm CLI рядом с install.sh
├── configs/                     ← sanitized settings/hooks/rules
├── docs/                        ← длинные гайды и вынесенные разделы
├── tests/                       ← E2E интеграционные тесты
└── credits/                     ← атрибуция всех оригинальных авторов
```

[Полное аннотированное дерево →](docs/whats-inside.md)

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

Solo Stack — это operator-first обёртка вокруг Claude Code; Everything Claude Code (ECC) — апстрим-каталог skills + agents, на котором держится репо; стартовые шаблоны — это framework-first скелеты. Solo Stack и ECC задуманы как совместимые — многие поставят и то, и другое.

[Полное сравнение →](docs/comparing-stacks.md)

---

## Длинные доки

Артефакты, которые не вписываются в задачу README быть первой точкой входа: полная таблица сравнения, аннотированное дерево, нарративный changelog и обоснование single-harness объёма.

См. [docs/README.md](docs/README.md) — индекс длинных доков (на английском; перевод отложен).

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
