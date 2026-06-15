# Codex Coach Admin Notes

## Configure Routing

Edit `config/classifier-rules.json` to tune prompt classification without changing TypeScript.

Each rule has:

- `priority`: higher-priority rules apply later and can override earlier matches.
- `keywords`: any matching term triggers the rule.
- `keywordGroups`: every group must have at least one matching term.
- `classification`: fields to apply when the rule matches.

Use `config/model-policy.json` for weekly allocation, budget pressure modes, and default model-class policy.

## Validate Changes

Run:

```bash
npm run test:coach
npm run prove:coach
```

Use the full validation pass before sharing:

```bash
npm run lint
npm run build
```

## Local Telemetry

Enable local JSONL telemetry with:

```bash
CODEX_COACH_TELEMETRY=jsonl node codex-coach/runner/index.ts < codex-coach/runner/fixtures/agent-development.json
```

Default path:

```text
.local/codex-coach/telemetry.jsonl
```

Generate a local rollup:

```bash
npm run rollup:coach
```

This is not a company-wide usage source. Live credit balances require an approved Codex usage or governance integration.
