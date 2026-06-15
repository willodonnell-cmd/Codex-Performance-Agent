# Codex Coach Pilot

## Audience

Initial review: Luke and Sineesh.

Pilot users: a small group of Codex users working on coding, research, and agent-development projects.

## Demo Links

- Codex Sites overview path: `/codex-coach`
- Technical overview: `codex-coach/OVERVIEW.md`
- Admin guide: `codex-coach/ADMIN.md`

## Pilot Goal

Prove that Codex Coach can reduce wasted credits and improve project starts by giving users a pre-flight estimate, model-class recommendation, and scope nudge before implementation.

## Current Capabilities

- Native project hooks installed for `Business plan` and `Data Center`.
- Working `UserPromptSubmit` coaching.
- Session-start context.
- Configurable classifier rules.
- Local JSONL telemetry and weekly rollup.
- Validation and fixture proof commands.

## Success Criteria

- Users receive useful pre-flight guidance without manually pasting JSON.
- Estimates are directionally useful against actual usage.
- At least three classifier or model-policy improvements are identified from real usage.
- Pilot users report that the coach changed scope or model choice in useful ways.

## Required For Company Rollout

- Live Codex credit-balance and usage integration.
- Central telemetry storage.
- Team and manager rollups.
- Privacy and retention rules for prompt/session telemetry.
- Admin ownership for model policy and routing changes.
