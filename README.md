# onex-skills

A growing collection of [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) skills published to [skills.sh](https://skills.sh). Each skill lives in `skills/<name>/` with its own `SKILL.md` and `README.md`.

## Skills

| Skill | What it does |
|---|---|
| [`ideate`](./skills/ideate) | Brainstorm gaps, loopholes, and improvements on recently built work — reviewed as a PM, returned as a categorized numbered list you can pick from. |

## Install

### Via skills.sh CLI (recommended once published)

```bash
skills install onexgroup/onex-skills/ideate
```

### Manual install (global, all skills)

```bash
git clone https://github.com/onexgroup/onex-skills ~/code/onex-skills
mkdir -p ~/.claude/skills
ln -sfn ~/code/onex-skills/skills/ideate ~/.claude/skills/ideate
# repeat the ln line for each skill you want
```

### Manual install (project-scoped, single skill)

```bash
mkdir -p .claude/skills
git clone https://github.com/onexgroup/onex-skills /tmp/onex-skills
cp -r /tmp/onex-skills/skills/ideate .claude/skills/ideate
```

## Contributing a new skill

1. Create `skills/<your-skill>/SKILL.md` with YAML frontmatter (`name`, `description`) and the skill body.
2. Optionally add `skills/<your-skill>/README.md` for a human-facing description.
3. Add a row to the **Skills** table above.
4. Open a PR.

## License

MIT — see [LICENSE](./LICENSE).
