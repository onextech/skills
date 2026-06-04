---
description: Run any question, idea, or decision through a council of 5 AI advisors who independently analyze it from fundamentally different angles, peer-review each other anonymously, and synthesize a final chairman's verdict. Based on Andrej Karpathy's LLM Council methodology. Saves a visual HTML briefing report and a full markdown transcript to `docs/council/`. MANDATORY TRIGGERS — invoke immediately when the user says "council this", "run the council", "war room this", "pressure-test this", "stress-test this", or "debate this". STRONG TRIGGERS — invoke when the user presents a real decision with stakes alongside phrasing like "should I X or Y", "which option", "what would you do", "is this the right move", "validate this", "get multiple perspectives", "I can't decide", or "I'm torn between". Do NOT invoke for simple yes/no questions, factual lookups, creation tasks ("write me a tweet"), processing tasks ("summarize this"), or casual "should I" without a meaningful tradeoff (e.g. "should I use markdown" is not a council question). DO invoke when there is genuine uncertainty, multiple plausible options, and the cost of a bad call is high enough that the user clearly wants it pressure-tested from multiple angles.
---

# /onex:council — Pressure-test a decision through 5 advisors + peer review + a chairman

You ask one AI a question, you get one answer. That answer might be great. It might be mid. You have no way to tell because you only saw one perspective.

The council fixes this. It runs the question through **5 independent advisors**, each thinking from a fundamentally different angle. Then they **review each other's work anonymously**. Then a **chairman** synthesizes everything into a final recommendation that tells the user where the advisors agree, where they clash, what they all missed, and what to actually do.

Adapted from Andrej Karpathy's LLM Council. He dispatches queries to multiple models, has them peer-review each other anonymously, then a chairman produces the final answer. This skill does the same inside Claude — using **parallel sub-agents** with different thinking lenses instead of different models.

## When to run the council

The council is for questions where being wrong is expensive.

**Good council questions:**

- "Should I launch a $97 workshop or a $497 course?"
- "Which of these 3 positioning angles is strongest?"
- "I'm thinking of pivoting from X to Y. Am I crazy?"
- "Here's my landing page copy. What's weak?"
- "Should I hire a VA or build an automation first?"

**Bad council questions:**

- "What's the capital of France?" — one right answer; no perspectives needed.
- "Write me a tweet" — creation task, not a decision.
- "Summarize this article" — processing task, not judgment.

The council shines when there is genuine uncertainty and the cost of a bad call is high. If the user already knows the answer and just wants validation, the council will likely tell them things they don't want to hear. **That's the point.**

## The five advisors

Each advisor thinks from a different angle. These are not job titles or personas — they're **thinking styles that naturally create tension with each other.**

### 1. The Contrarian

Actively looks for what's wrong, what's missing, what will fail. Assumes the idea has a fatal flaw and tries to find it. If everything looks solid, digs deeper. The Contrarian is not a pessimist — they're the friend who saves you from a bad deal by asking the questions you're avoiding.

### 2. The First Principles Thinker

Ignores the surface-level question and asks "what are we actually trying to solve here?" Strips away assumptions. Rebuilds the problem from the ground up. Sometimes the most valuable council output is the First Principles Thinker saying "you're asking the wrong question entirely."

### 3. The Expansionist

Looks for upside everyone else is missing. What could be bigger? What adjacent opportunity is hiding? What's being undervalued? The Expansionist doesn't care about risk (that's the Contrarian's job). They care about what happens if this works **even better** than expected.

### 4. The Outsider

Has zero context about the user, their field, or their history. Responds purely to what's in front of them. This is the most underrated advisor. Experts develop blind spots; the Outsider catches the curse of knowledge — things that are obvious to the user but confusing to everyone else.

### 5. The Executor

Only cares about one thing: can this actually be done, and what's the fastest path to doing it? Ignores theory, strategy, and big-picture thinking. The Executor looks at every idea through the lens of "OK but what do you do Monday morning?" If an idea sounds brilliant but has no clear first step, the Executor will say so.

