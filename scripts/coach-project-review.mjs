import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const coachRoot = resolve(scriptDir, "..");
const runnerPath = join(coachRoot, "codex-coach/runner/index.ts");
const outputPath = resolve(
  process.cwd(),
  ".local/codex-coach/latest-review.md"
);

function parseArgs(argv) {
  const args = {
    watch: false,
    intervalSeconds: 60,
    prompt: "",
    telemetry: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--watch") {
      args.watch = true;
    } else if (arg === "--no-telemetry") {
      args.telemetry = false;
    } else if (arg === "--prompt") {
      args.prompt = argv[index + 1] ?? "";
      index += 1;
    } else if (arg.startsWith("--prompt=")) {
      args.prompt = arg.slice("--prompt=".length);
    } else if (arg === "--interval") {
      args.intervalSeconds = Number(argv[index + 1] ?? args.intervalSeconds);
      index += 1;
    } else if (arg.startsWith("--interval=")) {
      args.intervalSeconds = Number(arg.slice("--interval=".length));
    }
  }

  if (!Number.isFinite(args.intervalSeconds) || args.intervalSeconds < 5) {
    args.intervalSeconds = 60;
  }

  return args;
}

function run(command, args, cwd = process.cwd()) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    return "";
  }

  return result.stdout.trim();
}

function readIfExists(path, maxChars = 2200) {
  if (!existsSync(path)) {
    return "";
  }

  return readFileSync(path, "utf8").slice(0, maxChars).trim();
}

function summarizePackage(cwd) {
  const raw = readIfExists(join(cwd, "package.json"), 4000);
  if (!raw) {
    return "";
  }

  try {
    const pkg = JSON.parse(raw);
    return JSON.stringify(
      {
        name: pkg.name,
        scripts: pkg.scripts,
        dependencies: pkg.dependencies
          ? Object.keys(pkg.dependencies).slice(0, 20)
          : undefined,
        devDependencies: pkg.devDependencies
          ? Object.keys(pkg.devDependencies).slice(0, 20)
          : undefined,
      },
      null,
      2
    );
  } catch {
    return raw;
  }
}

function buildProjectPrompt(cwd, prompt) {
  const projectName = cwd.split("/").filter(Boolean).at(-1) ?? cwd;
  const gitStatus = run("git", ["status", "--short", "--branch"], cwd);
  const files = run("git", ["ls-files"], cwd)
    .split("\n")
    .filter(Boolean)
    .slice(0, 80)
    .join("\n");
  const packageSummary = summarizePackage(cwd);
  const readme =
    readIfExists(join(cwd, "README.md")) ||
    readIfExists(join(cwd, "readme.md")) ||
    "No README found.";

  return [
    `Review this Codex project in the background and provide project-start coaching.`,
    `Project: ${projectName}`,
    `Workspace: ${cwd}`,
    prompt ? `User objective: ${prompt}` : "User objective: infer from repo context.",
    "",
    "Git status:",
    gitStatus || "No git status available.",
    "",
    "Package summary:",
    packageSummary || "No package.json found.",
    "",
    "README excerpt:",
    readme,
    "",
    "Tracked file sample:",
    files || "No tracked files found.",
    "",
    "Coach for the smallest production-shaped next step, likely credit burn, model class, and what to defer.",
  ].join("\n");
}

function makeSignature(cwd, prompt) {
  return [
    prompt,
    run("git", ["status", "--short", "--branch"], cwd),
    run("git", ["rev-parse", "HEAD"], cwd),
  ].join("\n");
}

function runCoach(args) {
  const cwd = process.cwd();
  const payload = {
    event: "UserPromptSubmit",
    workspace: {
      cwd,
      name: cwd.split("/").filter(Boolean).at(-1) ?? cwd,
    },
    prompt: buildProjectPrompt(cwd, args.prompt),
  };

  const result = spawnSync(process.execPath, [runnerPath], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    env: {
      ...process.env,
      ...(args.telemetry ? { CODEX_COACH_TELEMETRY: "jsonl" } : {}),
    },
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exitCode = result.status ?? 1;
    return "";
  }

  const response = JSON.parse(result.stdout);
  const markdown = [
    "# Codex Coach Project Review",
    "",
    response.additionalContext ?? "No coaching context returned.",
    "",
    "## Classification",
    "",
    "```json",
    JSON.stringify(response.classification ?? {}, null, 2),
    "```",
    "",
    "## Estimate",
    "",
    "```json",
    JSON.stringify(response.estimate ?? {}, null, 2),
    "```",
  ].join("\n");

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${markdown}\n`, "utf8");
  process.stdout.write(`${markdown}\n\nSaved to ${outputPath}\n`);
  return markdown;
}

const args = parseArgs(process.argv.slice(2));

if (!args.watch) {
  runCoach(args);
} else {
  let lastSignature = "";
  const tick = () => {
    const signature = makeSignature(process.cwd(), args.prompt);
    if (signature !== lastSignature) {
      lastSignature = signature;
      runCoach(args);
    }
  };

  tick();
  process.stdout.write(
    `Watching ${process.cwd()} every ${args.intervalSeconds}s. Press Ctrl-C to stop.\n`
  );
  setInterval(tick, args.intervalSeconds * 1000);
}
