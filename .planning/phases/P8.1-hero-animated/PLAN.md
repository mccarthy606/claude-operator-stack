---
phase: P8.1-hero-animated
milestone: M2 — v1.0 Public Launch
status: ready-to-execute
agent_runnable: true
depends_on: []
parallelisable_with: [P8.2, P8.3, P8.4]
files_modified:
  - assets/hero.svg
  - README.md
  - README.ru.md
  - README.es.md
  - README.pt-br.md
  - README.tr.md
  - README.zh.md
  - README.ja.md
  - CHANGELOG.md
estimated_effort: 3-4h
---

# PLAN: P8.1 — Animated hero visual

## Objective

Replace the current static-with-blinking-cursor `assets/hero.svg` with a richer animated SVG that depicts the **operator-loop in motion** — directory open → Claude reads project note → ship → next project — and reads as a 5-10 second screencap of a solo founder's workflow without exposing real vault contents. The new SVG must inline-render and loop natively on github.com (light + dark theme), stay ≤500KB (target ≤50KB), and replace the existing file in-place to avoid touching the 7 README references unnecessarily — except to optionally refresh alt text.

**Non-goals (explicit):**
- Not a video file (`.webm`/`.mp4`) — GitHub markdown does not loop video natively.
- Not a redesign of the brand palette or layout proportions — preserve continuity with existing hero (gradient palette, mono font, viewBox 1280×360).
- Not a multi-asset light/dark fork — one SVG must work on both themes.
- Not a reduced-motion variant in a separate file — handled inline via CSS `@media (prefers-reduced-motion)`.

---

## 1. Approach choice — animated SVG, not APNG

**Decision: animated SVG using SMIL `<animate>` / `<animateTransform>` elements + an inline `<style>` block for CSS keyframes.**

**Reasoning:**

| Criterion | Animated SVG (SMIL + inline CSS) | APNG (animated PNG) |
|---|---|---|
| Loops inline on github.com | yes, native | yes, native |
| File size for ~10s loop | 5-30KB realistic | 200-2000KB realistic |
| Crisp at any container width | yes (vector) | no (rasterised at fixed resolution) |
| Text-rendering quality | native font, sharp | rasterised text gets fuzzy on retina |
| Dark/light theme adaptation | one file works on both | one file works on both |
| `prefers-reduced-motion` respect | possible via inline CSS media query | not possible — frames hardcoded |
| Browser support (Chrome/Firefox/Safari) | SMIL: Chrome ✓, Firefox ✓, Safari ✓ (still supported despite 2015 deprecation rumours); CSS in SVG: ✓ all three | universal |
| Edit-in-place after launch | text edit | re-render via tool |
| Author tooling needed | text editor only | aseprite / ffmpeg / apngasm |

**Verdict:** animated SVG wins on file size, sharpness, edit-ability, and reduced-motion support. The current hero is already SVG with a SMIL `<animate>` on the cursor — extending that path is consistent with the existing asset.