**Why these five.** They create three natural tensions:

- **Contrarian vs Expansionist** — downside vs upside.
- **First Principles vs Executor** — rethink everything vs just do it.
- **The Outsider** sits in the middle, keeping everyone honest by seeing what fresh eyes see.

## How to run

### Step 1 — Frame the question (with context enrichment)

When the user triggers the council, do two things before framing.

**A. Scan the workspace for context.** The user's question is often the tip of the iceberg. Their repo / workspace likely contains files that would dramatically improve the advisors' grounding. Before framing, quickly scan for and read any relevant context files:

- `CLAUDE.md` / `claude.md` in the project root (business context, preferences, constraints).
- Any `memory/`, `docs/`, or `.planning/` folders (audience profiles, voice docs, business details, past decisions).
- Any files the user explicitly referenced or attached in the prompt.
- Recent transcripts in `docs/council/` (to avoid re-counciling the same ground; cite prior findings when relevant).
- Any other files that seem relevant to the specific question (e.g. if they're asking about pricing → look for revenue data, past launch results, audience research; if they're asking about a feature → look at the relevant module).

Use `Glob` and quick `Read` calls — **don't spend more than ~30 seconds on this.** You are looking for the 2–3 files that would give advisors the context they need to give *specific, grounded* advice instead of generic takes.

**B. Frame the question.** Take the user's raw question **AND** the enriched context and reframe it as a clear, neutral prompt that all five advisors will receive. Include:

1. The core decision or question.
2. Key context from the user's message.
3. Key context from workspace files (business stage, audience, constraints, past results, relevant numbers).
4. What's at stake (why this decision matters).

**Do not add your own opinion. Do not steer it.** But do make sure each advisor has enough context to give a specific, grounded answer rather than generic advice.

If the question is too vague ("council this: my business"), ask **one** clarifying question. Just one. Then proceed.

Save the framed question — you'll embed it verbatim in every sub-agent prompt and in the final transcript.

### Step 2 — Convene the council (5 sub-agents in parallel)

Spawn all 5 advisors **simultaneously** as sub-agents via the `Agent` tool with `subagent_type: "general-purpose"`. Sequential spawning wastes time and lets earlier responses bleed into later ones.

Each advisor gets:

1. Their advisor identity and thinking style (from the descriptions above).
2. The framed question.
3. A clear instruction: respond independently. Do not hedge. Do not try to be balanced. Lean fully into the assigned perspective. If they see a fatal flaw, say it. If they see massive upside, say it. **Their job is to represent their angle as strongly as possible. The synthesis comes later.**

Each advisor should produce a response of **150–300 words** — substantive enough to bite, short enough to scan.

**Sub-agent prompt template (copy verbatim, fill in `[…]`):**

```
You are [Advisor Name] on an LLM Council.

Your thinking style:
[advisor description from above — paste the full 2–4 sentence description]

A user has brought this question to the council:

---
[framed question]
---

Respond from your perspective. Be direct and specific. Don't hedge or try
to be balanced. Lean fully into your assigned angle. The other advisors
will cover the angles you're not covering.

Keep your response between 150 and 300 words. No preamble. Go straight
into your analysis.
```

When all 5 return, collect them.

### Step 3 — Peer review (5 sub-agents in parallel)

This step is what makes the council more than "ask 5 times." It's the core of Karpathy's insight.

**Anonymize first.** Map the 5 advisor responses to `Response A` through `Response E` at random. Do **not** preserve the advisor order — randomize so reviewers can't infer identity from position. Keep the mapping in memory; you'll reveal it in the transcript at the end.

Spawn 5 new sub-agents — one reviewer each. Each reviewer sees all 5 anonymized responses and answers three questions:

1. Which response is the strongest and why? (pick one)
2. Which response has the biggest blind spot, and what is it?
3. What did **all** responses miss that the council should consider?

