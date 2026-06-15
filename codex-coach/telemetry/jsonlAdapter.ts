import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { TelemetryEvent } from "../runner/types.ts";

export const DEFAULT_TELEMETRY_PATH = ".local/codex-coach/telemetry.jsonl";

export function appendTelemetryJsonl(
  event: TelemetryEvent,
  filePath = process.env.CODEX_COACH_TELEMETRY_PATH ?? DEFAULT_TELEMETRY_PATH
) {
  const resolvedPath = resolve(process.cwd(), filePath);
  mkdirSync(dirname(resolvedPath), { recursive: true });
  appendFileSync(resolvedPath, `${JSON.stringify(event)}\n`, "utf8");
  return resolvedPath;
}
