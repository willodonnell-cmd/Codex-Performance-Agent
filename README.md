# Codex Coach

Codex Coach is a lightweight in-workflow coaching layer for Codex users. It is
not a separate coaching app. The repo contains a visual prototype plus the first
sidecar artifacts: a Codex Skill, hook contracts, an editable model policy,
a heuristic credit estimator, and telemetry storage schema.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Codex Coach Shape

- `codex-coach/skill/SKILL.md`: reusable coaching playbook.
- `codex-coach/hooks/`: event contracts for `SessionStart`,
  `UserPromptSubmit`, `PostToolUse`, `PreCompact`, and `Stop`.
- `codex-coach/config/model-policy.json`: editable weekly allocation, budget
  pressure, model-class routing, and escalation rules.
- `codex-coach/config/classifier-rules.json`: editable prompt classifier rules.
- `codex-coach/config/estimator-seed.json`: first heuristic estimator seed set.
- `lib/codexCoachEstimator.ts`: TypeScript estimator used by the app surface.
- `codex-coach/runner/`: executable hook runner CLI, classifier, fixtures, and
  tests.
- `codex-coach/telemetry/schema.sql`: project, session, usage event, and weekly
  rollup tables.

The v1 estimator intentionally returns a range. It uses project type,
complexity, context growth, tool use, model class, reasoning level, plan length,
and expected iteration count. Future calibration should compare each estimate
with actual usage from Codex analytics and compliance exports.

## Hook Runner

The executable v1 runner reads a hook payload from `stdin` and writes hook JSON
to `stdout`.

```bash
node codex-coach/runner/index.ts < codex-coach/runner/fixtures/agent-development.json
```

For normal project use, run the project-review wrapper from any project
directory. It inspects the current repo, calls the coach, writes
`.local/codex-coach/latest-review.md`, and avoids manual JSON pasting:

```bash
node "/Users/willodonnell/Documents/New project/scripts/coach-project-review.mjs" --prompt "Describe the project outcome you want"
```

To keep a lightweight background review running while you work:

```bash
node "/Users/willodonnell/Documents/New project/scripts/coach-project-review.mjs" --watch --interval 60 --prompt "Describe the project outcome you want"
```

To install native Codex project hooks into another project:

```bash
node "/Users/willodonnell/Documents/New project/scripts/install-codex-coach-hooks.mjs" "/Users/willodonnell/Documents/Business plan"
```

This creates or merges `.codex/hooks.json` in that project and wires
`SessionStart`, `UserPromptSubmit`, `PreCompact`, and `Stop` through the coach
adapter.

`UserPromptSubmit` is the first real hook. It classifies the prompt, calls the
estimator, returns concise `additionalContext`, and emits telemetry-shaped JSON.
Other hook events are intentionally thin stubs until the runner contract is
proven.

The CLI validates hook payloads before running. Unsupported events, invalid
JSON, and malformed primitive fields fail with exit code `1` and do not emit
telemetry.

Run the full fixture proof with:

```bash
npm run prove:coach
```

Local telemetry persistence is opt-in. When enabled, the runner appends JSONL
events to `.local/codex-coach/telemetry.jsonl` by default:

```bash
CODEX_COACH_TELEMETRY=jsonl npm run prove:coach
```

Generate a local telemetry rollup with:

```bash
npm run rollup:coach
```

For a shareable product overview, see `codex-coach/OVERVIEW.md`. For policy and
classifier tuning, see `codex-coach/ADMIN.md`.

The Codex Sites share page for Luke and Sineesh is available at `/codex-coach`
when the site is running.

## Included Shape

- edit site code under `app/`
- edit coach policy and estimator data under `codex-coach/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm run coach:project`: review the current project once
- `npm run coach:watch`: watch the current project and refresh the local review
- `npm run coach:install-hooks -- /path/to/project`: install native project hooks
- `npm run prove:coach`: prove all fixture payloads through the CLI
- `npm run rollup:coach`: summarize local JSONL telemetry
- `npm run test:coach`: run hook runner fixture tests
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
