# UserPromptSubmit

Inspect the user prompt and any explicit plan. If the prompt starts a non-trivial project, return a pre-flight note.

Template:

```text
Codex Coach pre-flight: this appears to be {projectType}, {complexity} complexity. Estimated burn is {optimisticCredits}-{heavyIterationCredits} credits, expected {expectedCredits}, or {allocationImpactPercent}% of the weekly allocation. Recommended model: {recommendedModelDisplayName}. Best efficiency move: {workflowNudge}.
```

Skip output for tiny one-off requests where the coaching note would cost more attention than it saves.
