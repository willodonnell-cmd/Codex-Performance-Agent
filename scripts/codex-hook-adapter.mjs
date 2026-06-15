import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const coachRoot = resolve(scriptDir, "..");
const runnerPath = join(coachRoot, "codex-coach/runner/index.ts");
const supportedEvents = new Set([
  "SessionStart",
  "UserPromptSubmit",
  "PostToolUse",
  "PreCompact",
  "Stop",
]);

function readInput() {
  const raw = readFileSync(0, "utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

function toRunnerPayload(input, eventArg) {
  const event = eventArg || input.hook_event_name;
  if (!supportedEvents.has(event)) {
    throw new Error(`Unsupported Codex Coach hook event: ${event}`);
  }

  return {
    event,
    prompt: input.prompt,
    session: {
      id: input.session_id,
      threadId: input.turn_id,
      model: input.model,
    },
    workspace: {
      cwd: input.cwd,
    },
    usage: {
      inputTokens: input.input_tokens,
      outputTokens: input.output_tokens,
      cachedInputTokens: input.cached_input_tokens,
      estimatedCredits: input.estimated_credits,
      actualCredits: input.actual_credits,
    },
    project: {
      id: input.project_id,
      title: input.project_title,
      goal: input.project_goal,
      status: input.project_status,
      expectedCredits: input.expected_credits,
      actualCredits: input.actual_credits,
      modelPattern: input.model_pattern,
      nextMove: input.next_move,
      outcome: input.outcome,
    },
  };
}

function toCodexOutput(event, runnerResponse) {
  return {
    continue: true,
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: event,
      additionalContext: runnerResponse.additionalContext ?? "",
    },
  };
}

function main() {
  try {
    const input = readInput();
    const event = process.argv[2] || input.hook_event_name;
    const payload = toRunnerPayload(input, event);
    const result = spawnSync(process.execPath, [runnerPath], {
      input: JSON.stringify(payload),
      encoding: "utf8",
      env: {
        ...process.env,
        CODEX_COACH_TELEMETRY:
          process.env.CODEX_COACH_TELEMETRY ?? "jsonl",
      },
    });

    if (result.status !== 0) {
      throw new Error(result.stderr.trim() || "Codex Coach runner failed.");
    }

    const runnerResponse = JSON.parse(result.stdout);
    process.stdout.write(
      `${JSON.stringify(toCodexOutput(payload.event, runnerResponse))}\n`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stdout.write(
      `${JSON.stringify({
        continue: true,
        suppressOutput: true,
        systemMessage: `Codex Coach hook failed: ${message}`,
      })}\n`
    );
  }
}

main();
