import type { HookEvent, HookPayload } from "./types.ts";

const hookEvents = new Set<HookEvent>([
  "SessionStart",
  "UserPromptSubmit",
  "PostToolUse",
  "PreCompact",
  "Stop",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertOptionalString(
  record: Record<string, unknown>,
  key: string,
  path: string
) {
  if (record[key] !== undefined && typeof record[key] !== "string") {
    throw new Error(`${path}.${key} must be a string when present.`);
  }
}

function assertOptionalNumber(
  record: Record<string, unknown>,
  key: string,
  path: string
) {
  if (record[key] !== undefined && typeof record[key] !== "number") {
    throw new Error(`${path}.${key} must be a number when present.`);
  }
}

export function validateHookPayload(value: unknown): HookPayload {
  if (!isRecord(value)) {
    throw new Error("Hook payload must be a JSON object.");
  }

  if (typeof value.event !== "string" || !hookEvents.has(value.event as HookEvent)) {
    throw new Error(
      `event must be one of: ${Array.from(hookEvents).join(", ")}.`
    );
  }

  assertOptionalString(value, "prompt", "payload");

  if (value.session !== undefined) {
    if (!isRecord(value.session)) {
      throw new Error("payload.session must be an object when present.");
    }
    for (const key of ["id", "threadId", "model", "reasoningLevel"]) {
      assertOptionalString(value.session, key, "payload.session");
    }
    for (const key of ["retryCount", "failureCount"]) {
      assertOptionalNumber(value.session, key, "payload.session");
    }
  }

  if (value.usage !== undefined) {
    if (!isRecord(value.usage)) {
      throw new Error("payload.usage must be an object when present.");
    }
    for (const key of [
      "inputTokens",
      "outputTokens",
      "cachedInputTokens",
      "estimatedCredits",
      "actualCredits",
    ]) {
      assertOptionalNumber(value.usage, key, "payload.usage");
    }
  }

  if (value.workspace !== undefined) {
    if (!isRecord(value.workspace)) {
      throw new Error("payload.workspace must be an object when present.");
    }
    for (const key of ["cwd", "name"]) {
      assertOptionalString(value.workspace, key, "payload.workspace");
    }
  }

  if (value.project !== undefined) {
    if (!isRecord(value.project)) {
      throw new Error("payload.project must be an object when present.");
    }
    for (const key of [
      "id",
      "title",
      "goal",
      "status",
      "modelPattern",
      "nextMove",
      "outcome",
    ]) {
      assertOptionalString(value.project, key, "payload.project");
    }
    for (const key of ["expectedCredits", "actualCredits"]) {
      assertOptionalNumber(value.project, key, "payload.project");
    }
  }

  return value as HookPayload;
}
