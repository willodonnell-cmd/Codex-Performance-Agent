# UserPromptSubmit

Inspect the user prompt and any explicit plan. If the prompt starts a non-trivial project, return a pre-flight note.

Template:

```text
Codex Coach pre-flight: this appears to be {projectType}, {complexity} complexity. Estimated burn is {optimisticCredits}-{heavyIterationCredits} credits, expected {expectedCredits}, or {allocationImpactPercent}% of the weekly allocation. Recommended model: {recommendedModelDisplayName}. Awareness item to commit before execution: {workflowNudge}.
```

Skip output for tiny one-off requests where the coaching note would cost more attention than it saves.

For plan-like prompts, Coach should also require a post-plan review before
execution. After the plan is drafted, explicitly call out the Coach
recommendation, confirm the model and credit impact, and ask the user to commit
to the material scope choice before implementation begins.
