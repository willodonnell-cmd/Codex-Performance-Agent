import { coachPolicy } from "../../lib/codexCoachEstimator.ts";
import { classifyPrompt } from "./classifyPrompt.ts";
import type {
  HookPayload,
  HookResponse,
  PromptClassification,
  TelemetryEvent,
} from "./types.ts";

const nowIso = () => new Date().toISOString();

const stableHash = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash.toString(16);
};

function makeTelemetryEvent(
  payload: HookPayload,
  classification?: PromptClassification,
  expectedCredits?: number
): TelemetryEvent {
  const timestamp = nowIso();
  const base = [
    payload.event,
    payload.session?.id ?? "no-session",
    payload.session?.threadId ?? "no-thread",
    payload.prompt ?? payload.project?.id ?? timestamp,
  ].join(":");

  return {
    eventId: `coach_${stableHash(`${base}:${timestamp}`)}`,
    hookEvent: payload.event,
    projectType: classification?.projectType,
    modelClass: classification?.modelClass,
    sessionId: payload.session?.id,
    threadId: payload.session?.threadId,
    inputTokens: payload.usage?.inputTokens ?? 0,
    outputTokens: payload.usage?.outputTokens ?? 0,
    cachedInputTokens: payload.usage?.cachedInputTokens ?? 0,
    estimatedCredits: payload.usage?.estimatedCredits ?? expectedCredits,
    actualCredits: payload.usage?.actualCredits,
    dedupeKey: stableHash(base),
    timestamp,
  };
}

function runUserPromptSubmit(payload: HookPayload): HookResponse {
  const prompt = payload.prompt?.trim();
  if (!prompt) {
    return {
      shouldBlock: false,
      telemetryEvent: makeTelemetryEvent(payload),
    };
  }

  const { classification, estimate } = classifyPrompt(prompt);
  const context = [
    `Codex Coach pre-flight: this looks like ${classification.label.toLowerCase()}, ${classification.complexity} complexity.`,
    `Estimated burn is ${estimate.optimisticCredits.toLocaleString()}-${estimate.heavyIterationCredits.toLocaleString()} credits, expected ${estimate.expectedCredits.toLocaleString()} (${estimate.allocationImpactPercent}% of the weekly allocation).`,
    `Recommended model: ${estimate.recommendedModelDisplayName}.`,
    `Efficiency move: ${classification.workflowNudge}`,
  ].join(" ");

  return {
    additionalContext: context,
    telemetryEvent: makeTelemetryEvent(
      payload,
      classification,
      estimate.expectedCredits
    ),
    shouldBlock: false,
    classification,
    estimate,
  };
}

function runSessionStart(payload: HookPayload): HookResponse {
  const routing = coachPolicy.routingRules
    .map((rule) => `${rule.task}:${rule.defaultModelClass}`)
    .join(", ");
  const modelGuidance = Object.values(coachPolicy.modelClasses)
    .map((modelClass) => modelClass.displayName)
    .join(", ");

  return {
    additionalContext: `Codex Coach context: weekly allocation is ${coachPolicy.weeklyAllocationCredits.toLocaleString()} credits. Default routing is ${routing}. Current model map is ${modelGuidance}. Use the premium path only for architecture, hard debugging, ambiguous reasoning, or orchestration blockers.`,
    telemetryEvent: makeTelemetryEvent(payload),
    shouldBlock: false,
  };
}

function runPostToolUse(payload: HookPayload): HookResponse {
  const failures =
    payload.session?.failureCount ?? payload.session?.retryCount ?? 0;

  return {
    additionalContext:
      failures >= 3
        ? "Codex Coach nudge: repeated tool failures detected. Stop broad retries, capture the exact failing command/output, and switch to a focused debugging pass."
        : undefined,
    telemetryEvent: makeTelemetryEvent(payload),
    shouldBlock: false,
  };
}

function runPreCompact(payload: HookPayload): HookResponse {
  const project = payload.project;

  return {
    additionalContext: project?.id
      ? `Codex Coach compact note: project=${project.title ?? project.id}; goal=${project.goal ?? "unknown"}; status=${project.status ?? "active"}; estimate=${project.expectedCredits ?? "unknown"} expected credits; actual=${project.actualCredits ?? "unknown"}; model pattern=${project.modelPattern ?? "unknown"}; next move=${project.nextMove ?? "continue focused execution"}.`
      : undefined,
    telemetryEvent: makeTelemetryEvent(payload),
    shouldBlock: false,
  };
}

function runStop(payload: HookPayload): HookResponse {
  const project = payload.project;

  return {
    additionalContext: project?.outcome
      ? `Codex Coach closeout: completed ${project.outcome}. Estimated ${project.expectedCredits ?? "unknown"}; actual ${project.actualCredits ?? "unknown"}. Future calibration: compare estimate variance before the next similar project.`
      : undefined,
    telemetryEvent: makeTelemetryEvent(payload),
    shouldBlock: false,
  };
}

export function runHook(payload: HookPayload): HookResponse {
  switch (payload.event) {
    case "UserPromptSubmit":
      return runUserPromptSubmit(payload);
    case "SessionStart":
      return runSessionStart(payload);
    case "PostToolUse":
      return runPostToolUse(payload);
    case "PreCompact":
      return runPreCompact(payload);
    case "Stop":
      return runStop(payload);
    default:
      return {
        shouldBlock: false,
        telemetryEvent: makeTelemetryEvent(payload),
      };
  }
}
