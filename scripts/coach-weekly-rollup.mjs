import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const telemetryPath = resolve(
  process.cwd(),
  process.argv[2] ??
    process.env.CODEX_COACH_TELEMETRY_PATH ??
    ".local/codex-coach/telemetry.jsonl"
);

function addCount(map, key, value = 1) {
  const label = key ?? "unknown";
  map.set(label, (map.get(label) ?? 0) + value);
}

function formatMap(map) {
  return [...map.entries()]
    .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");
}

if (!existsSync(telemetryPath)) {
  process.stdout.write(
    `No Codex Coach telemetry found at ${telemetryPath}\n` +
      "Enable local telemetry with CODEX_COACH_TELEMETRY=jsonl.\n"
  );
  process.exit(0);
}

const lines = readFileSync(telemetryPath, "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const byHook = new Map();
const byProjectType = new Map();
const byModelClass = new Map();
let estimatedCredits = 0;
let actualCredits = 0;
let actualCreditEvents = 0;

for (const line of lines) {
  const event = JSON.parse(line);
  addCount(byHook, event.hookEvent);
  addCount(byProjectType, event.projectType);
  addCount(byModelClass, event.modelClass);

  if (typeof event.estimatedCredits === "number") {
    estimatedCredits += event.estimatedCredits;
  }
  if (typeof event.actualCredits === "number") {
    actualCredits += event.actualCredits;
    actualCreditEvents += 1;
  }
}

process.stdout.write(`# Codex Coach Weekly Rollup

Telemetry file: ${telemetryPath}
Events: ${lines.length}
Estimated credits: ${estimatedCredits}
Actual credits: ${actualCreditEvents > 0 ? actualCredits : "not available"}

## Hook Events
${formatMap(byHook)}

## Project Types
${formatMap(byProjectType)}

## Model Classes
${formatMap(byModelClass)}

## Notes
- This rollup reflects local telemetry only.
- Live account balance still requires Codex usage or governance integration.
`);
