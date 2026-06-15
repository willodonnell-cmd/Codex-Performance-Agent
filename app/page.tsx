import { headers } from "next/headers";

type Tone = "green" | "yellow" | "orange" | "red" | "gray";

type Issue = {
  title: string;
  bucket: "External" | "Internal" | "Growth";
  priority: string;
  status: string;
  owner: string;
  summary: string;
  evidence: string;
  risks: string[];
  questions: string[];
  solutions: string[];
  decision: string;
};

const statusStrip: Array<{
  label: string;
  value: string;
  tone: Tone;
  note: string;
}> = [
  {
    label: "External Risk Level",
    value: "Red",
    tone: "red",
    note: "Utility, entitlement, ESA, and ratepayer exposure remain unresolved.",
  },
  {
    label: "Internal Readiness",
    value: "Orange",
    tone: "orange",
    note: "Accountability and development readiness need an operating model.",
  },
  {
    label: "Strategic Opportunity",
    value: "Green",
    tone: "green",
    note: "NVIDIA, capital formation, and infill ownership need structured review.",
  },
  {
    label: "Decision Urgency",
    value: "Red",
    tone: "red",
    note: "ESA windows and customer disintermediation create near-term deadlines.",
  },
  {
    label: "Files Uploaded",
    value: "Transcript only",
    tone: "gray",
    note: "Speaker mapping, board materials, capital decks, and project files needed.",
  },
  {
    label: "Open Questions",
    value: "High",
    tone: "orange",
    note: "Questions are concentrated in ESA exposure, ownership, and strategy fit.",
  },
  {
    label: "Active Workstreams",
    value: "TBD",
    tone: "gray",
    note: "Initial workstreams are staged below for owner assignment.",
  },
  {
    label: "Decision-Ready Items",
    value: "None yet",
    tone: "gray",
    note: "No item should be marked final until research and files are attached.",
  },
];

const framework = [
  {
    title: "External Challenges",
    items: [
      "Utilities",
      "ESAs / power preservation",
      "Municipalities / entitlements",
      "Supply chain",
      "Hyperscaler / customer dynamics",
      "Regulatory / ratepayer backlash",
    ],
    stats: ["6 open issues", "31 proposed solutions", "0 owners assigned", "18 research items", "6 decisions pending"],
  },
  {
    title: "Internal Challenges",
    items: [
      "Organizational capability",
      "Accountability",
      "Development readiness",
      "Entitlement capability",
      "Construction execution",
      "Commercial ownership",
      "Data center expertise",
    ],
    stats: ["7 open issues", "28 proposed solutions", "0 owners assigned", "12 research items", "5 decisions pending"],
  },
  {
    title: "Growth / Strategic Model Opportunities",
    items: [
      "NVIDIA partnership",
      "Capital formation",
      "Tier-one infill data centers",
      "Power infrastructure",
      "NeoClouds",
      "Frontier AI customers",
      "AI factory replication",
    ],
    stats: ["7 open issues", "34 proposed solutions", "2 provisional owners", "17 research items", "8 decisions pending"],
  },
];

