# Example Hook Configuration

This is the executable v1 command shape. Each hook passes a JSON payload on
`stdin` and expects JSON on `stdout`.

```json
{
  "SessionStart": {
    "command": "node codex-coach/runner/index.ts"
  },
  "UserPromptSubmit": {
    "command": "node codex-coach/runner/index.ts"
  },
  "PostToolUse": {
    "command": "node codex-coach/runner/index.ts"
  },
  "PreCompact": {
    "command": "node codex-coach/runner/index.ts"
  },
  "Stop": {
    "command": "node codex-coach/runner/index.ts"
  }
}
```

The `UserPromptSubmit` event is the first production-shaped path. Other events
return thin context or telemetry until their behavior is expanded.

Unsupported hook events and malformed payloads fail closed with exit code `1`.
This is intentional so hook configuration errors are visible during setup.

To opt into local JSONL telemetry, set:

```bash
CODEX_COACH_TELEMETRY=jsonl
```

The default path is `.local/codex-coach/telemetry.jsonl`. Override it with
`CODEX_COACH_TELEMETRY_PATH` when a hook runtime needs a different writable
location.
