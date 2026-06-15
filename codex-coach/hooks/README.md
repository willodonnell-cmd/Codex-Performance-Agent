# Codex Coach Hooks

These hook contracts describe the v1 sidecar behavior. The hooks should return `additionalContext` only when the context is useful and short enough to help the active session.

## Events

- `SessionStart`: load workspace conventions, weekly allocation, current budget mode, and model routing policy.
- `UserPromptSubmit`: classify the project, estimate credit range, and recommend model class.
- `PostToolUse`: detect repeated retries, excessive context expansion, or premium model use on low-risk work.
- `PreCompact`: preserve project state, budget status, and the next recommended move.
- `Stop`: summarize what happened and emit calibration notes for telemetry.

## Context Budget

Hook output should normally stay under 180 words. The coach should speak only when it changes a decision or preserves context that would otherwise be lost.
