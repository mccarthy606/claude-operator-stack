# Multi-Brand Content Cross-Post Pipeline

> **Time:** ~1.5h (one-time setup, then minutes per published piece)
> **Stack:** ECC `crosspost` skill, brand-specific prompt presets, Obsidian as source of truth
> **Used in:** [YouTube Pipeline](../case-studies/youtube-pipeline.md) and the content side of every brand the operator runs

## The problem

You publish one piece of long-form content (YouTube video, blog post, podcast). You want platform-native versions on X, LinkedIn, Threads, and Instagram. You run more than one brand, and each brand has a different voice. You do not want to write five copies of the same idea, but you also do not want a generic "AI-rewritten for each platform" output that reads like a content factory.

The pipeline below uses the ECC `crosspost` skill plus brand-specific prompt presets stored in the Obsidian vault. One source script becomes platform-native variants that still sound like the brand they came from.

## Solution overview

Source script lives in `~/Brain/Content/<brand>/<piece>.md` with frontmatter declaring the brand. ECC's `crosspost` skill reads it, cross-references the brand's voice profile (also in the vault), and generates platform-specific variants that respect each platform's format and the brand's tone. Output goes back into the vault as drafts. You review, tweak, post.

The pipeline is reproducible because the brand presets are versioned alongside the content. New brand = new preset file. Drift = git diff.

## Step-by-step

### 1. Vault structure

```text
~/Brain/Content/
├── brands/
│   ├── brand-a.md          # voice + audience + format prefs for brand A
│   ├── brand-b.md
│   └── brand-c.md
├── brand-a/
│   ├── 2026-04-12-script.md
│   └── 2026-04-19-script.md
└── brand-b/
    └── 2026-04-15-script.md
```

`brands/<brand>.md` is a one-page voice profile. Frontmatter:

```yaml
---
brand: brand-a
audience: solo founders shipping AI products
voice:
  tone: terse, opinionated, operator-first
  banned: [marketing fluff, emojis, "in this article we will"]
  signature: ends posts with one concrete action
platforms:
  x:
    style: "thread, 6-10 tweets, hook in tweet 1, payoff in last"
    cta: "link to long-form in last tweet, no shortener"
  linkedin:
    style: "single post, 3-5 short paragraphs, no hashtags above the fold"
    cta: "link in first comment"
  threads:
    style: "single thought, 2-3 short paragraphs"
    cta: "no link, ask question to drive replies"
  instagram:
    style: "carousel, 6-8 slides, headline + body per slide"
    cta: "link in bio mention only"
---
```

### 2. Source script frontmatter

`~/Brain/Content/brand-a/2026-04-12-script.md`:

```yaml
---
brand: brand-a
title: "Why I stopped writing tests after the first user"
type: long-form
source_url: https://www.youtube.com/watch?v=<id>
status: published
---

[full script body — what the long-form actually said]
```

### 3. Run `crosspost` for one piece

In a Claude Code session inside the vault:

```text
/crosspost ~/Brain/Content/brand-a/2026-04-12-script.md
```

The skill reads:

1. The source script
2. The matching brand profile (`~/Brain/Content/brands/brand-a.md`)
3. The platforms declared in the brand profile

It generates one variant per platform and writes them to `~/Brain/Content/brand-a/2026-04-12-variants/`:

```text
2026-04-12-variants/
├── x-thread.md
├── linkedin.md
├── threads.md
└── instagram-carousel.md
```

### 4. Review + edit

The variants are drafts, not finals. Open each, read it as if you are the audience. Look for:

- Voice slips — does it sound like the brand or like AI prose?
- Platform format — is the X thread actually punchy or just paragraphs broken into tweets?
- The "would I actually post this" check — would you click Post on this without flinching?

The first 3-5 pieces will need significant editing. The brand profile gets sharper each time. After ~10 runs the variants land much closer to the final.

### 5. Brand voice tuning loop

When a variant is consistently off-brand in the same way (e.g. "the X thread always opens with a hook that sounds like marketing"), edit the brand profile, not the variant:

```yaml
voice:
  banned: [marketing fluff, emojis, "in this article we will", question hooks]
  rules:
    - "X threads must open with a concrete observation or a contrarian claim, never a question"
```

The next run picks this up. Avoid one-off prompt edits inside the skill call — they do not persist and the same variant ships wrong next time.

### 6. Multi-brand session

Running `crosspost` against a different brand uses the matching brand profile automatically (frontmatter `brand:` field). One session can iterate multiple brands without leakage:

```text
/crosspost ~/Brain/Content/brand-a/2026-04-12-script.md
# review
/crosspost ~/Brain/Content/brand-b/2026-04-15-script.md
# different brand voice, different platforms
```

Each call reads the right brand profile and treats the source independently.

### 7. Posting cadence

The pipeline produces drafts, not scheduled posts. Posting is manual on purpose — automated posters get caught in platform anti-spam flags and the savings are small compared to the risk of a brand account being limited.

For batch publishing, paste the variants into your scheduler of choice (Buffer, Typefully, Later) once a week. The pipeline saves the writing time, not the posting time.

## Pitfalls

- **One brand profile that covers all brands.** The whole point is per-brand voice. Maintain one file per brand, even if there is overlap.
- **Editing a variant instead of the profile.** A variant is a one-shot draft. Profile edits compound across every future run. Always ask "is this a one-time fix or a pattern?" — patterns go to the profile.
- **Platform format drift.** X changed its character limit, Threads adopted longer posts, LinkedIn restructured the feed. The brand profile encodes "what works on platform X today." Refresh the profile every few months or when a platform's UX shifts.
- **Skipping the source script step.** Cross-post variants generated directly from a video transcript without an intermediate "source script" reads like transcription. Always write a source script (even a rough one) so the variants have a coherent argument to compress.
- **Treating the variants as plagiarism risk.** They are paraphrases of your own content. The risk is the opposite — they sound too similar across platforms. Make each platform's variant lean hard into that platform's format, not into being a derivative of the script.

## References

- [ECC `crosspost` skill](https://github.com/snubroot/Everything-Claude-Code) (browse skills directory)
- [stack/ecc.md](../stack/ecc.md) — how this stack uses ECC
- [workflows/content-pipeline.md](../workflows/content-pipeline.md) — broader content workflow this slots into
- [recipe 08 — pulling source material](08-ytdlp-whisper-research.md)
- [case-studies/youtube-pipeline.md](../case-studies/youtube-pipeline.md)
