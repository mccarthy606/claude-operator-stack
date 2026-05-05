# Launch checklist — Phase 9 + 10

The single document the operator runs top-to-bottom on launch day. Every step is a checkbox. The flip is at T-0; everything before is dress rehearsal, everything after is response.

This checklist deliberately reads as mechanical. By the time you start it, every interesting decision is already made. If you find yourself re-debating a decision while running the checklist, stop and abort the flip — the decision was not actually locked.

---

## T-60 minutes (pre-flip sanity)

The last sixty minutes before the flip are for verification, not new work. If anything in this section reveals an unfinished task, abort.

- [ ] Re-run sanitisation grep one final time:
      ```
      cd ~/Projects/claude-operator-stack && \
        grep -rEn "(/Users/mccarthy606/(?!Projects/claude-operator-stack)|<real-product-name>|<real-url>)" . \
        | grep -v ".git" | grep -v ".planning"
      ```
      Expected output: empty. **Any hit aborts the flip.**
- [ ] Verify all open good-first-issues still match repo state — `gh issue list --label "good first issue"` and walk each one open against the live README.
- [ ] Final read-through of `README.md` on GitHub (private repo preview) — open in a fresh browser tab and read end-to-end with no scrolling shortcuts.
- [ ] Verify hero SVG renders correctly in the GitHub markdown preview (private view counts).
- [ ] X-thread variant picked, copy-pasted into a draft (not a Notes app — into the X compose window in browser, locked behind "save draft" so you do not need to retype at T-0).
- [ ] Show HN body picked, copy-pasted into the HN submit form draft tab. Title pasted into the title field. URL pasted into the URL field. Do not click submit yet.
- [ ] 5 founder DMs personalized — every `[bracket]` token replaced. Each one opened as a draft in the messaging app (X DMs, Telegram, etc.) so send is one click each.
- [ ] About box description picked (one of the three variants from `github-meta.md`) and copy-pasted into a scratch buffer ready for `gh repo edit`.
- [ ] Social preview image (`assets/social-preview.png`) generated, sized 1280×640, file <300KB, looks readable as a 600×300 thumbnail (open in image viewer at 50% zoom and check).
- [ ] `gh auth status` returns active session for the right account.
- [ ] `gh repo view mccarthy606/claude-operator-stack --json viewerPermission` returns `ADMIN`.
- [ ] `git status` is clean (no uncommitted work). `git log --oneline -5` matches what you intended to ship.
- [ ] No phone notifications on. No Slack. The next 90 minutes are launch-only.
- [ ] Coffee made.

---

## T-0 (the flip)

The irreversible block. Once `--visibility public` runs, you do not get to redo the first impression. Run these in order, do not interleave.

- [ ] Flip the visibility:
      ```
      gh repo edit mccarthy606/claude-operator-stack \
        --visibility public \
        --accept-visibility-change-consequences
      ```
- [ ] Apply topics:
      ```
      gh repo edit mccarthy606/claude-operator-stack \
        --add-topic claude-code \
        --add-topic claude \
        --add-topic anthropic \
        --add-topic ai-agents \
        --add-topic mcp \
        --add-topic claude-skills \
        --add-topic solo-founder \
        --add-topic operator-playbook \
        --add-topic indie-hackers \
        --add-topic ai-tooling \
        --add-topic obsidian \
        --add-topic cookbook \
        --add-topic scaffolds \
        --add-topic developer-experience
      ```
- [ ] Apply description (paste the variant chosen in T-60):
      ```
      gh repo edit mccarthy606/claude-operator-stack \
        --description "<paste the picked About-box description>"
      ```
- [ ] Upload social preview image (or via Settings → Social preview if the API path errors):
      ```
      gh api -X PATCH /repos/mccarthy606/claude-operator-stack \
        --field social_preview_image=@assets/social-preview.png
      ```
- [ ] Tag the release:
      ```
      git tag -a v1.0.0 -m "v1.0.0 — public launch"
      git push origin v1.0.0
      gh release create v1.0.0 \
        --title "v1.0.0 — public launch" \
        --notes-from-tag
      ```