**Mitigation for SMIL browser inconsistency:** prefer **CSS animations inside SVG via `<style>`** for opacity/transform animations (universal support) and only use SMIL `<animate>` where it is the natural fit (e.g. discrete attribute values that don't translate cleanly to CSS). All three target browsers (Chrome, Firefox, Safari) support both paths; no Edge-legacy concern in 2026.

---

## 2. Visual direction — 6 cues over a 10-second loop

The animation tells a six-beat story of one operator-loop iteration. Layout reuses the existing 1280×360 viewBox and the `$ claude --operator` / "Claude Operator Stack" / stat-row composition so the brand reads instantly. The animation lives in a **right-half panel** (roughly x=720 to x=1240) overlaid on the existing background; the left half (title + subtitle + stat row) stays static for legibility.

**Beat 1 (t=0.0s → 1.5s) — Directory tree fades in.**
A compact mono-font directory tree appears in the right panel, lines staggered:
```
~/Brain/Projects/
├── marketplace.md
├── saas-kit.md
└── pipeline.md
```
Each line fades in 0.2s after the previous (opacity 0 → 1, no transform — keeps it cheap on the compositor).

**Beat 2 (t=1.5s → 3.0s) — Highlight "marketplace.md".**
A subtle accent rectangle (10% opacity → 25% opacity, accent gradient fill) slides under `marketplace.md`. A tiny "read" caret blinks once next to it. Communicates: Claude is reading this note.

**Beat 3 (t=3.0s → 5.0s) — Project note opens (right of tree).**
A small panel slides in from the right (translateX from +60 to 0, opacity 0 → 1) showing 3-4 lines of generic project-note shape:
```
# marketplace
status: shipping
next: stripe-connect
```
No real project name, no real path, no real status that maps to a real product.

**Beat 4 (t=5.0s → 6.5s) — Action: a green checkmark + "shipped" tag pulse.**
A small green dot (currently used as caret colour `#22c55e`) appears next to `next: stripe-connect`, then a soft "✓" stroke draws in (stroke-dashoffset animation). Communicates: the loop closed.

**Beat 5 (t=6.5s → 8.0s) — Highlight slides to "saas-kit.md".**
The accent rectangle from beat 2 translates down (translateY) to underline the next file. The opened panel from beat 3 fades out (opacity 1 → 0). Communicates: next project.

**Beat 6 (t=8.0s → 10.0s) — Hold + reset.**
The directory tree holds with the accent on `saas-kit.md` for ~1s, then everything fades to opacity 0 over 1s. Loop restarts at t=10s with `repeatCount="indefinite"` (or CSS `animation-iteration-count: infinite`).

**Static-frame fallback for `prefers-reduced-motion`:**
When `@media (prefers-reduced-motion: reduce)` matches, all `animation` properties get `animation: none` and the **directory tree + opened panel + accent on `marketplace.md`** display in their final beat-3 state (the most informative single frame). No motion, full information.

---

## 3. Color palette — preserve brand, verify dual-theme legibility

Reuse the existing palette from `assets/hero.svg`:

| Role | Hex | Where used | Light-mode legibility (#fff bg) | Dark-mode legibility (#0d1117 bg) |
|---|---|---|---|---|
| Background top | `#0a0a0f` | gradient stop 0 | n/a (this is the bg) | n/a |
| Background bottom | `#161821` | gradient stop 1 | n/a | n/a |
| Accent purple | `#7c3aed` | accent gradient start | contrast 6.4:1 ✓ | contrast 4.1:1 ✓ |
| Accent cyan | `#22d3ee` | accent gradient mid, prompt text | contrast 2.6:1 (LARGE TEXT only) | contrast 8.1:1 ✓ |
| Accent green | `#22c55e` | accent gradient end, cursor, "shipped" check | contrast 2.4:1 (LARGE TEXT only) | contrast 8.4:1 ✓ |
| Title | `#f4f4f5` | "Claude Operator Stack" headline | n/a (sits on dark bg) | contrast 17.1:1 ✓ |
| Subtitle | `#a1a1aa` | tagline | n/a (sits on dark bg) | contrast 7.0:1 ✓ |
| Stat text | `#e4e4e7` | "7 products · 4 months …" | n/a (sits on dark bg) | contrast 14.5:1 ✓ |
| Separator dot | `#52525b` | · between stat fields | n/a | contrast 4.0:1 ✓ |
| Grid | `#1f2330` | bg pattern | n/a | n/a |

**Dark-mode legibility check:** the SVG ships **its own dark background** (the `<rect width="1280" height="360" fill="url(#bg)"/>` in the existing file). It does NOT rely on the GitHub page background. Therefore:
- On GitHub light theme (`#ffffff` page): the SVG renders as a self-contained dark rectangle — text is white-on-dark inside the SVG, perfectly legible.
- On GitHub dark theme (`#0d1117` page): the SVG's dark bg blends near-seamlessly with the page bg — text is white-on-dark inside the SVG, perfectly legible.

This is the same strategy the current static hero uses, and it works. **No transparent-bg trick required, no `<picture>` element with `prefers-color-scheme` swap required.**

---

## 4. Animation timing — 10s total, easing, pause points

**Total loop:** 10 seconds. Above the 8-12s target window's lower bound, well below the 15s hard cap. Long enough that the six beats breathe; short enough that a casual visitor sees the full loop while skimming.

**Per-beat timing:**

| Beat | Description | Start | End | Duration | Easing |
|---|---|---|---|---|---|
| 1 | Directory tree fade-in (staggered) | 0.0s | 1.5s | 1.5s | `ease-out` |
| 2 | Highlight on `marketplace.md` slides under | 1.5s | 3.0s | 1.5s | `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) |
| 3 | Project note panel slides in | 3.0s | 5.0s | 2.0s | `ease-out` |
| 4 | "Shipped" check stroke-draws | 5.0s | 6.5s | 1.5s | `ease-out` |
| 5 | Highlight slides to `saas-kit.md` + panel fades out | 6.5s | 8.0s | 1.5s | `ease-in-out` |
| 6 | Hold + fade to reset | 8.0s | 10.0s | 2.0s | `ease-in` |

**Designed pause points (frames a reader's eye can rest on):**
- t=1.5s — full directory tree visible, no other motion
- t=3.0s — accent fully under `marketplace.md`, panel about to enter
- t=5.0s — project note panel fully visible, content readable
- t=6.5s — green check fully drawn next to `stripe-connect`
- t=8.0s — accent under `saas-kit.md`, panel gone

**Loop boundary handling:** at t=10.0s every animated property snaps back to the t=0.0s state via `animation-iteration-count: infinite`. To avoid a visible jump, beat 6's fade-out at t=8.0s-10.0s lands all elements at opacity 0 — which is identically the state at t=0.0s before beat 1 fades them in.

**Compositor-friendly properties only:** every animation drives `opacity`, `transform: translateX/translateY`, or `stroke-dashoffset`. No `width`/`height`/`x`/`y` animation that would re-layout. (Aligns with `~/.claude/rules/web/performance.md`.)

---

## 5. Implementation steps — agent-runnable checklist

Numbered, sequential, no mid-phase user input required. Each step has an explicit done-state.

1. **Read current `assets/hero.svg`** (already done in this plan; see "Visual direction" for reused composition). Done: structure understood, gradients + viewBox + font preserved.

2. **Sketch the animation in plain text** as a beat-by-beat list of element + property + start + end + easing. Done: 6 beats × 3-5 elements per beat enumerated in a scratchpad.

3. **Author the new SVG** at `assets/hero.svg` (in-place replacement). Structure:
   - Reuse existing `<defs>` block (gradients, grid pattern).
   - Keep existing left-half static elements: prompt marker, title, subtitle, stat row, corner version mark, top/bottom accent bars.
   - **Remove** the existing standalone blinking-cursor `<rect>` at x=76,y=316 — its role is taken over by the new animation panel on the right half.
   - **Add** an inline `<style>` block with CSS `@keyframes` for opacity + transform + stroke-dashoffset animations, plus a `@media (prefers-reduced-motion: reduce)` block that sets `animation: none` and forces final-frame static state.
   - **Add** a right-half group `<g id="loop-panel" transform="translate(720,80)">` containing:
     - Directory tree (`<text>` lines, fade-in staggered via `animation-delay`)
     - Accent highlight rect (translateY animation between two y-positions)
     - Project note panel (`<g>` with translateX + opacity animation)
     - Shipped check (`<path>` with stroke-dasharray + stroke-dashoffset animation)
   - Use `animation: <name> 10s infinite` so all sub-animations share the same cycle.

4. **Local browser sanity-check** — three browsers, three commands:
   ```bash
   open -a "Google Chrome" /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg
   open -a "Safari" /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg
   open -a "Firefox" /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg
   ```
   Visually confirm: animation runs, loops at ~10s, no console errors, no clipped elements. If Firefox is not installed, fallback: use `osascript` to confirm only Chrome + Safari and document the Firefox-untested status in CHANGELOG. Done: at least Chrome + Safari render the animation cleanly with no visible glitches.

5. **Verify reduced-motion fallback** — in macOS System Settings → Accessibility → Display → Reduce motion: ON. Reload the file in Chrome. Confirm the animation does NOT play, and the static frame shown matches beat-3 state (full tree + accent under `marketplace.md` + opened panel visible). Then revert the macOS setting. (Alternative: temporarily edit the SVG's media query to always-on, verify, revert — this avoids touching system settings.)

6. **Verify file size ≤500KB** (target ≤50KB given vector-only content):
   ```bash
   ls -la /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg
   wc -c /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg
   ```
   Done: byte count well under 500KB. If somehow over (won't happen for inline-CSS SVG), simplify: drop the staggered fade-in delays, collapse the directory tree to 2 lines instead of 3.

7. **Verify the `<img>` tag in `README.md`** still points at `assets/hero.svg` and the alt text is still accurate (it already says "7 products · 4 months · 1 person" which remains true). No edit required unless beat content changes the message. Done: line 3 of README.md unchanged.

8. **Verify all 6 translated READMEs** still point at `assets/hero.svg`. Since this is an in-place replacement, **no edits required** — the `<img src="assets/hero.svg" …>` tags continue to resolve. Confirm with:
   ```bash
   cd /Users/mccarthy606/Projects/claude-operator-stack && \
     grep -n 'src="assets/hero\.' README.md README.ru.md README.es.md README.pt-br.md README.tr.md README.zh.md README.ja.md
   ```
   Expected: 7 matches, all pointing at `assets/hero.svg`. Done: no README needs an `<img>` edit.

9. **Sanitisation grep** — verify the new SVG ships only generic project names:
   ```bash
   cd /Users/mccarthy606/Projects/claude-operator-stack && \
     grep -E '(brain-vault|mccarthy|dimana503|McCarthy|dmitry|Dmitry)' assets/hero.svg && \
     echo 'FAIL: real identifier leaked' || echo 'PASS: no real identifiers'
   ```
   Done: PASS. Project names in the SVG are exactly `marketplace.md`, `saas-kit.md`, `pipeline.md`.

10. **Update `CHANGELOG.md`** with an unreleased entry under the relevant section (e.g. `### Changed` or `### Added`):
    > - Replace static `assets/hero.svg` with an animated 10s loop showing the operator-loop in motion (P8.1). Same brand palette, `prefers-reduced-motion` respected, ≤50KB.

11. **Final visual diff** before commit:
    ```bash
    cd /Users/mccarthy606/Projects/claude-operator-stack && git diff --stat assets/hero.svg CHANGELOG.md
    cd /Users/mccarthy606/Projects/claude-operator-stack && git status
    ```
    Done: only `assets/hero.svg` and `CHANGELOG.md` show as modified. No README changes (good — confirms in-place replacement worked). No other files staged.

12. **Commit** with conventional-commits format:
    ```
    feat(hero): animate operator-loop in hero.svg (P8.1)
    ```
    Body: 2-3 lines summarising beats + dual-theme strategy + reduced-motion handling.

---

## 6. Success criteria (verbatim from ROADMAP §8.1, with local refinements)

1. **New `assets/hero.svg`** (animated SVG, in-place replacement — picked over webm/mp4 because GitHub markdown does not loop video natively, and over APNG because vector + smaller + sharper at retina). [from ROADMAP]
2. **README.md `<img>` tag still points at the new asset** — in-place replacement preserves the existing tag without edit. [refines ROADMAP "updated to point at new asset" — no update needed because the path is unchanged.]
3. **Loop ≤15 seconds** — actual: 10 seconds. **File ≤500KB** — actual target: ≤50KB. [from ROADMAP]
4. **Renders cleanly in dark and light theme** — SVG ships its own dark background, white text reads on both `#fff` and `#0d1117` page backgrounds. [from ROADMAP]
5. **Privacy-safe** — only generic project names (`marketplace.md`, `saas-kit.md`, `pipeline.md`); no real vault contents, no real domains, no operator identifiers. Verified by step-9 grep. [from ROADMAP]
6. **All 6 translated READMEs continue to render the new asset** — verified by step-8 grep; no edits required because path is unchanged. [refines ROADMAP "updated to point at new asset" — same reasoning as success-criterion 2.]
7. **`prefers-reduced-motion` respected** — inline `@media (prefers-reduced-motion: reduce)` block disables animations and forces a static informative frame (beat-3 state). [from ROADMAP]

**Local refinement vs ROADMAP:** ROADMAP success-criteria 2 and 6 say "updated to point at the new asset." This plan replaces the asset **in-place** at the same path, so those updates become **no-op verifications** (we confirm the existing tags still resolve). This is intentional — touching 7 README files for a path that didn't change would be churn. If a future iteration renames the file (e.g. `hero-animated.svg`), the success criteria flip back to literal updates.

---

## 7. Verification commands — concrete, runnable, one per criterion

```bash
# Criterion 1: new SVG exists, is animated (contains <animate> or @keyframes)
test -f /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg && \
  grep -E -l '(@keyframes|<animate|<animateTransform)' /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg && \
  echo 'PASS: animated SVG present' || echo 'FAIL'

# Criterion 2: README.md still references assets/hero.svg
grep -c 'src="assets/hero\.svg"' /Users/mccarthy606/Projects/claude-operator-stack/README.md
# Expected: 1

# Criterion 3a: loop length — find the longest animation-duration / dur attribute
grep -oE '(animation-duration|dur)[: =]+"?[0-9.]+s' /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg | sort -u
# Expected: longest value ≤ 15s (target: 10s)

# Criterion 3b: file size ≤ 500KB
SIZE=$(wc -c < /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg) && \
  [ "$SIZE" -le 512000 ] && echo "PASS: ${SIZE} bytes" || echo "FAIL: ${SIZE} bytes"

# Criterion 4: dual-theme — SVG has its own background fill (not relying on page bg)
grep -E 'fill="(url\(#bg\)|#[0-9a-fA-F]{6})"' /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg | head -3
# Expected: at least one <rect width="1280" height="360" fill="url(#bg)"/> or equivalent

# Criterion 5: privacy — no operator identifiers
grep -E '(brain-vault|mccarthy|dimana503|McCarthy|dmitry|Dmitry|/Users/)' \
  /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg && \
  echo 'FAIL: real identifier leaked' || echo 'PASS: no leaks'

# Criterion 6: all 7 READMEs reference assets/hero.svg
cd /Users/mccarthy606/Projects/claude-operator-stack && \
  grep -l 'src="assets/hero\.svg"' README.md README.ru.md README.es.md README.pt-br.md README.tr.md README.zh.md README.ja.md | wc -l
# Expected: 7

# Criterion 7: prefers-reduced-motion handler present
grep -E 'prefers-reduced-motion' /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg && \
  echo 'PASS: reduced-motion handled' || echo 'FAIL: no reduced-motion media query'

# Bonus: count beats — directory tree should mention 3 generic projects
grep -cE '(marketplace|saas-kit|pipeline)\.md' /Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg
# Expected: ≥ 3
```

All eight commands together form the executable verification suite. Pass = green-light commit.

---

## 8. Risks + mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | SVG animation behaves inconsistently across Chrome / Firefox / Safari (e.g. Safari's SMIL quirks, Firefox's `animation-delay` rounding). | Medium | Visual artefact in one browser. | Step 4 of impl checklist tests three browsers before commit. Use **CSS animations in an SVG `<style>` block** for the bulk (universal support); use SMIL only where it's the natural fit. If Firefox can't be tested locally, document in CHANGELOG and accept Chrome + Safari as the gate (they cover ~85% of github.com traffic). |
| R2 | Animation crosses the privacy line and references real project names. | Low | Reputational — a careful reader spots a real product name. | Hard rule: only `marketplace.md`, `saas-kit.md`, `pipeline.md` (generic SaaS archetypes, no real product). Step 9 grep blocks commit if real identifiers leak. |
| R3 | File size balloons past 500KB. | Very Low | GitHub clips inline rendering. | Vector + inline CSS keeps this ≤50KB realistically. Step 6 of impl checklist verifies. |
| R4 | `prefers-reduced-motion` users see a broken/blank static frame. | Low | Accessibility regression. | The `@media (prefers-reduced-motion: reduce)` block forces beat-3 state (most informative single frame) and explicitly sets `animation: none` so no half-rendered animation freezes mid-frame. Step 5 of impl checklist verifies. |
| R5 | The new hero replaces the existing one in-place but the rendered animation actually loses brand continuity (different feel). | Low | Subtle aesthetic regression. | Approach §3 pins exact hex values from the existing SVG. Approach §2 keeps the entire left-half composition (title, subtitle, stat row, accent bars) static and identical. Only the right half is new. |
| R6 | Animated SVG is heavier on the GitHub renderer than expected and slows page load. | Very Low | Minor LCP regression. | Compositor-friendly properties only (opacity / transform / stroke-dashoffset); no layout-bound animations. ≤50KB file size; one HTTP request; no JS. Aligns with `~/.claude/rules/web/performance.md`. |
| R7 | GitHub strips inline `<style>` from SVG when rendering in markdown. | Low (historic concern, mostly resolved by 2023+) | Animation falls back to no-style render; SMIL animations would still work. | **Belt-and-suspenders strategy:** drive the most critical animations (the directory tree fade-in and the panel slide-in) via SMIL `<animate>` so they survive even if `<style>` is stripped. Use CSS `<style>` for the polish (stagger delays, easing curves, reduced-motion handling). If GitHub strips `<style>`, the loop still tells the story; only the polish degrades. |

---

## 9. Estimated time breakdown

Total: **3-4h** focus session, single-shot, no mid-phase user input.

| Step | Activity | Estimate |
|---|---|---|
| 1 | Re-read existing `assets/hero.svg`, confirm reused composition | 5 min |
| 2 | Sketch beat-by-beat animation in scratchpad | 15 min |
| 3 | Author the new SVG (the bulk of the work — `<defs>`, `<style>`, 6 beats, ~80-150 lines of SVG markup) | 90-120 min |
| 4 | Three-browser sanity-check (Chrome, Safari, Firefox if available) | 15 min |
| 5 | Verify `prefers-reduced-motion` fallback (toggle macOS setting or temp-edit media query) | 10 min |
| 6 | Verify file size + run sanitisation grep | 5 min |
| 7-8 | Verify README references unchanged (no edits required, just grep confirmation) | 5 min |
| 9 | Run full verification suite (criterion 1-7) | 5 min |
| 10 | CHANGELOG entry | 5 min |
| 11 | Final `git diff --stat` review | 5 min |
| 12 | Commit + push | 5 min |
| **buffer** | rework after a browser-test surprise | 30-60 min |

**Compresses to ~2h** if the first SVG draft renders cleanly in all three browsers on the first try (likely given the conservative animation choices). **Stretches to ~4h** if Safari surfaces a SMIL quirk that needs a workaround. Both extremes are within the ROADMAP's 3-4h estimate.

---

## 10. Files affected — exact paths

**Modified (in-place):**
- `/Users/mccarthy606/Projects/claude-operator-stack/assets/hero.svg` — replaced with animated version, same path, same `viewBox`, same brand palette.
- `/Users/mccarthy606/Projects/claude-operator-stack/CHANGELOG.md` — one new line under the unreleased section noting the hero animation.

**Verified-but-NOT-modified** (in-place asset replacement means these don't change):
- `/Users/mccarthy606/Projects/claude-operator-stack/README.md` (line 3)
- `/Users/mccarthy606/Projects/claude-operator-stack/README.ru.md` (line 3)
- `/Users/mccarthy606/Projects/claude-operator-stack/README.es.md` (line 3)
- `/Users/mccarthy606/Projects/claude-operator-stack/README.pt-br.md` (line 3)
- `/Users/mccarthy606/Projects/claude-operator-stack/README.tr.md` (line 3)
- `/Users/mccarthy606/Projects/claude-operator-stack/README.zh.md` (line 3)
- `/Users/mccarthy606/Projects/claude-operator-stack/README.ja.md` (line 3)

**Explicitly not touched (per phase constraints):**
- `install.sh`, `package.json`, any TypeScript or Python file.

**Net diff at commit time:** 2 files modified, 0 files added, 0 files renamed.

---

## Appendix A — fallback path if animated SVG genuinely fails on github.com

If, after committing and pushing to a test branch, github.com's renderer strips both `<style>` AND SMIL (extremely unlikely in 2026 but worth a documented escape hatch):

1. Re-render the animated SVG to APNG using `gif-to-apng` or `ffmpeg + apngasm`. Target: 1280×360 @ 12fps × 10s = 120 frames; expected size ~300-500KB compressed.
2. Replace `assets/hero.svg` → keep file extension `.svg`? **No** — APNG is a different format. Either:
   - Save as `assets/hero.png` AND update all 7 README `<img src="assets/hero.svg"…>` → `assets/hero.png`. (7 files touched.)
   - Or keep both: `assets/hero.svg` (animated) for direct viewing, `assets/hero.png` (animated PNG) for github.com markdown. Update READMEs to point at `.png`.
3. Document the fallback in CHANGELOG explicitly.

This is the **only scenario** that requires touching the 7 translated READMEs. The plan's primary path avoids it entirely.

---

## Appendix B — non-goals (explicit, to prevent scope creep)

- **Not** redesigning the brand visual identity. Palette, font, viewBox, layout proportions are fixed.
- **Not** adding interactivity (no hover states, no click targets — github.com strips event handlers from SVG anyway).
- **Not** producing a separate light-theme variant. One SVG with self-contained dark bg works on both themes.
- **Not** producing a 3D / canvas / WebGL fallback. SVG is the medium.
- **Not** optimising further than ~50KB. Premature optimisation; the budget is 500KB.
- **Not** building a sprite sheet or atlas. All animation is parametric.
- **Not** using JavaScript. Pure declarative SVG + CSS.
- **Not** publishing the SVG as a separate npm package. (That's P8.3's territory, and the hero is not a package.)