const issues: Issue[] = [
  {
    title: "Utilities",
    bucket: "External",
    priority: "Critical",
    status: "Open",
    owner: "TBD",
    summary:
      "Utilities are becoming a central constraint. Delivery obligations are slipping, systems are overwhelmed, and even secured power may need executive-level verification.",
    evidence:
      "Transcript signal: Georgia Power, Dominion, Hoosier, and Oncor were cited as moving timelines; Las Vegas was framed as requiring CEO and governor-level escalation.",
    risks: [
      "Power delivery delay",
      "Customer lease termination risk",
      "Capital at risk before utility certainty",
      "Loss of land contract or customer credibility",
    ],
    questions: [
      "Which commitments are truly secured versus advanced stage?",
      "Which outside termination dates are exposed?",
      "Which utilities require executive escalation?",
    ],
    solutions: [
      "Utility risk dashboard",
      "Executive escalation plan by utility",
      "Delivery confidence score for every project",
      "Outside termination date tracker",
    ],
    decision: "Define the project-level power confidence standard.",
  },
  {
    title: "ESAs / Power Preservation",
    bucket: "External",
    priority: "Critical",
    status: "Open",
    owner: "TBD",
    summary:
      "ESA timing is the most urgent structural mismatch: utilities want short execution windows while leasing and credit processes run longer.",
    evidence:
      "Transcript signal: ninety-day ESA shot clocks, minimum demand charges, and the need to protect the 5.6 GW pipeline were repeated themes.",
    risks: [
      "Loss of power pipeline",
      "Speculative liability",
      "Minimum demand charge exposure",
      "Customer disintermediation",
    ],
    questions: [
      "Should Prologis sign ESAs speculatively?",
      "Can customers, NVIDIA, or third-party capital backstop ESA obligations?",
      "Which projects need decisions in the next 30 / 60 / 90 / 120 days?",
    ],
    solutions: [
      "ESA decision framework",
      "ESA risk committee",
      "Third-party ESA capital model",
      "Customer-backed ESA protection language",
    ],
    decision: "Set maximum retained ESA exposure and escalation authority.",
  },
  {
    title: "Municipalities / Entitlements",
    bucket: "External",
    priority: "Critical",
    status: "Open",
    owner: "TBD",
    summary:
      "Community opposition, moratoriums, ratepayer anger, and public hearing failures are now core business constraints, not peripheral approvals work.",
    evidence:
      "Transcript signal: North Virginia was withdrawn to avoid a likely no vote, triggering a twelve-month waiting period before resubmission.",
    risks: [
      "Entitlement denial",
      "Twelve-month or longer delay",
      "Market-level moratorium",
      "Loss of community narrative",
    ],
    questions: [
      "What is the national data center entitlement playbook?",
      "Which markets require specialized teams?",
      "How are water, noise, vibration, power, and emissions concerns answered?",
    ],
    solutions: [
      "National entitlement playbook",
      "Community engagement toolkit",
      "Local stakeholder map for every project",
      "Expert bench for water, power, noise, emissions, and taxes",
    ],
    decision: "Choose the national entitlement ownership model.",
  },
  {
    title: "Supply Chain",
    bucket: "External",
    priority: "High",
    status: "Open",
    owner: "TBD",
    summary:
      "Customer designs, utility equipment specifications, and generator strategies are more bespoke than expected, limiting broad inventory strategies.",
    evidence:
      "Transcript signal: NVIDIA reference architecture was described as a possible way to remove nine to twelve months from delivery schedules.",
    risks: [
      "Schedule delay",
      "Wrong component procurement",
      "Bespoke design fragility",
      "Capital trapped in unusable equipment",
    ],
    questions: [
      "Which components can be standardized?",
      "Which are customer-specific or utility-specific?",
      "Which vendors and integrators should be approved or prohibited?",
    ],
    solutions: [
      "Supply chain component map",
      "Standard design doctrine",
      "Approved vendor list",
      "NVIDIA reference-design workstream",
    ],
    decision: "Approve the modularity and no-bespoke-without-approval doctrine.",
  },
  {
    title: "Hyperscaler / Customer Dynamics",
    bucket: "External",
    priority: "High",
    status: "Open",
    owner: "TBD",
    summary:
      "The diversified customer roster strategy needs stress testing because hyperscalers have development arms and may only need third-party power inside short windows.",
    evidence:
      "Transcript signal: Google, Meta, AWS, Microsoft, Oracle, NVIDIA, OpenAI, Anthropic, CoreWeave, Lambda Labs, and Fluidstack were discussed as materially different customer profiles.",
    risks: [
      "Disintermediation",
      "Customer concentration",
      "Operational liability",
      "Weak credit or inadequate guarantees",
    ],
    questions: [
      "Which customers are real near-term demand?",
      "How much would NVIDIA alignment alienate others?",
      "What commercial coverage model is required?",
    ],
    solutions: [
      "Customer-by-customer strategic profile",
      "Customer risk / return matrix",
      "Commercial owner map",
      "Demand-by-market and demand-by-MW tracker",
    ],
    decision: "Define the strategic customer coverage model.",
  },
  {
    title: "Regulatory / Ratepayer Backlash",
    bucket: "External",
    priority: "High",
    status: "Open",
    owner: "TBD",
    summary:
      "Data center power demand is producing regulatory scrutiny around rates, cost allocation, minimum demand charges, and grid upgrade narratives.",
    evidence:
      "Transcript signal: Texas, Oncor, ERCOT, PG&E, and minimum demand charge structures were discussed as live regulatory and market narrative risks.",
    risks: [
      "Adverse rate treatment",
      "Political backlash",
      "Underwriting error",
      "Public-policy delay",
    ],
    questions: [
      "How should Prologis talk about ratepayer impact?",
      "Which markets are most politically exposed?",
      "Can grid investment benefits be quantified?",
    ],
    solutions: [
      "Regulatory tracker",
      "Ratepayer narrative package",
      "Utility-rate research workstream",
      "Market-level risk scores",
    ],
    decision: "Approve a defensible ratepayer and grid-benefit narrative.",
  },
  {
    title: "Accountability / Ownership",
    bucket: "Internal",
    priority: "Critical",
    status: "Open",
    owner: "TBD",
    summary:
      "Critical readiness and execution responsibilities appear to be owned by everyone and no one, creating unacceptable ambiguity.",
    evidence:
      "Transcript signal: land readiness, entitlements, utility pathways, DOT approvals, and lot-line adjustments were cited as accountability gaps.",
    risks: [
      "Finger-pointing",
      "Capital approval on incomplete diligence",
      "Delayed closings",
      "Execution drift",
    ],
    questions: [
      "Who owns land readiness?",
      "Who owns entitlement and utility pathway readiness?",
      "Should ownership sit in deployment, development, or a dedicated data center group?",
    ],
    solutions: [
      "Accountable owner field for every site",
      "RACI matrix",
      "Required stage gates",
      "Zero-tolerance missing-item list",
    ],
    decision: "Name the one accountable owner model for every project stage.",
  },
  {
    title: "Organizational Capability Model",
    bucket: "Internal",
    priority: "High",
    status: "Open",
    owner: "TBD",
    summary:
      "Data centers may require specialized roles across development services, entitlements, utility interface, construction, and capital partner risk mitigation.",
    evidence:
      "Transcript signal: the group discussed rebuilding the org model from scratch and determining how many specialized people are needed by capability.",
    risks: [
      "Generalist overload",
      "Inconsistent regional execution",
      "No scalable process library",
      "Underbuilt specialist bench",
    ],
    questions: [
      "Which capabilities are centralized versus regional?",
      "Does Prologis need a data center SWAT team?",
      "Should capabilities be hired, partnered, or acquired?",
    ],
    solutions: [
      "Target operating model",
      "Capability inventory",
      "Hire / partner / acquire matrix",
      "Specialized role definitions",
    ],
    decision: "Approve a target operating model workstream.",
  },
  {
    title: "Development Readiness",
    bucket: "Internal",
    priority: "Critical",
    status: "Open",
    owner: "TBD",
    summary:
      "Basic readiness gaps become much more costly in data centers because contribution, leasing, and utility commitments all depend on clean execution.",
    evidence:
      "Transcript signal: DOT approvals, easement pathways, utility pathways, lot-line adjustments, and PUC items were cited as incomplete on live projects.",
    risks: [
      "Delayed land sale or contribution",
      "Capital partner rejection",
      "Customer credibility loss",
      "Late-stage diligence failure",
    ],
    questions: [
      "What readiness items are mandatory before IC?",
      "Which current pipeline projects have gaps?",
      "What evidence is required before customer commitment?",
    ],
    solutions: [
      "Project readiness checklist",
      "Readiness score by project",
      "Pre-IC readiness certification",
      "Current pipeline audit",
    ],
    decision: "Lock mandatory readiness gates.",
  },
  {
    title: "NVIDIA Partnership",
    bucket: "Growth",
    priority: "Critical",
    status: "Active Exploration",
    owner: "Damon / Will / TBD",
    summary:
      "A deeper NVIDIA partnership could move Prologis from land-and-power developer toward preferred developer of NVIDIA reference-design AI factories.",
    evidence:
      "Transcript signal: NVIDIA was discussed as potential headstock capital, ESA support, gear supplier, ecosystem demand source, and reference-design anchor.",
    risks: [
      "Customer alienation",
      "NVIDIA concentration",
      "Unclear lease guarantee",
      "Capital partner acceptance risk",
    ],
    questions: [
      "What exactly does NVIDIA want announced?",
      "Will NVIDIA sign or back ESAs?",
      "What vacancy bridge or credit support is acceptable?",
      "Which sites are suitable?",
    ],
    solutions: [
      "Partnership term sheet",
      "Exclusivity / non-exclusivity language",
      "Vacancy bridge options",
      "Pipeline suitability map",
    ],
    decision: "Decide whether NVIDIA becomes a strategic platform path or one workstream among several.",
  },
  {
    title: "Capital Formation",
    bucket: "Growth",
    priority: "High",
    status: "Needs Additional Files",
    owner: "TBD",
    summary:
      "The capital stack may need to evolve if the business preserves ESA risk, builds AI factories, owns infill assets, or develops power infrastructure.",
    evidence:
      "Transcript signal: Quantum, Blue Owl, Crusoe, third-party ESA capital, and current data center capital packages were discussed as connected questions.",
    risks: [
      "Wrong risk retained on balance sheet",
      "Investor confusion",
      "ESA risk undercapitalized",
      "NVIDIA concentration discount",
    ],
    questions: [
      "What does the current capital strategy assume?",
      "Can ESA risk be separately capitalized?",
      "Which risks should be retained or syndicated?",
    ],
    solutions: [
      "Capital model comparison",
      "Investor risk appetite map",
      "ESA capital product concept",
      "Balance sheet vs fund vs JV comparison",
    ],
    decision: "Choose the capital formation questions for the next executive review.",
  },
  {
    title: "Tier-One Infill Data Centers",
    bucket: "Growth",
    priority: "Medium / High",
    status: "Open",
    owner: "TBD",
    summary:
      "Certain infill data centers may be long-term crown-jewel assets where power and location are uniquely scarce and customer use cases are more fungible.",
    evidence:
      "Transcript signal: Silicon Valley, Northern Virginia, Paris, London, Amsterdam, true Dallas, and true Atlanta were cited as possible durable markets.",
    risks: [
      "Obsolescence",
      "Wrong market selection",
      "Portfolio fit uncertainty",
      "Capitalization mismatch",
    ],
    questions: [
      "Which infill markets are truly durable?",
      "What MW size is most fungible?",
      "Could investors accept 5% to 10% of NOI from data centers?",
    ],
    solutions: [
      "Infill market scorecard",
      "Latency demand research",
      "Crown-jewel ownership thesis",
      "Sell vs own vs JV comparison",
    ],
    decision: "Determine whether crown-jewel ownership belongs in the strategy.",
  },
  {
    title: "Power / Energy Infrastructure",
    bucket: "Growth",
    priority: "High",
    status: "Open",
    owner: "TBD",
    summary:
      "A durable data center platform may need power development, on-site generation, utility partnerships, and long-range tracking of advanced generation.",
    evidence:
      "Transcript signal: on-prem plants, natural gas, distributed generation, SMRs, Crusoe, and the limits of dual-fed utility power were discussed.",
    risks: [
      "Capability gap",
      "Technology timing mismatch",
      "Permitting exposure",
      "Overreliance on utility model",
    ],
    questions: [
      "Does Prologis need to become a power developer?",
      "Which power capabilities should be internal, partnered, or acquired?",
      "Where is on-site generation realistic?",
    ],
    solutions: [
      "Energy capability roadmap",
      "Partner / acquire target list",
      "Prototype power design library",
      "Utility alternatives matrix",
    ],
    decision: "Scope the energy capability roadmap.",
  },
];