- [ ] Pin the three good-first-issues (UI: Issues tab → pin each):
      - `[issue #1]` — PT-BR translation
      - `[issue #5]` — Windows install script
      - `[issue #6]` — README screenshots (or `[issue #7]` if #6 already closed)
- [ ] Enable Discussions (Settings → Features → Discussions: ON).
- [ ] Seed three starter discussions (titles from `github-meta.md`):
      - "Welcome — read this first" (pinned)
      - "Show your stack"
      - "Profiles that don't fit"
- [ ] Enable basic branch protection on `main` (settings from `github-meta.md`).
- [ ] Post X thread. Pin the hook tweet. Reply with the link tweet immediately.
- [ ] Submit Show HN. Post the body comment within five minutes of submission.
- [ ] Send the five founder DMs, one at a time, with 5-10 minutes between each so a reply can interrupt.

---

## T+15 minutes

A short verification window after the flip. If anything is broken here, fix it before the audience finds it.

- [ ] Open the repo in a logged-out browser tab. Verify: README renders, hero SVG renders, badges render, language nav links work, About box shows the description, topics are visible, social preview shows when you hover the URL in another browser tab.
- [ ] Verify the X thread reads correctly on a logged-out browser. Click each tweet, confirm 270-char rendering, confirm the link reply is visible under the hook tweet.
- [ ] Verify the Show HN submission is live at https://news.ycombinator.com/newest. Verify the body comment posted under your submission.
- [ ] Verify the v1.0.0 release page renders (`gh release view v1.0.0` or open in browser).
- [ ] Verify Discussions tab is enabled and shows the three seeded discussions.
- [ ] Note time of flip in `.planning/launch/launch-log.md` (T-0 timestamp + thread URL + HN URL + DM recipient list).

---

## T+1 hour

The first hour of the launch is when the early signal lands. Engagement here disproportionately shapes the next 24 hours.

- [ ] Reply to first wave of X mentions personally. Target: every reply that says something substantive gets a thoughtful answer; one-word replies get a like, not a reply.
- [ ] Engage every substantive HN comment. Skip dismissive "this is just X" — they sink without engagement. Critique gets a direct, non-defensive answer.
- [ ] If issues have been opened (likely 0-2 in hour one): triage by adding labels. Do not respond yet unless it is a blocker.
- [ ] Check `gh repo view --json stargazerCount,forkCount,issuesCount` once at T+1h, write the numbers into `launch-log.md`. Do not check again until T+24h — refresh-fatigue is a real failure mode.

---

## T+24 hours

The first quiet checkpoint. The launch is no longer live; it is now a thing that exists.

- [ ] Reply to every issue opened in the first 24 hours with at least one acknowledging response.
- [ ] Reply to every PR opened in the first 24 hours with merge / request-for-changes / explicit decline. Do not leave PRs cold for >48h.
- [ ] Reply to remaining HN comments. Slower cadence is fine after hour 12.
- [ ] One follow-up X tweet quoting the hook tweet, with one concrete number from the day (stars, issues opened, PRs opened, Discussions started). Keep it factual; no celebration.
- [ ] Update `launch-log.md` with T+24h numbers and any noteworthy threads (someone shared it in their newsletter, a prominent person commented, etc.).

---

## T+72 hours (retro)

The launch wave is now over. Time to write down what happened while it is still fresh.

- [ ] Hot-fix any issues surfaced in the wave (typos, broken links, missing attribution). Each one should be a small commit. Tag v1.0.1 if any of them shipped.
- [ ] Write the 72h retro in `.planning/milestones/M2-v1-public-launch/RETRO.md`. Sections: numbers (stars/forks/PRs/discussions), what worked, what didn't, what surprised me, what to fix in v1.1.
- [ ] Triage all issues opened in the wave into `good first issue` / `enhancement` / `wontfix` with labels.
- [ ] Decide v1.1 priorities based on what actually got attention. The roadmap document `../ROADMAP.md` is the next stop.
- [ ] If a Show HN comment or X reply revealed a content gap that would take less than 30 minutes to fix, fix it. Anything bigger goes into v1.1.

---

## Abort criteria

Stop and revert at the following points. Better a 24-hour delay than a public correction.

- **At T-60:** if the sanitisation grep returns ANY hit involving real product names or absolute paths outside `~/Projects/claude-operator-stack`, abort. Fix and reschedule the flip for the next day.
- **At T-60:** if any open good-first-issue references a file that no longer exists or has changed shape, abort. Update or close the issue first.
- **At T-60:** if the social preview image is missing or doesn't render correctly in the OG-tester, abort. Re-generate before going public.
- **At T-0:** if `gh repo edit --visibility public` errors, do not retry blindly. Read the error, check `gh auth status` and `gh repo view`. Fix the underlying problem, then re-run.
- **At T+15:** if the README or hero on the public page is broken (missing image, busted markdown), revert visibility to private with `gh repo edit --visibility private --accept-visibility-change-consequences`, fix, re-flip. The first 15 minutes after flip have negligible audience; the cost of a brief private-public-private window is small.
- **Any time:** if a security issue is reported (real one, not a bug-bounty fishing), follow `SECURITY.md` first; the launch can wait.

---

## Post-launch maintenance cadence

Once the 72h window closes, the rhythm changes from "launch-day attention" to "open-source maintainer cadence." Lighter, but persistent.

- **Daily** (week 1): 15 minutes triaging issues, replying to comments. No more.
- **Weekly** (after week 1): one focus block per week for PR review, content updates, and Discussion monitoring.
- **Monthly:** one focus block on the public-facing surface — broken-link sweep, attribution audit refresh, README tightening.
- **Quarterly:** the v1.x roadmap review. Decide whether to ship a v1.1 deepening, or whether the audience needs something orthogonal.
