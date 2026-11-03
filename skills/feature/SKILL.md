---
description: Implement a complex feature systematically through six gated phases — requirements analysis, architecture and design, test planning (Gherkin acceptance tests, property-based tests, integration tests with minimal mocking), iterative test-first implementation module by module, self-review, and final validation with real test output and coverage. Clarifies requirements before designing, and waits for the user's approval of the design and test plan before writing code. Delegates implementation to a suitable sub-agent when one exists. Use when the user says "/onex:feature", "build this feature", "implement this feature properly", "plan and build X", "add feature X with tests", "do this test-first", or describes a non-trivial feature that spans several modules. Do NOT use for one-line fixes, typo edits, pure bug diagnosis, or design-only questions.
---

# Feature

Implement a complex software feature in a systematic, bug-free, and well-tested way. Work through the six phases below **in order**. Do not skip or merge phases. Explain your reasoning before producing code.

The feature to build is whatever the user asked for when invoking this skill. If they invoked it with no description, ask what the feature is before doing anything else.

## Before you start: learn the repo

Spend a few minutes reading the codebase so every phase is grounded in what exists. Do not assume anything you can check.

- **Stack and conventions.** Read `package.json` (or the language equivalent), any `CLAUDE.md` / `AGENTS.md`, and the folders the feature will touch.
- **Package manager.** Detect it from the lockfile (`yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`, `package-lock.json`). Use that one for every command.
- **Test tooling.** Find the existing test runner (Vitest, Jest, Playwright, pytest, Go test…), the property-based testing library if any (fast-check, Hypothesis…), and the coverage command. If a needed tool is missing, propose adding it in Step 2 rather than silently installing it.
- **Existing patterns.** Find the closest existing feature and mirror its structure, naming, and error handling.

## Workflow

### Step 1: Requirements analysis

- Summarize the feature in your own words.
- List the **functional** requirements (what it does) and **non-functional** requirements (performance, security, accessibility, limits, compatibility).
- List every open question. Ask them with `AskUserQuestion` when available (2–4 options each, recommended option first), otherwise as a numbered list.
- **Gate:** do not proceed until the requirements are explicit and the user has confirmed them.

### Step 2: Architecture and design

- Break the feature into logical modules or components.
- Define clear interfaces, dependencies, and data flows between them. Name the files you expect to create or change.
- Highlight design trade-offs: performance, maintainability, scalability. Recommend one option per trade-off rather than surveying all of them.
- Avoid unnecessary mocks. Prefer real, testable components (in-memory DBs, local test databases, real parsers) over stubs.

### Step 3: Test planning

- Write **acceptance tests** in Gherkin style (Given / When / Then), one scenario per user-visible behavior.
- Design **property-based tests** for logic that takes variable or random input. State the invariant each property checks.
- Plan **integration tests** with minimal mocking and realistic data.
- Cover error handling and edge cases explicitly: empty input, boundaries, permission failures, concurrency, network failure.
- State how coverage will be measured (the exact command) and the target.
- **Gate:** present the design (Step 2) and test plan (Step 3) together and wait for the user's explicit approval before writing any code.

### Step 4: Iterative implementation

- **Check for a suitable sub-agent first.** Project agents in `.claude/agents/` take priority over user-level agents. Delegate a module to an agent when one fits the work; otherwise implement it directly.
- Implement module by module. For each module:
  1. Restate the requirements for that module.
  2. Write the tests first.
  3. Implement the code.
  4. Run the tests and report the actual results.
- Each iteration must leave the system in a working state: tests pass, types check, the app builds.

### Step 5: Self-review and quality checks

- Run the repo's linter and type checker and fix what they report.
- Look for duplication, poor naming, unclear logic, and code smells.
- Report any bugs or inconsistencies you find, including ones outside the feature that the feature exposed.
- Improve code and tests until they reach senior-level quality.

### Step 6: Final validation

- Run the full test suite and show the real output.
- Report the coverage numbers and point to the tests that cover the edge cases from Step 3.
- Walk through each requirement from Step 1 and confirm how it is satisfied. Name any that are not, and why.

## Rules

- **Do not jump straight to the final implementation.** Requirements, design, and test plan come first.
- **Think step by step** and reason aloud about design decisions before coding.
- **Tests must be meaningful.** No trivial asserts, no tests that only check hardcoded values against themselves, no tests that mock away the thing under test.
- **Report honestly.** If a test fails or a step was skipped, say so with the output.
- **Deliver iteratively and transparently.** Report progress at the end of each module.
- **If requirements change** during clarification or implementation, update every downstream step (design, test plan, code) to match.
- **Follow the repo's own rules** in `CLAUDE.md` / `AGENTS.md` when they conflict with defaults here.

Begin with **Step 1: Requirements analysis**.