const solutions = [
  ["ESA Capital Product", "ESAs / Power Preservation", "Needs Research", "Critical", "Model third-party capital that preserves power without forcing Prologis to retain all speculative exposure."],
  ["NVIDIA ESA Backstop", "NVIDIA Partnership", "In Review", "Critical", "Test whether NVIDIA support can protect ESA deadlines, reduce supply-chain risk, and anchor customer demand."],
  ["National Entitlement Playbook", "Municipalities / Entitlements", "Idea", "Critical", "Standardize local stakeholder maps, public hearing preparation, water/noise/power narratives, and expert benches."],
  ["Project Readiness Certification", "Development Readiness", "Idea", "Critical", "Create mandatory gates before IC, customer commitment, capital contribution, or land sale."],
  ["AI Factory Reference Model", "AI Factory Replication", "Needs Research", "High", "Define what is standardized, what varies by market, and what can remove nine to twelve months from delivery."],
  ["Infill Crown-Jewel Thesis", "Tier-One Infill Data Centers", "Needs Research", "Medium / High", "Evaluate ownership, obsolescence, NOI fit, and market durability for sub-100 MW assets in top markets."],
];

const decisions = [
  ["ESA Exposure Ceiling", "Not started", "What exposure can Prologis retain before customer, NVIDIA, or third-party support is required?"],
  ["NVIDIA Announcement Boundaries", "Draft needed", "What can Prologis say without unacceptable exclusivity or hyperscaler alienation?"],
  ["One Accountable Owner Model", "Not started", "Who owns each site from acquisition through stabilization?"],
  ["Infill Ownership Policy", "Research needed", "Can crown-jewel data centers be owned on balance sheet, in fund structures, or JV form?"],
];