**Reviewer prompt template (copy verbatim, fill in `[…]`):**

```
You are reviewing the outputs of an LLM Council. Five advisors
independently answered this question:

---
[framed question]
---

Here are their anonymized responses:

**Response A:**
[response]

**Response B:**
[response]

**Response C:**
[response]

**Response D:**
[response]

**Response E:**
[response]

Answer these three questions. Be specific. Reference responses by letter.

1. Which response is the strongest? Why?
2. Which response has the biggest blind spot? What is it missing?
3. What did ALL five responses miss that the council should consider?

Keep your review under 200 words. Be direct.
```

When all 5 reviews return, collect them.

### Step 4 — Chairman synthesis (1 sub-agent)

One agent — the **Chairman** — gets everything: the framed question, all 5 advisor responses (now de-anonymized so the chairman knows which advisor said what), and all 5 peer reviews.

The chairman produces the final council output using this **exact** five-section structure:

1. **Where the council agrees** — points multiple advisors converged on independently. High-confidence signals.
2. **Where the council clashes** — genuine disagreements. Do not smooth them over. Present both sides and explain why reasonable advisors disagree.
3. **Blind spots the council caught** — things that only emerged through peer review. Things individual advisors missed that other advisors flagged.
4. **The recommendation** — a clear, actionable recommendation. **Not "it depends." Not "consider both sides." A real answer.** The chairman can disagree with the majority if the reasoning supports it.
5. **The one thing to do first** — a single concrete next step. **Not a list of 10 things. One thing.**

**Chairman prompt template (copy verbatim, fill in `[…]`):**

```
You are the Chairman of an LLM Council. Your job is to synthesize the
work of 5 advisors and their peer reviews into a final verdict.

The question brought to the council:

---
[framed question]
---

ADVISOR RESPONSES:

**The Contrarian:**
[response]

**The First Principles Thinker:**
[response]

**The Expansionist:**
[response]

**The Outsider:**
[response]

**The Executor:**
[response]

PEER REVIEWS:

[paste all 5 reviews, separated by --- and labeled "Review 1" … "Review 5"]

Produce the council verdict using this exact structure (markdown headings,
in this order):

## Where the Council Agrees
[Points multiple advisors converged on independently. High-confidence signals.]

## Where the Council Clashes
[Genuine disagreements. Present both sides. Explain why reasonable advisors disagree.]

## Blind Spots the Council Caught
[Things that only emerged through peer review. Things individual advisors missed that others flagged.]

## The Recommendation
[A clear, direct recommendation. Not "it depends." A real answer with reasoning.]

## The One Thing to Do First
[A single concrete next step. Not a list. One thing.]

Be direct. Don't hedge. The whole point of the council is to give the
user clarity they couldn't get from a single perspective.
```

### Step 5 — Generate the visual HTML report

After the chairman synthesis returns, generate a **single self-contained HTML file** with inline CSS — no external assets, no CDN links, no JavaScript dependencies. Save it to:

```
docs/council/council-report-YYYYMMDD-HHMMSS.html
```

