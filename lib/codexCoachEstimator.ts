import estimatorSeed from "../codex-coach/config/estimator-seed.json" with { type: "json" };
import modelPolicy from "../codex-coach/config/model-policy.json" with { type: "json" };

export type ProjectType = keyof typeof estimatorSeed.projectTypeBaseCredits;
export type Complexity = keyof typeof estimatorSeed.multipliers.complexity;
export type ContextGrowth = keyof typeof estimatorSeed.multipliers.contextGrowth;
export type ToolUse = keyof typeof estimatorSeed.multipliers.toolUse;
export type ModelClass = keyof typeof estimatorSeed.multipliers.modelClass;
export type ReasoningLevel = keyof typeof estimatorSeed.multipliers.reasoning;

export type EstimateInput = {
  projectType: ProjectType;
  complexity: Complexity;
  contextGrowth: ContextGrowth;
  toolUse: ToolUse;
  modelClass: ModelClass;
  reasoning: ReasoningLevel;
  expectedIterations: number;
  planLengthWords: number;
};

export type EstimateResult = {
  optimisticCredits: number;
  expectedCredits: number;
  heavyIterationCredits: number;
  allocationImpactPercent: number;
  remainingAfterExpected: number;
  recommendedModelClass: ModelClass;
  budgetMode: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const roundToTen = (value: number) => Math.round(value / 10) * 10;

export function estimateCredits(input: EstimateInput): EstimateResult {
  const base = estimatorSeed.projectTypeBaseCredits[input.projectType];
  const multipliers = estimatorSeed.multipliers;
  const iterationMultiplier = 1 + clamp(input.expectedIterations - 1, 0, 8) * 0.16;
  const planMultiplier = 1 + clamp(input.planLengthWords - 120, 0, 1200) / 5000;

  const expected = roundToTen(
    base *
      multipliers.complexity[input.complexity] *
      multipliers.contextGrowth[input.contextGrowth] *
      multipliers.toolUse[input.toolUse] *
      multipliers.modelClass[input.modelClass] *
      multipliers.reasoning[input.reasoning] *
      iterationMultiplier *
      planMultiplier
  );

  const allocation = modelPolicy.weeklyAllocationCredits;
  const impact = Math.round((expected / allocation) * 100);
  const budgetMode =
    modelPolicy.budgetPressure.find((rule) => impact <= rule.maxUsedPercent)
      ?.mode ?? "exhausted";

  return {
    optimisticCredits: roundToTen(expected * 0.62),
    expectedCredits: expected,
    heavyIterationCredits: roundToTen(expected * 1.55),
    allocationImpactPercent: impact,
    remainingAfterExpected: Math.max(allocation - expected, 0),
    recommendedModelClass: input.modelClass,
    budgetMode,
  };
}

export const coachPolicy = modelPolicy;
export const calibrationExamples = estimatorSeed.calibrationExamples;