const users = [
  ["Will O'Donnell", "Admin", "Initial admin"],
  ["Damon Austin", "Admin", "Initial admin"],
  ["Dan Letter", "Editor", "Suggested approved user"],
  ["Tim Arndt", "Editor", "Suggested approved user"],
  ["Joyce De Vry", "Advisor / Read Only", "Suggested approved user"],
  ["Natasha Law", "Advisor / Read Only", "Suggested approved user"],
  ["Additional DC team", "Viewer", "Requires Will or Damon approval"],
];

const toneClasses: Record<Tone, string> = {
  green: "border-emerald-500 bg-emerald-50 text-emerald-950",
  yellow: "border-yellow-500 bg-yellow-50 text-yellow-950",
  orange: "border-orange-500 bg-orange-50 text-orange-950",
  red: "border-red-500 bg-red-50 text-red-950",
  gray: "border-zinc-300 bg-zinc-50 text-zinc-900",
};

const bucketStyles = {
  External: "border-red-200 bg-red-50/60 text-red-950",
  Internal: "border-sky-200 bg-sky-50/70 text-sky-950",
  Growth: "border-emerald-200 bg-emerald-50/70 text-emerald-950",
};

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;
  const displayName = fullName ?? email ?? "Workspace user";
  const headlineMetrics = statusStrip.slice(0, 4);
  const featuredIssues = issues.filter((issue) =>
    [
      "ESAs / Power Preservation",
      "Utilities",
      "Accountability / Ownership",
      "NVIDIA Partnership",
    ].includes(issue.title),
  );

  return (
    <main className="min-h-screen bg-[#f4f5f1] text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                Confidential Prologis Strategy
              </p>
              <h1 className="mt-2 max-w-4xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                Data Center Strategy Control Tab
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
                June 10 Strategy Discussion Capture and Solutioning Workspace
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-700">
                This page is a working control surface, not a final strategy.
                It is meant to show the few decisions and workstreams that
                matter now, while keeping the broader issue architecture in
                view.
              </p>
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Signed-in context
              </span>
              <span className="mt-1 block font-medium text-zinc-950">
                {displayName}
              </span>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Upload New File",
              "Add Decision",
              "Export Executive Summary",
              "Run Red Team Review",
            ].map((action) => (
              <a
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-center text-sm font-medium text-zinc-800 transition hover:border-zinc-500 hover:bg-zinc-100"
                href="#solutioning"
                key={action}
              >
                {action}
              </a>
            ))}
          </div>
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-950">
            This site contains confidential Prologis strategy information. Do
            not forward, copy externally, or use outside approved internal
            strategy work.
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-6 lg:grid-cols-4 lg:px-8">
        {headlineMetrics.map((item) => (
          <article
            className={`rounded-md border-l-4 p-4 ${toneClasses[item.tone]}`}
            key={item.label}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">
              {item.label}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{item.value}</h2>
            <p className="mt-3 text-sm leading-6 opacity-80">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-8 lg:grid-cols-[1.4fr_0.8fr] lg:px-8">
        <article className="rounded-md border border-zinc-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Meeting Capture
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            June 10 Data Center Strategy Discussion
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-700">
            The meeting focused on whether Prologis&apos; land-and-power strategy
            still works under tighter utility timelines, compressed ESA
            windows, entitlement resistance, and more specialized execution
            requirements. The immediate question is not the final answer; it is
            which few workstreams deserve active solutioning first.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Meeting type", "Strategy working session / problem decomposition"],
              ["Source", "Transcript uploaded; speaker mapping still TBD"],
              ["Participants", "Damon, Will, Dan, Tim, Joyce, Natasha, others TBD"],
            ].map(([label, value]) => (
              <div className="rounded-md bg-zinc-50 p-4" key={label}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  {label}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-700">{value}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-md border border-zinc-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Immediate Decisions
          </p>
          <h2 className="mt-2 text-2xl font-semibold">What needs resolution</h2>
          <div className="mt-5 grid gap-3">
            {decisions.map(([title, status, prompt]) => (
              <div className="rounded-md border border-zinc-200 p-4" key={title}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{title}</h3>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                    {status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-700">{prompt}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="border-y border-zinc-200 bg-[#ecefe8]">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                Focus Areas
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Active workstreams
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-zinc-600">
              These are the four workstreams that currently shape the whole
              discussion. The rest of the issue map stays below as structured
              backlog, not first-screen noise.
            </p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {featuredIssues.map((issue) => (
              <article className="rounded-md border border-zinc-300 bg-white p-5" key={issue.title}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${bucketStyles[issue.bucket]}`}
                    >
                      {issue.bucket}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold">{issue.title}</h3>
                  </div>
                  <div className="text-right text-sm text-zinc-600">
                    <p>{issue.priority}</p>
                    <p>{issue.status}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-700">
                  {issue.summary}
                </p>
                <div className="mt-4 rounded-md bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
                  <span className="font-semibold text-zinc-950">Next decision:</span>{" "}
                  {issue.decision}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <CompactList title="Key risks" items={issue.risks.slice(0, 2)} />
                  <CompactList title="Open questions" items={issue.questions.slice(0, 2)} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1fr_1fr_0.85fr] lg:px-8">
        <article className="rounded-md border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Issue Map
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Three strategic buckets</h2>
          <div className="mt-5 grid gap-3">
            {framework.map((card) => (
              <div className="rounded-md border border-zinc-200 p-4" key={card.title}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{card.title}</h3>
                  <span className="text-xs font-medium text-zinc-500">
                    {card.stats[0]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {card.items.slice(0, 4).map((item) => (
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-zinc-200 bg-white p-5" id="solutioning">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Solutioning Workspace
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Active solution objects</h2>
          <div className="mt-5 grid gap-3">
            {solutions.slice(0, 4).map(([title, category, status, priority, description]) => (
              <div
                className="rounded-md border border-zinc-200 bg-zinc-50 p-4"
                key={title}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{title}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-zinc-700">
                    {status}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-zinc-700">
                    {priority}
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                  {category}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-md border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Governance
          </p>
          <h2 className="mt-2 text-2xl font-semibold">People and files</h2>
          <div className="mt-5 space-y-5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Initial admins
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {users.slice(0, 2).map(([user]) => (
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-800" key={user}>
                    {user}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Approved users
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Editors, advisors, and additional data center team members are
                approval-gated by Will or Damon.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Most needed files
              </h3>
              <div className="mt-3 grid gap-2">
                {[
                  "Project pipeline file",
                  "Capital raise materials",
                  "Utility commitment documents",
                ].map((file) => (
                  <div className="rounded-md bg-zinc-50 px-3 py-2 text-sm text-zinc-700" key={file}>
                    {file}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Full Backlog
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Remaining issues in queue</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {[
              ["External", issues.filter((issue) => issue.bucket === "External")],
              ["Internal", issues.filter((issue) => issue.bucket === "Internal")],
              ["Growth", issues.filter((issue) => issue.bucket === "Growth")],
            ].map(([label, bucketIssues]) => (
              <article className="rounded-md border border-zinc-200 bg-zinc-50 p-4" key={label}>
                <h3 className="font-semibold">{label}</h3>
                <div className="mt-3 grid gap-2">
                  {(bucketIssues as Issue[]).map((issue) => (
                    <div className="rounded bg-white px-3 py-2" key={issue.title}>
                      <p className="text-sm font-medium text-zinc-900">{issue.title}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {issue.priority} · {issue.status}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CompactList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-zinc-200 p-4">
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-zinc-700">
        {items.map((item) => (
          <li className="border-l-2 border-zinc-200 pl-3" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
