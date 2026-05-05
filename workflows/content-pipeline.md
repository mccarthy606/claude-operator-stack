# Content Pipeline

How a one-person operation runs YouTube and Instagram across multiple brands without becoming a full-time content creator.

The trap: solo founders who try to "build in public" end up running a content company instead of a software company. The fix is automation everywhere except the parts that need a human's voice and face.

## Pipeline shape

```
   research      →   draft       →   record    →   edit     →   publish    →   distribute
   (Claude)         (Claude)         (human)        (Claude)     (manual)        (Claude)
```

Three of six steps are heavily Claude-assisted. Two are manual (recording on camera, hitting publish). Editing is hybrid.

## Step 1: Research (Claude)

For YouTube specifically: surface what's already working in my niche, find the angle that nobody has covered yet.

Tools used:
- ECC's `deep-research` skill (firecrawl + exa)
- yt-dlp + Whisper for competitor video transcripts
- ECC's `gsd-explore` skill for socratic narrowing

Output: a one-page brief in `~/Brain/Content/<topic>.md`. The brief is what I work from when scripting.

## Step 2: Draft (Claude)

Two flows depending on platform:

**YouTube long-form:** ECC's `content-engine` skill — produces a script with sections, B-roll markers, hooks. I rewrite ~30% to put my voice on it.

**Instagram + Threads:** Toprank-adjacent skills (cold-email, copywriting). Short-form needs heavy human edit because the voice is what people follow.

The output goes to `~/Brain/Content/<topic>.md` with frontmatter:

```yaml
---
tags: [content, platform/youtube, brand/<name>, status/draft]
target_platform: YouTube
hook: <one line>
length: 8-12 min
record_date: 
publish_date: 
---
```

## Step 3: Record (manual)

This step does not get AI in the loop, because the whole point of being on camera is the human signal. Claude wrote the script and I deliver it, sometimes verbatim and often as bullet points I riff from.

Setup is fixed and minimal: mirrorless camera, prime lens, lavalier mic, soft key light. Pre-staged so recording starts in under 5 minutes from "let's go."

## Step 4: Edit (hybrid)

For YouTube:
- Rough cut by hand in Premiere/Resolve
- Whisper-generated subtitles (yt-dlp pulls subs after upload, or local Whisper for pre-upload)
- ECC's `humanizer` skill on the auto-subs to clean obvious AI patterns

For Shorts/Reels:
- CapCut on iPad for vertical
- Aspect ratio + captions

The Claude-touched part is captioning + descriptions + tag suggestions. Not the cut itself — the cut is creative judgment.

## Step 5: Publish (manual)

Hit the button. No automation here because content scheduling tools introduce one more failure point and I would rather be in the platform's UI when I publish in case the algorithm shifts.

## Step 6: Distribute (Claude)

Cross-post the same idea, *not* the same content, to other platforms. ECC's `crosspost` skill handles the X/LinkedIn/Threads variants from the YouTube source.

Pin a comment on the YouTube video pointing to a related article on the brand's site. Drive traffic to owned property.

## Multi-brand orchestration

Three brands run through this pipeline:

- **Brand A** — automotive culture, mostly long-form YouTube + IG
- **Brand B** — practical (how-tos, tutorials), short-form IG + YT Shorts
- **Brand C** — solo operator content (this stack, AI workflows), X-first

Each brand has its own:
- `~/Brain/Content/<brand>/` directory
- Distinct voice (separate prompt presets in CLAUDE.md or a per-project note)
- Separate publish cadence

The mistake is letting one brand's voice bleed into another. The fix is brand-specific Obsidian directories + brand-specific prompt files.

## Cadence

| Brand | YouTube | Instagram | X / Threads |
|-------|---------|-----------|-------------|
| A | 1/month | 2/week | 0 |
| B | 0 | 4/week | 0 |
| C | 0 | 1/week | 5/week |

Publishing more does not produce better outcomes once you're past the discovery threshold. Better content with consistent cadence beats more content with chaotic cadence.

## Scope

The pipeline puts AI in the steps where it compresses time (research, drafting, captioning, cross-posting) and keeps humans in the steps where authenticity is the product (recording, voice, judgment about what to publish). Pure AI-generated content that the operator just publishes is detectable, hateable, and short-lived.

## Anti-patterns

- Outsourcing the voice. Your audience follows you, not your content tool.
- Cross-posting identical content to all platforms. Each platform punishes that.
- Letting the content pipeline eat the product week. If content >25% of your week and you're pre-revenue, the ratio is wrong.
