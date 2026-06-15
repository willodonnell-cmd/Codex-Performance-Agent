#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { appendTelemetryJsonl } from "../telemetry/jsonlAdapter.ts";
import { runHook } from "./runner.ts";
import { validateHookPayload } from "./validatePayload.ts";

function readStdin() {
  return readFileSync(0, "utf8");
}

function main() {
  try {
    const raw = readStdin().trim();
    if (!raw) {
      throw new Error("Expected a JSON hook payload on stdin.");
    }

    const payload = validateHookPayload(JSON.parse(raw));
    const response = runHook(payload);
    if (
      process.env.CODEX_COACH_TELEMETRY === "jsonl" &&
      response.telemetryEvent
    ) {
      try {
        appendTelemetryJsonl(response.telemetryEvent);
      } catch (error) {
        response.telemetryWarning =
          error instanceof Error ? error.message : String(error);
      }
    }
    process.stdout.write(`${JSON.stringify(response, null, 2)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Codex Coach runner error: ${message}\n`);
    process.exitCode = 1;
  }
}

main();
