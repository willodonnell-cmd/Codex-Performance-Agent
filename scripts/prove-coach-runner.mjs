import assert from "node:assert/strict";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const fixturesDir = new URL("../codex-coach/runner/fixtures/", import.meta.url);
const runnerPath = new URL("../codex-coach/runner/index.ts", import.meta.url);
const fixturesDirPath = fileURLToPath(fixturesDir);
const runnerFilePath = fileURLToPath(runnerPath);
const fixtureFiles = readdirSync(fixturesDir)
  .filter((file) => file.endsWith(".json"))
  .sort();
const telemetryMode = process.env.CODEX_COACH_TELEMETRY;
const tempDir =
  telemetryMode === "jsonl" ? mkdtempSync(join(tmpdir(), "codex-coach-")) : null;
const telemetryPath = tempDir ? join(tempDir, "telemetry.jsonl") : null;

try {
  for (const fixtureFile of fixtureFiles) {
    const fixturePath = join(fixturesDirPath, fixtureFile);
    const payload = readFileSync(fixturePath, "utf8");
    const result = spawnSync(process.execPath, [runnerFilePath], {
      input: payload,
      encoding: "utf8",
      env: {
        ...process.env,
        ...(telemetryPath
          ? {
              CODEX_COACH_TELEMETRY: "jsonl",
              CODEX_COACH_TELEMETRY_PATH: telemetryPath,
            }
          : {}),
      },
    });

    assert.equal(
      result.status,
      0,
      `${fixtureFile} failed with stderr: ${result.stderr}`
    );

    const response = JSON.parse(result.stdout);
    assert.equal(response.shouldBlock, false, `${fixtureFile} should not block`);
    assert.ok(response.telemetryEvent, `${fixtureFile} should emit telemetry`);
    assert.ok(
      response.telemetryEvent.eventId,
      `${fixtureFile} telemetry needs eventId`
    );

    if (response.classification) {
      assert.ok(response.estimate, `${fixtureFile} needs estimate`);
    }

    if (response.telemetryEvent.hookEvent === "UserPromptSubmit") {
      assert.ok(
        response.additionalContext,
        `${fixtureFile} needs additionalContext`
      );
      assert.match(
        response.additionalContext,
        /Codex Coach pre-flight:/,
        `${fixtureFile} should return pre-flight context`
      );
    }

    process.stdout.write(`ok ${basename(fixtureFile, ".json")}\n`);
  }

  if (telemetryPath) {
    assert.ok(existsSync(telemetryPath), "telemetry jsonl should be written");
    const lines = readFileSync(telemetryPath, "utf8").trim().split("\n");
    assert.equal(lines.length, fixtureFiles.length);
    for (const line of lines) {
      const event = JSON.parse(line);
      assert.ok(event.eventId);
      assert.ok(event.dedupeKey);
      assert.ok(event.timestamp);
      assert.ok(event.hookEvent);
    }
    process.stdout.write(`proved jsonl telemetry at ${telemetryPath}\n`);
  }

  const invalidCases = [
    {
      name: "invalid-json",
      input: "{",
      stderrPattern: /Codex Coach runner error:/,
    },
    {
      name: "unknown-event",
      input: JSON.stringify({ event: "Unknown", prompt: "x" }),
      stderrPattern: /event must be one of/,
    },
    {
      name: "non-string-prompt",
      input: JSON.stringify({ event: "UserPromptSubmit", prompt: 42 }),
      stderrPattern: /payload\.prompt must be a string/,
    },
    {
      name: "invalid-usage",
      input: JSON.stringify({
        event: "UserPromptSubmit",
        prompt: "Summarize this",
        usage: { inputTokens: "100" },
      }),
      stderrPattern: /payload\.usage\.inputTokens must be a number/,
    },
  ];

  for (const invalidCase of invalidCases) {
    const result = spawnSync(process.execPath, [runnerFilePath], {
      input: invalidCase.input,
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0, `${invalidCase.name} should fail`);
    assert.match(
      result.stderr,
      invalidCase.stderrPattern,
      `${invalidCase.name} should explain the validation failure`
    );
    assert.equal(result.stdout, "", `${invalidCase.name} should not emit stdout`);
    process.stdout.write(`ok invalid ${invalidCase.name}\n`);
  }

  process.stdout.write(`proved ${fixtureFiles.length} coach runner fixtures\n`);
} finally {
  if (tempDir) {
    rmSync(tempDir, { recursive: true, force: true });
  }
}
