# Codex Coach Overview

## What It Is

Codex Coach is a Codex-native sidecar that helps employees start AI work with a better plan. It classifies a project prompt, estimates credit burn, recommends a model class, and returns a short efficiency nudge before implementation begins.

Share surface: publish the Codex Sites page at `/codex-coach` for Luke and Sineesh, with this repo as the technical source of truth.

## Why It Matters

The goal is better business value per credit, not budget policing. The coach helps users avoid overbuilding, choose the cheapest adequate model class, and preserve higher-cost models for architecture, hard debugging, or ambiguous orchestration.

## What Works Today

- Executable hook runner CLI that reads JSON from `stdin` and writes JSON to `stdout`.
- Real `UserPromptSubmit` pre-flight coaching path.
- Editable classifier rules in `config/classifier-rules.json`.
- Editable weekly allocation and routing policy in `config/model-policy.json`.
- Heuristic credit estimates with optimistic, expected, and heavy-iteration ranges.
- Opt-in local JSONL telemetry.
- Weekly local telemetry rollup command.
- Payload validation, fixture proof, and unit tests.

## Demo Flow

1. Open the Codex Sites overview at `/codex-coach`.
2. Show the sample `UserPromptSubmit` output.
3. Run `npm run prove:coach`.
4. Show the `agent-development` fixture.
5. Run `CODEX_COACH_TELEMETRY=jsonl npm run prove:coach`.
6. Run `npm run rollup:coach` against a telemetry file when local telemetry exists.

## Known Gaps Before Company Rollout

- No live Codex credit-balance integration yet.
- No central telemetry store yet.
- No team, department, or manager rollups yet.
- No admin UI for editing policy; config is JSON.
- No privacy review for prompt/session telemetry retention.
- No installation package for company users yet.

## Recommended Pilot

Start with a small group using coding, research, and agent-development projects. Compare estimates to actual usage, tune classifier and model policy rules, and validate what managers need from weekly rollups before broader rollout.
