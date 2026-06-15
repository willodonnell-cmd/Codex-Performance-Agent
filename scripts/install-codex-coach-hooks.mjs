import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const coachRoot = resolve(scriptDir, "..");
const adapterPath = join(coachRoot, "scripts/codex-hook-adapter.mjs");
const events = ["SessionStart", "UserPromptSubmit", "PreCompact", "Stop"];

function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

function usage() {
  process.stderr.write(
    "Usage: node scripts/install-codex-coach-hooks.mjs /path/to/project\n"
  );
}

const target = process.argv[2] ? resolve(process.argv[2]) : "";
if (!target) {
  usage();
  process.exit(1);
}

const dotCodex = join(target, ".codex");
const hooksPath = join(dotCodex, "hooks.json");
const existing = existsSync(hooksPath)
  ? JSON.parse(readFileSync(hooksPath, "utf8"))
  : { hooks: {} };

existing.hooks ??= {};

for (const event of events) {
  const command = [
    "CODEX_COACH_TELEMETRY=jsonl",
    shellQuote(process.execPath),
    shellQuote(adapterPath),
    event,
  ].join(" ");
  const group = {
    hooks: [
      {
        type: "command",
        command,
      },
    ],
  };

  existing.hooks[event] ??= [];
  const alreadyInstalled = existing.hooks[event].some((entry) =>
    JSON.stringify(entry).includes(adapterPath)
  );
  if (!alreadyInstalled) {
    existing.hooks[event].push(group);
  }
}

mkdirSync(dotCodex, { recursive: true });
writeFileSync(hooksPath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
process.stdout.write(`Installed Codex Coach hooks at ${hooksPath}\n`);
