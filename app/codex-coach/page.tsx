export default function CodexCoachSharePage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] px-6 py-12 text-[#151a17]">
      <article className="mx-auto max-w-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-800">
          Codex Coach
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          A lightweight coach for using Codex efficiently
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-700">
          Codex Coach is a working prototype for a company-wide assistant that
          helps employees use Codex more efficiently before expensive work
          starts. It runs inside a Codex project, reads the user&apos;s prompt,
          classifies the type of work, estimates the likely credit range,
          recommends an appropriate model class, and gives one practical scope
          suggestion so the user can get to a production-shaped result with less
          waste. The current version proves the core workflow locally with a
          real hook runner, fixture tests, editable routing rules, and local
          telemetry. To make it effective across the company, the next build
          should add live remaining-credit visibility, centralized telemetry,
          admin controls for model policy, and a packaged installation path for
          teams.
        </p>
        <div className="mt-8 border-t border-zinc-200 pt-6 text-sm leading-7 text-zinc-600">
          <p>
            Share this page with the GitHub repository as the short overview for
            Luke, Sineesh, and pilot users.
          </p>
          <p className="mt-3">
            Status: prototype is working locally and ready for a focused pilot,
            but not yet a fully managed company-wide product.
          </p>
        </div>
      </article>
    </main>
  );
}
