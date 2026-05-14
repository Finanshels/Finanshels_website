# `.claude/` — project layer

This folder is a **thin project-specific layer** on top of the global ECC plugin (`~/.claude/`). It encodes finanshels_web invariants that no global skill can know.

## Layout

```
.claude/
├── README.md             # this file
├── AGENTS.md             # which ECC agents/skills matter most here
├── settings.local.json   # local Bash allowlist (do not commit secrets here)
├── rules/                # project-only rule overrides
│   ├── cms.md
│   ├── firebase.md
│   └── nextjs.md
├── commands/             # project slash commands
│   ├── cms-field.md      # /cms-field   → scaffold a new CMS field type
│   ├── cms-collection.md # /cms-collection
│   ├── cms-block.md      # /cms-block
│   └── deploy-check.md   # /deploy-check
├── agents/               # project-specialised subagents
│   ├── cms-collection-builder.md
│   ├── firestore-rules-reviewer.md
│   └── admin-auth-reviewer.md
└── hooks/
    └── hooks.json        # project SessionStart + PreToolUse hints
```

## How this combines with the global ECC plugin

| Layer | Loads what | When to update |
|---|---|---|
| `~/.claude/rules/ecc/common/*` | Coding style, git, testing, security baseline | Never from this repo |
| `~/.claude/rules/ecc/typescript/*` | TS style, testing, hooks, security | Never from this repo |
| `./CLAUDE.md` | Project memory | When stack/invariants change |
| `.claude/rules/*` | Project-only overrides | When a project pattern conflicts with global default |
| `.claude/commands/*` | Slash commands | When a workflow is repeated 3+ times |
| `.claude/agents/*` | Subagents | For codebase areas that need expert review every time |

## Adding a new entry

- **Slash command**: drop a `.md` in `commands/`. Filename = command name.
- **Subagent**: drop a `.md` in `agents/` with YAML frontmatter (`name`, `description`, `tools`).
- **Rule**: drop a `.md` in `rules/` and link from `CLAUDE.md`.
- **Hook**: add to `hooks/hooks.json`. Keep them silent unless they catch real bugs — chatty hooks get disabled.
