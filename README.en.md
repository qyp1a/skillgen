# skillgen · Agent Skill Template Generator

Generate standards-compliant [`SKILL.md`](https://agentskills.io) project scaffolds with a single command — ready for **Codex / Claude Code / Gemini CLI / Cursor**. Bilingual (**中文/English**), **zero dependencies** (Node built-ins only).

[中文 README](README.md) | [Report an Issue](https://github.com/qyp1a/skillgen/issues)

## Why skillgen

- **Write once, use everywhere**: generated SKILL.md follows the Agent Skills standard, recognized by Codex, Claude Code, Gemini CLI and Cursor.
- **Bilingual**: CLI UI and generated templates support Chinese / English / bilingual modes.
- **4 professional templates**: basic skill, CLI tool wrapper, multi-step workflow, MCP connection — each with guided comments.
- **Zero dependencies**: Node built-ins only; works via `npx` with nothing to install.
- **Ready to publish**: generates `SKILL.md` + `scripts/` + `assets/` + `README.md` + MIT `LICENSE` — clone and ship.

## Quick start

### Via npx (no install)

```bash
npx skillgen
```

### Global install

```bash
npm i -g skillgen
skillgen
```

### Run from source

```bash
git clone https://github.com/qyp1a/skillgen.git
cd skillgen
node cli.js
```

## Interactive usage

```bash
$ npx skillgen
Skill name (lowercase letters/digits/hyphens, e.g. my-skill): my-skill
Skill description (one sentence: what it does & when to use): Automate report processing

Choose a template type:
  1. Basic skill (general knowledge / workflow)
  2. CLI tool wrapper
  3. Multi-step workflow
  4. MCP connection
> 3

Template language:
  1. 中文
  2. English
  3. Bilingual (中英双语)
> 3

✓ Generated ./my-skill/
```

## Non-interactive usage

```bash
npx skillgen --name my-skill --type workflow --lang both \
  --desc "自动处理报表" --desc-en "Automate report processing" --author you
```

| Flag | Description |
| --- | --- |
| `--name` | Skill name (lowercase letters/digits/hyphens) |
| `--desc` / `--desc-en` | Description (Chinese / English; both can be provided in `both` mode) |
| `--type` | `basic` \| `cli` \| `workflow` \| `mcp` |
| `--lang` | `zh` (中文) \| `en` (English) \| `both` (bilingual) |
| `--ui` | CLI UI language `zh` \| `en` (auto-detected by default) |
| `--author` | Author name (used in LICENSE / README) |
| `--force` | Overwrite an existing directory |
| `--yes` | Skip prompts, use defaults |
| `--list-types` | List all template types |
| `--version` / `--help` | Version / help |

## Template types

| Type | Use case | Template highlights |
| --- | --- | --- |
| `basic` | General knowledge / process skills | Overview, when-to-use, workflow, examples, best practices, troubleshooting |
| `cli` | Wrap a command-line tool | Prerequisites, command reference, standard workflow, output parsing, failure handling |
| `workflow` | Multi-step pipelines | Stage breakdown, I/O table, quality gates, failure recovery |
| `mcp` | Connect an MCP server | Server config, tool inventory, usage patterns, error handling |

## Generated project structure

```
my-skill/
├── SKILL.md          # Skill definition (main entry — agents read this first)
├── scripts/          # Executable scripts
│   └── example.js    # Example script (placeholder, replace it)
├── assets/           # Reference assets
├── README.md         # Bilingual install instructions
└── LICENSE           # MIT license
```

## Installing generated skills

**Codex:**

```bash
codex install ./my-skill
# or copy to ~/.codex/skills/
```

**Claude Code:**

```bash
cp -r my-skill ~/.claude/skills/
```

**Generic:** copy the folder into your agent's skills path; the `name` / `description` fields in `SKILL.md` are auto-discovered.

## Development

```bash
npm test        # full matrix: 4 types × 3 languages
node cli.js --list-types
```

## Roadmap

- [ ] More template types: data skills, document skills, browser automation
- [ ] `skillgen check <dir>`: validate existing SKILL.md files against best practices
- [ ] `skillgen init`: auto-generate SKILL.md from existing scripts
- [ ] GitHub Action: validate SKILL.md in PRs

## License

[MIT](LICENSE) © qyp1a
