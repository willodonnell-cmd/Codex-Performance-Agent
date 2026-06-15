import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { appendTelemetryJsonl } from "../../telemetry/jsonlAdapter.ts";
import { runHook } from "../runner.ts";
import type { HookPayload } from "../types.ts";
import { validateHookPayload } from "../validatePayload.ts";

function fixture(name: string): HookPayload {
  return JSON.parse(
    readFileSync(new URL(`../fixtures/${name}.json`, import.meta.url), "utf8")
  ) as HookPayload;
}

test("summarization routes to cheap with a low estimate", () => {
  const response = runHook(fixture("summarization"));

  assert.equal(response.shouldBlock, false);
  assert.equal(response.classification?.projectType, "summarization");
  assert.equal(response.classification?.modelClass, "cheap");
  assert.ok(response.estimate);
  assert.ok(response.estimate.expectedCredits < 500);
  assert.match(response.additionalContext ?? "", /Recommended model: GPT-5\.4-mini \(Low\)/);
});

test("coding routes to standard", () => {
  const response = runHook(fixture("coding"));

  assert.equal(response.classification?.projectType, "coding");
  assert.equal(response.classification?.modelClass, "standard");
  assert.ok(response.estimate);
  assert.ok(response.estimate.expectedCredits >= 500);
});

test("hard debugging can escalate to premium", () => {
  const response = runHook(fixture("debugging"));

  assert.equal(response.classification?.projectType, "debugging");
  assert.equal(response.classification?.modelClass, "premium");
  assert.equal(response.classification?.reasoning, "high");
  assert.match(response.additionalContext ?? "", /Recommended model: GPT-5\.5 \(High\)/);
});

test("agent development uses standard with high tool use", () => {
  const response = runHook(fixture("agent-development"));

  assert.equal(response.classification?.projectType, "agent-development");
  assert.equal(response.classification?.modelClass, "standard");
  assert.equal(response.classification?.toolUse, "high");
  assert.match(
    response.additionalContext ?? "",
    /Awareness item to commit before execution: .*vertical slice/
  );
});

test("documentation cleanup routes to cheap", () => {
  const response = runHook(fixture("documentation-cleanup"));

  assert.equal(response.classification?.label, "Documentation cleanup");
  assert.equal(response.classification?.modelClass, "cheap");
  assert.equal(response.classification?.reasoning, "low");
});

test("business memo revision routes to cheap documentation cleanup", () => {
  const response = runHook({
    event: "UserPromptSubmit",
    prompt:
      "Help me revise the 2027 business plan memo, clean up the structure, and identify the next edits before we send it for review.",
  });

  assert.equal(response.classification?.label, "Documentation cleanup");
  assert.equal(response.classification?.modelClass, "cheap");
  assert.match(response.additionalContext ?? "", /Recommended model: GPT-5\.4-mini \(Low\)/);
});

test("unknown work defaults to coding standard", () => {
  const response = runHook({
    event: "UserPromptSubmit",
    prompt: "Please make this better and check the result.",
  });

  assert.equal(response.classification?.projectType, "coding");
  assert.equal(response.classification?.modelClass, "standard");
});

test("architecture language escalates the model class", () => {
  const response = runHook({
    event: "UserPromptSubmit",
    prompt:
      "Architect a cross-system implementation plan for this coding workflow.",
  });

  assert.equal(response.classification?.modelClass, "premium");
  assert.equal(response.classification?.reasoning, "high");
});

test("plan-like work requires review before execution", () => {
  const response = runHook({
    event: "UserPromptSubmit",
    prompt:
      "Create a plan for the full workflow across multiple tools, then help me choose the smallest executable slice.",
  });

  assert.match(response.additionalContext ?? "", /Plan review required/);
  assert.match(response.additionalContext ?? "", /ask the user to commit/);
});

test("session start returns policy context", () => {
  const response = runHook({ event: "SessionStart" });

  assert.equal(response.shouldBlock, false);
  assert.match(response.additionalContext ?? "", /weekly allocation/i);
  assert.match(response.additionalContext ?? "", /GPT-5\.5 \(Low\)/i);
  assert.ok(response.telemetryEvent);
});

test("post tool use speaks only after repeated failures", () => {
  const quiet = runHook({ event: "PostToolUse", session: { failureCount: 1 } });
  const noisy = runHook({ event: "PostToolUse", session: { failureCount: 3 } });

  assert.equal(quiet.additionalContext, undefined);
  assert.match(noisy.additionalContext ?? "", /repeated tool failures/i);
});

test("telemetry event is schema-compatible", () => {
  const response = runHook(fixture("agent-development"));

  assert.ok(response.telemetryEvent?.eventId);
  assert.equal(response.telemetryEvent?.hookEvent, "UserPromptSubmit");
  assert.equal(response.telemetryEvent?.inputTokens, 0);
  assert.ok(response.telemetryEvent?.dedupeKey);
  assert.ok(response.telemetryEvent?.timestamp);
});

test("jsonl telemetry adapter writes one parseable event", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "codex-coach-"));
  const filePath = join(tempDir, "telemetry.jsonl");

  try {
    const response = runHook(fixture("agent-development"));
    assert.ok(response.telemetryEvent);
    appendTelemetryJsonl(response.telemetryEvent, filePath);

    const lines = readFileSync(filePath, "utf8").trim().split("\n");
    assert.equal(lines.length, 1);

    const event = JSON.parse(lines[0]);
    assert.equal(event.hookEvent, "UserPromptSubmit");
    assert.ok(event.eventId);
    assert.ok(event.dedupeKey);
    assert.ok(event.timestamp);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("payload validation rejects unknown hook events", () => {
  assert.throws(
    () => validateHookPayload({ event: "Unknown", prompt: "x" }),
    /event must be one of/
  );
});

test("payload validation rejects non-string prompt", () => {
  assert.throws(
    () => validateHookPayload({ event: "UserPromptSubmit", prompt: 42 }),
    /payload\.prompt must be a string/
  );
});

test("payload validation rejects invalid usage values", () => {
  assert.throws(
    () =>
      validateHookPayload({
        event: "UserPromptSubmit",
        prompt: "Summarize this",
        usage: { inputTokens: "100" },
      }),
    /payload\.usage\.inputTokens must be a number/
  );
});

test("payload validation accepts minimal valid payloads", () => {
  assert.deepEqual(validateHookPayload({ event: "SessionStart" }), {
    event: "SessionStart",
  });
});
