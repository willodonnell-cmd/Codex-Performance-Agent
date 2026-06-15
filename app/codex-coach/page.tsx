import { estimateCredits } from "@/lib/codexCoachEstimator";

const estimate = estimateCredits({
  projectType: "agent-development",
  complexity: "medium",
  contextGrowth: "medium",
  toolUse: "high",
  modelClass: "standard",
  reasoning: "standard",
  expectedIterations: 3,
  planLengthWords: 440,
});

const capabilities = [
  "Native Codex hook runner for SessionStart and UserPromptSubmit",
  "Pre-flight credit range, model-class recommendation, and efficiency nudge",
  "Editable routing policy and classifier rules",
  "Opt-in local JSONL telemetry and weekly rollup",
  "Installed project hooks for Business plan and Data Center pilots",
];

const gaps = [
  "Live Codex usage and remaining-credit integration",
  "Central telemetry store for team and company rollups",
  "Admin workflow for model policy changes",
  "Privacy and retention policy for prompt/session telemetry",
  "Packaged installation path for broader employee rollout",
];

const pilotSteps = [
  ["Week 1", "Use on coding, research, and agent-build projects with local telemetry."],
  ["Week 2", "Compare estimates against actual usage and tune classifier/model policy."],
  ["Week 3", "Review team-level rollup needs and decide central telemetry design."],
  ["Week 4", "Prepare company rollout recommendation and governance requirements."],
];

const demoOutput = `Codex Coach pre-flight: this looks like agent development, medium complexity. Estimated burn is ${estimate.optimisticCredits.toLocaleString()}-${estimate.heavyIterationCredits.toLocaleString()} credits, expected ${estimate.expectedCredits.toLocaleString()} (${estimate.allocationImpactPercent}% of the weekly allocation). Recommended model class: ${estimate.recommendedModelClass}. Efficiency move: Build one executable vertical slice before implementing every integration surface.`;

export default function CodexCoachSharePage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#141a18]">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-10">
          <div className="flex min-h-[72vh] flex-col justify-between gap-8">
            <nav className="flex items-center justify-between text-sm">
              <span className="font-semibold uppercase tracking-[0.14em] text-emerald-800">
                Codex Coach
              </span>
              <span className="border border-zinc-300 px-3 py-1 text-zinc-600">
                Share preview
              </span>
            </nav>

            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-orange-700">
                AI usage guidance inside the workflow
              </p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-6xl">
                Help every Codex user start with the efficient path.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
                Codex Coach is a native sidecar that estimates project burn,
                recommends a model class, and nudges scope before expensive AI
                work starts. It optimizes business value per credit, not budget
                policing.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-zinc-200 pt-5">
              <Metric label="Weekly allocation" value="2,650" />
              <Metric label="Expected burn" value={estimate.expectedCredits.toLocaleString()} />
              <Metric label="Allocation impact" value={`${estimate.allocationImpactPercent}%`} />
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full border border-zinc-200 bg-[#17231f] p-5 text-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#34473d] pb-4">
                <p className="text-sm font-semibold text-[#d6ed76]">
                  Sample coach output
                </p>
                <p className="font-mono text-xs text-zinc-300">
                  UserPromptSubmit
                </p>
              </div>
              <p className="mt-5 text-base leading-8 text-zinc-100">
                {demoOutput}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <DarkCell label="Classification" value="agent development" />
                <DarkCell label="Model class" value="standard" />
                <DarkCell label="Telemetry" value="JSONL now" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[0.78fr_1.22fr] lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-orange-700">
            Why now
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            The expensive mistake is overbuilding before the goal is clear.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600">
            The coach catches project shape early, recommends the smallest
            production-shaped slice, and keeps higher-cost model usage reserved
            for work that needs it.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {capabilities.map((capability) => (
            <div className="border border-zinc-200 bg-white p-4" key={capability}>
              <p className="text-sm font-medium leading-6">{capability}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1fr_1fr] lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-800">
              Current prototype
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              Working locally, ready for a focused pilot.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              The runner, project hooks, validation, proof fixtures, and local
              telemetry are implemented. Business plan and Data Center have
              project hooks installed for pilot use.
            </p>
          </div>
          <div className="border border-zinc-200 bg-[#f7f8f5] p-5">
            <p className="text-sm font-semibold">What still needs company-wide work</p>
            <div className="mt-4 grid gap-3">
              {gaps.map((gap) => (
                <div className="border border-zinc-200 bg-white px-3 py-2 text-sm" key={gap}>
                  {gap}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-orange-700">
              Pilot recommendation
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              Start narrow, prove the usage loop, then scale.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-zinc-600">
            The leadership decision is whether to invest in live usage
            integration and central telemetry after the pilot confirms value.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {pilotSteps.map(([label, body]) => (
            <div className="border border-zinc-200 bg-white p-4" key={label}>
              <p className="font-mono text-sm font-semibold text-emerald-800">
                {label}
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-zinc-600">{label}</div>
    </div>
  );
}

function DarkCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#22322d] p-3">
      <p className="text-xs text-zinc-300">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