Create `docs/council/` if missing. Use a `YYYYMMDD-HHMMSS` timestamp (the user's local time is fine; just be consistent within a session).

**The report must contain, in this order:**

1. **A header** — small label "LLM Council Verdict", the framed question prominently displayed, and the timestamp.
2. **The chairman's verdict** — the full five-section chairman output, prominently displayed at the top (this is what most readers will read).
3. **An agreement / disagreement visual** — a simple visual showing where advisors aligned and diverged. Use a clean **5-row grid**: one row per advisor, with their name, their core stance (one sentence pulled from their response), and a colored pill indicating alignment (`Agrees`, `Partially`, `Dissents`). Keep it scannable. A spectrum or simple breakdown is also acceptable — the rule is *clean and at-a-glance*.
4. **Collapsible `<details>` sections for each advisor's full response** — collapsed by default so the page isn't overwhelming, but expandable for readers who want to dig in. Each section: advisor name, thinking style (one-line subtitle), full response.
5. **Collapsible `<details>` section for the peer review highlights** — paste the 5 reviews labeled `Review 1` … `Review 5`. Reveal the A→advisor mapping inside this block.
6. **A footer** — the timestamp, the workspace path, and a one-line "what was counciled" summary.

**Styling rules:**

- System font stack: `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;`
- White background (`#fff`), text `#111`, subtle borders `#e5e5e5`.
- Max content width `~720px`, centered, generous padding.
- Soft accent colors per advisor — e.g. Contrarian `#dc2626`, First Principles `#7c3aed`, Expansionist `#16a34a`, Outsider `#0ea5e9`, Executor `#ea580c`. Use them only as left-borders on advisor sections / pill backgrounds — never as full backgrounds.
- Nothing flashy. **It should look like a professional briefing document.**
- Mobile-friendly: single-column, comfortable line-height (`1.6`), generous spacing.

After writing the file, **open it** so the user sees it immediately. Use whichever opener fits the OS:

```bash
# macOS
open "docs/council/council-report-YYYYMMDD-HHMMSS.html"

# Linux
xdg-open "docs/council/council-report-YYYYMMDD-HHMMSS.html"

# Windows
start "" "docs/council/council-report-YYYYMMDD-HHMMSS.html"
```

The user's environment is `darwin` by default — use `open`.

### Step 6 — Save the full transcript

Save the complete council transcript as:

```
docs/council/council-transcript-YYYYMMDD-HHMMSS.md
```

— same timestamp as the HTML report, so the pair is obvious. The transcript includes, in this order:

1. The original user question (verbatim).
2. The framed question.
3. The list of context files read in Step 1A, with one-line "what it added".
4. All 5 advisor responses (de-anonymized, labeled by advisor name).
5. The anonymization mapping used for peer review (`Response A = The Contrarian`, etc.).
6. All 5 peer reviews (labeled `Review 1` … `Review 5`).
7. The chairman's full verdict (the five-section output).
8. A short footer line listing the artifacts: HTML report path + this transcript's path.

This transcript is the artifact. If the user wants to run the council again on an evolved version of the question, future-you (or a future agent) reads the previous transcript and continues the thread.

### Step 7 — Reply to the user

In the chat reply, do **not** repeat the chairman's verdict in full. Instead:

1. State that the council has finished and link both artifacts (relative paths under `docs/council/`).
2. Quote only the chairman's **Recommendation** and **One thing to do first** verbatim — those are the only two sections most users need in the chat itself.
3. Offer a follow-through: "Want me to council a follow-up (e.g. *if I do X, then what?*), or implement the one-thing-first directly?"

Keep the chat reply short. The artifacts carry the weight.

## Example — counciling a product decision

**User:** "Council this: I'm thinking of building a $297 course on Claude Code for beginners. My audience is mostly non-technical solopreneurs. Is this the right move?"

**The Contrarian:** "The market is flooded with Claude courses right now. At $297, you're competing with free YouTube content. Your audience is non-technical, which means high support burden and refund risk. The people who would pay $297 are likely already past beginner level…"

**The First Principles Thinker:** "What are you actually trying to achieve? If it's revenue, a course is one of the slowest paths. If it's authority, a free resource might do more. If it's building a customer base for higher-ticket offers, the price point and audience might be mismatched…"

**The Expansionist:** "Beginner Claude for solopreneurs is a massive underserved market. Everyone's teaching advanced stuff. If you nail the beginner angle, you own the entry point to this entire space. The $297 might be low. What if this became a $997 program with community access…"

**The Outsider:** "I don't know what Claude Code is. If I saw '$297 course on Claude Code for beginners,' I wouldn't know if this is for me. The name means nothing to someone outside your world. Your landing page needs to sell the outcome, not the tool…"

**The Executor:** "A full course takes 4–8 weeks to produce properly. Before building anything, run a live workshop at $97 to 50 people. You validate demand, generate testimonials, and create the raw material for the course. If 50 people don't buy the workshop, 500 won't buy the course…"

**Chairman's verdict (abbreviated):**

- **Where the council agrees:** The beginner-solopreneur angle has real demand, but the current framing ("Claude Code course") is too tool-specific for a non-technical buyer.
- **Where the council clashes:** Price. Contrarian says $297 is too high vs free YouTube; Expansionist says it's too low for the value. Resolution depends on what's bundled.
- **Blind spots caught:** The Outsider's point that "Claude Code" means nothing to the target buyer is the single most important insight. Every advisor except the Outsider assumed the audience already knows what this is.
- **The Recommendation:** Don't build the course yet. Validate with a lower-commitment offer first. And **reframe entirely** — sell the outcome (automate your business, get 10 hours back per week), not the tool.
- **The One Thing to Do First:** Run a $97 live workshop called "How to automate your first business task with AI" to 50 people. Don't mention Claude Code in the title.

## Output files

Every council session produces two files under `docs/council/`:

```
council-report-YYYYMMDD-HHMMSS.html    # visual briefing — what the user reads
council-transcript-YYYYMMDD-HHMMSS.md  # full transcript — what the next session reads
```

The HTML report is what the user sees. The transcript is there for digging deeper, citing specific advisor arguments, or evolving the question in a future session.

## Rules

- **Always spawn the 5 advisors in parallel.** One message, five `Agent` tool calls. Sequential spawning wastes time and risks contamination if you accidentally show one's output to another.
- **Always anonymize before peer review.** Randomize the A–E mapping. If reviewers can infer identity from position, they'll defer to certain thinking styles instead of evaluating on merit.
- **The chairman can disagree with the majority.** If 4 of 5 advisors say "do it" but the reasoning of the 1 dissenter is strongest, the chairman should side with the dissenter and explain why.
- **Don't council trivial questions.** If the user asks something with one right answer, just answer it. The council is for genuine uncertainty where multiple perspectives add value. When in doubt, ask "is this a real decision or a lookup?" before spawning.
- **Lean fully into each advisor's angle.** Each advisor's prompt explicitly tells them not to hedge. If a Contrarian response reads "balanced," the prompt didn't land — re-emphasize the lean.
- **The visual report matters.** Most users scan the HTML, not the markdown. Spend the effort on making it clean, scannable, and printable. A 5-row alignment grid + collapsed advisor sections + a prominent chairman verdict beats a wall of text every time.
- **Save both artifacts before replying.** Don't tell the user the council has finished until both files are on disk and (on macOS) the HTML is opened.
- **Quote only the Recommendation and One-thing-to-do-first in chat.** The artifacts carry the full verdict. The chat reply is a pointer + the two most actionable lines.
- **Use `general-purpose` subagent_type for advisors and reviewers.** They need to write substantive prose; no specialized tools required.
- **Re-read prior transcripts when the user iterates.** If `docs/council/` already has transcripts and the user is evolving a previous question, read the latest one first and reference how the question has shifted in your framing.
- **One council per session is normal.** Two is fine if the user explicitly asks for a follow-up. Don't auto-run a second council without being asked.

## When NOT to use this skill

- **Simple factual questions** — "What's the capital of France?" One answer; no council needed.
- **Creation tasks** — "Write me a tweet", "Draft a landing page". Use a writing skill or just write.
- **Processing tasks** — "Summarize this article", "Translate this". One-shot it.
- **Bug fixes / one-line changes** — just fix it.
- **Architectural decisions with clear precedent** — if the repo's CLAUDE.md or a prior council transcript already locked the decision, follow it. Don't re-litigate.
- **Casual "should I" without a real tradeoff** — "should I use markdown" is not a council question; "should I bet $30k of runway on this pivot or extend by hiring a contractor" is.
- **The user already decided and just wants execution** — if their phrasing is "I'm going to do X, help me ship it", they don't want pressure-testing. Build.
