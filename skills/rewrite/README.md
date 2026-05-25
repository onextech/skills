# rewrite

A Claude Code skill that audits and rewrites content to strip out **AI writing patterns** ("AI-isms") — the em dashes, hollow intensifiers, vocabulary tells, template phrases, hashtag stuffing, and metronomic rhythm that make text sound machine-generated.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:rewrite`**.

## What it does

Paste a paragraph, a LinkedIn post, a blog draft, an investor email, or a piece of docs and trigger `/onex:rewrite` (or just say "remove the AI-isms," "make this sound less like AI," "humanize this"). Claude will:

1. **Audit it** — flag every AI-ism with the offending text quoted, grouped into three severity tiers (P0 credibility killers, P1 obvious AI smell, P2 stylistic polish).
2. **Rewrite it** — return a clean version that preserves the original structure, intent, and technical detail. Only changes what the guidelines require.
3. **Diff it** — summarise the meaningful edits so you can see what moved and why.
4. **Second-pass it** — re-read its own rewrite for anything that survived the first pass and fix it inline.

Two modes:
- **`rewrite` (default)** — full audit + rewrite + diff + second pass.
- **`detect`** — flag only, no rewriting. Use when the patterns might be intentional, you don't want the text altered (someone else's writing, published content, reference material), or you just want a quick scan.

Six context profiles adjust how strict the rules are: `linkedin`, `blog`, `technical-blog`, `investor-email`, `docs`, `casual`. Auto-detected from cues (short + hashtags → `linkedin`, code blocks → `technical-blog`, salutation + fundraising language → `investor-email`, etc.), and you can override.

## What it catches

A non-exhaustive sample of the rule categories — the full SKILL.md has the complete list with replacement tables:

- **Vocabulary tells** — three-tier word list (Tier 1 always flag: *delve, leverage, robust, comprehensive, seamless, game-changer*; Tier 2 flag in clusters: *harness, foster, streamline, empower*; Tier 3 flag by density: *significant, innovative, compelling*).
- **Formatting** — em dashes, bold overuse, emoji in headers, excessive bullet lists, title-case headings.
- **Structural tells** — uniform sentence and paragraph length (the #1 detection signal), formulaic openings, compulsive rule of three, copula avoidance (*serves as, features, boasts*), synonym cycling, excessive headers.
- **Significance inflation** — *watershed moment, pivotal moment, marking a turning point in the evolution of*.
- **Generic future-narrative closers** — *may become one of the most important narratives of the next market cycle*.
- **Hedge-stacked predictions** — *could potentially, may eventually, might ultimately*.
- **Real/actual adjective inflation** — *real on-chain tokenomics, genuine utility, true product-market fit* (with a carve-out for named contrasts).
- **Hashtag stuffing** — 6+ hashtags on a short post; mix of project tag + broad category tags.
- **Bullet lists of bare noun phrases** — 5+ short adj+noun items with no verbs.
- **Chatbot artifacts** — *I hope this helps!, Great question!, Let's dive in!, In this article, we will explore…*.
- **"Let's" constructions** — *Let's explore, Let's take a look, Let's break this down*.
- **Vague attributions** — *Experts believe, Studies show, Research suggests* (without naming the expert or study).
- **Filler phrases** — *It is important to note that, In terms of, The reality is that*.
- **Chatbot citation markup leaks** — `citeturn0search0`, `contentReference[oaicite:0]`, `oai_citation` (fingerprints from chat UIs that survive copy-paste).
- **AI-tool URL parameters** — `?utm_source=chatgpt.com`, `?utm_source=claude.ai`, `?referrer=grok.com`.
- **Unfilled placeholders** — `[Your Name]`, `[INSERT SOURCE URL]`, `2025-XX-XX`.
- **Reasoning chain artifacts** — *Let me think step by step, Breaking this down, First, let's consider*.
- **Confidence calibration stacking** — *It's worth noting that, Interestingly, Surprisingly, Notably, Undoubtedly*.
- **Emotional flatline** — *What surprised me most, What struck me was, The most interesting part*.
- **Novelty inflation** — *He introduced a term, the failure mode nobody's naming, what nobody tells you about*.

## How it's different from a generic "improve this writing" pass

- **Pattern-specific, not vibes-based.** Every flag points to a named category with a documented fix, not "this feels off."
- **Severity-tiered.** P0 / P1 / P2 lets you triage. Cutoff disclaimers and chatbot artifacts are credibility killers; uniform paragraph length is polish.
- **Context-aware.** A "thriving ecosystem" survives a casual Slack message and dies in an investor email. The same rule, calibrated by profile.
- **Detect-only when you want it.** You're not forced into a rewrite when all you wanted was a scan.
- **Honest about false positives.** The skill is explicit that these are signals, not proof — independent audits find 60%+ false-positive rates on non-native English writers. It's a quality tool, not a verdict tool.

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then trigger it by saying `/onex:rewrite`, `rewrite this`, `remove the AI-isms`, `humanize this`, or any of the phrases listed in `SKILL.md`'s description.

## Credits

Adapted from the [`avoid-ai-writing`](https://agentskills.io) skill by **Conor Bronsdon** (MIT, v3.4.0, agentskills.io spec 1.0). Vocabulary tiers draw on research from [brandonwise/humanizer](https://github.com/brandonwise/humanizer); chatbot citation-leak rules (P34/P35) are from `Aboudjem/humanizer-skill`. Repackaged for the `onex` plugin so it can be invoked as `/onex:rewrite`.

## License

MIT
