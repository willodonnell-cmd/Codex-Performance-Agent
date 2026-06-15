# SessionStart

Return additional context with:

- Weekly allocation from `config/model-policy.json`.
- Current weekly used and remaining credits when telemetry is available.
- Current budget pressure mode.
- Reminder that model names are policy-configured, not hardcoded.

Template:

```text
Codex Coach context: weekly allocation is {weeklyAllocationCredits} credits. Current budget mode is {budgetMode}. Use cheap for cleanup, standard for planning/implementation/debugging, and premium only for architecture, hard debugging, ambiguous reasoning, or orchestration blockers.
```
