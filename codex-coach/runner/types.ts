import type {
  Complexity,
  ContextGrowth,
  EstimateInput,
  EstimateResult,
  ModelClass,
  ProjectType,
  ReasoningLevel,
  ToolUse,
} from "../../lib/codexCoachEstimator";

export type HookEvent =
  | "SessionStart"
  | "UserPromptSubmit"
  | "PostToolUse"
  | "PreCompact"
  | "Stop";

export type HookPayload = {
  event: HookEvent;
  prompt?: string;
  session?: {
    id?: string;
    threadId?: string;
    model?: string;
    reasoningLevel?: string;
    retryCount?: number;
    failureCount?: number;
  };
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    cachedInputTokens?: number;
    estimatedCredits?: number;
    actualCredits?: number;
  };
  workspace?: {
    cwd?: string;
    name?: string;
  };
  project?: {
    id?: string;
    title?: string;
    goal?: string;
    status?: string;
    expectedCredits?: number;
    actualCredits?: number;
    modelPattern?: string;
    nextMove?: string;
    outcome?: string;
  };
};

export type PromptClassification = {
  projectType: ProjectType;
  label: string;
  complexity: Complexity;
  contextGrowth: ContextGrowth;
  toolUse: ToolUse;
  modelClass: ModelClass;
  reasoning: ReasoningLevel;
  expectedIterations: number;
  planLengthWords: number;
  workflowNudge: string;
};

export type TelemetryEvent = {
  eventId: string;
  hookEvent: HookEvent;
  projectType?: ProjectType;
  modelClass?: ModelClass;
  sessionId?: string;
  threadId?: string;
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
  estimatedCredits?: number;
  actualCredits?: number;
  dedupeKey: string;
  timestamp: string;
};

export type HookResponse = {
  additionalContext?: string;
  telemetryEvent?: TelemetryEvent;
  telemetryWarning?: string;
  shouldBlock: false;
  classification?: PromptClassification;
  estimate?: EstimateResult;
};

export type ClassifiedEstimate = {
  classification: PromptClassification;
  estimateInput: EstimateInput;
  estimate: EstimateResult;
};
