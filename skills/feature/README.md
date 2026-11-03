# feature

A Claude Code skill that implements a complex feature through six gated phases: requirements, design, test plan, test-first implementation, self-review, and final validation.

Ships in the [`onex`](../../README.md) plugin — invoked as **`/onex:feature`**.

## What it does

Trigger it with `/onex:feature <what to build>`, or say "build this feature properly" or "implement X test-first". Claude will:

1. **Learn the repo first.** It detects the package manager, test runner, property-based testing library, and coverage command, and finds the closest existing feature to mirror.
2. **Analyze requirements.** It summarizes the feature, lists functional and non-functional requirements, and asks clarifying questions. It does not continue until you confirm.
3. **Design the architecture.** It splits the feature into modules, defines interfaces and data flows, names the files it will touch, and recommends a side for each trade-off.
4. **Plan the tests.** It writes Gherkin acceptance scenarios, property-based tests with stated invariants, and integration tests with minimal mocking. It covers edge cases and names the coverage command. It then waits for your approval of the design and test plan.
5. **Implement module by module, test-first.** It checks for a suitable sub-agent before each module, writes tests, writes code, runs the tests, and reports real results. The system stays working after every module.
6. **Self-review.** It runs lint and type checks, removes duplication and unclear logic, and reports bugs it found.
7. **Validate.** It shows the full test run and coverage, and maps each requirement to the code and tests that satisfy it.

## When not to use it

Skip it for one-line fixes, typo edits, bug diagnosis, or design-only questions. The gates are deliberate overhead that pay off on multi-module features.

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

## License

MIT
