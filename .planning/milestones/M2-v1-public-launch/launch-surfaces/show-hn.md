# Show HN submission

Submitted to https://news.ycombinator.com/submit. Title is the most important field. Body is plain text — HN strips most markdown, so no headings, no lists, no inline code unless absolutely needed.

---

## Title

**Recommended default:** `Show HN: Claude Operator Stack – the install path 7 products taught me`

(74 chars including the `Show HN: ` prefix.)

### Two alternates

1. `Show HN: Claude Operator Stack – curated stack and playbook for solo founders` (78 chars)
2. `Show HN: Claude Operator Stack – the glue that runs 7 AI products solo` (70 chars)

Default reasoning: option 1 leads with the framing that does the work — the stack is *taught*, not designed. That phrasing pre-empts the "so it is just a list of links" reaction. Alternate 1 is closest in spirit but more passive; alternate 2 leans on the metric, which is good but less curiosity-shaped.

---

## URL field

`https://github.com/mccarthy606/claude-operator-stack`

(HN dedupes by URL. Submitting the GitHub URL — not a personal landing page — keeps the destination honest and avoids the "blog post linking to a repo" anti-pattern.)

---

## Body (the first comment)

HN convention: the submitter's first comment expands on the post, in plain prose, no marketing voice. Posted within five minutes of submission so it sits at the top of the comment thread. Maximum seven paragraphs of prose, no bullet lists, no headings.

> Most material on Claude Code and the broader Anthropic tooling is written for engineers extending the runtime — building skills, writing agents, hacking on the SDK. That is great work, and several of the components in this repo come directly from it. But there is a different audience that does not get its own playbook: people running multiple AI products in parallel using these tools as orchestration. Operators rather than engineers. Founders without a CS background. People who treat Claude Code as the loop that ties Stripe, WhatsApp, Supabase, Sentry, GA4, and a content pipeline together rather than as a chat companion.
>
> I started writing code in January 2026 with Cursor and Claude. Four months later I am running three live sites, four SaaS codebases that are code-complete, an active YouTube production pipeline, a daily-use AI assistant, and a small set of internal ops automations. Solo, pre-revenue, in Buenos Aires. I am posting this not because the products themselves are notable but because the stack and workflow that hold them together turned out to be reproducible, and friends started asking me to write it down. So I did.
>
> The repo is the install path I wish I had had on day one. It documents which marketplaces and plugins to install (4 core components — Claude Code, Obsidian, graphify for the knowledge-graph layer, Frontend-Design for UI — plus 2 opt-in extensions: Everything Claude Code for a broad skill catalog, Toprank for SEO and paid ads, and a curated MCP set on top), how to compose them into a workflow that does not collapse under context-switching across several products, and four anonymized case studies of products that came out of that workflow. There is a cookbook of twelve recipes pulled from real shipped integrations — Stripe Connect, the WhatsApp Cloud API webhook, Cloudflare Tunnel for local dev, Supabase pooling on Vercel, the yt-dlp plus Whisper research pipeline. There are six sanitized hooks from my own dotclaude directory with a per-hook README. There are two scaffolds that you copy, fill the env file, and run. And there are four operator profiles — indie hacker, freelancer, agency owner, content creator — each one an opinionated subset of the stack so that nobody has to install all of it on day one.
>
> What this is not: it is not a fork of anyone else's project, and it is not a runtime. Most of the components are credited back to their original authors in the same line they appear, and the credits file lists every one. The novel contribution is the install path, the workflows, the case studies, and the curation — the parts that say "of these 182 ECC skills, here are the 30 I actually call in a given month, organized by what I am trying to do." It is also not exhaustive vendor documentation; every recipe links out to the official docs for the long form.
>
> What I am most curious about: how this lands for people who are themselves running multiple products on Claude Code already. The bet is that there is a small but high-signal corner of the audience that has been quietly rolling their own version of this and will recognize the shape immediately. I would like to learn from them. The repo is MIT, issues and PRs are open, and there are seven good-first-issues tagged for translation work, a Windows install script, and a few small content gaps.
>
> A note on what this is not for. If you are a working engineer extending Claude Code itself, this is not the right stop — Everything Claude Code at https://github.com/affaan-m/everything-claude-code is. If you want a turnkey product that runs out of the box without any reading, this is not it either; the install script is honest about what it does and does not do, and the playbook assumes you will read before you copy. If you have shipped one product and want to ship a second on a similar stack, that is the case this is most useful for, and that is the case I optimized it for.
>
> Happy to take questions. The stack and the case studies are real and verifiable, the install script is auditable in one read, and I will be in the thread for the next several hours.

---

## Notes for the operator

- **Submit Tuesday or Wednesday morning ET.** That is the conventional best HN window (~7-9 AM ET, before the West Coast wakes up). Best guess from observation; not a hard rule.
- **Do not reply for the first 30 minutes.** Let the thread breathe. Your first comment posts immediately as the body above; that is the only one you owe in the first half-hour.
- **Engage every comment thread that has a substantive critique.** The "this is just a list of links" reaction is the one to handle most carefully — answer it directly, do not defensively. The repo *is* a list of links plus the install path plus the playbook plus four case studies; that combination is the contribution. Say so plainly.
- **Skip the dismissive "this is just X" replies.** Do not feed them. They sink without engagement.
- **If the post stalls in the first hour**, do not delete and re-submit — that gets you flagged. Take the L. Try again next month with a different angle.
- **If the post takes off**, monitor for the first six hours and answer questions in real time. After hour six, batch responses every 90 minutes.
- **Do not link your X thread from the HN comments.** Cross-promotion within the first 24h is read as engagement-farming and downvoted accordingly.
- **Flag-worthy account hygiene:** the submitting HN account should have a non-zero karma history. A throwaway account submitting a Show HN gets flagged within an hour.
