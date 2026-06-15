import type {
  ClassifiedEstimate,
  PromptClassification,
} from "./types.ts";
import { estimateCredits } from "../../lib/codexCoachEstimator.ts";
import classifierRules from "../config/classifier-rules.json" with { type: "json" };

const hasAny = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term));

const countWords = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

type ClassificationPatch = Partial<Omit<PromptClassification, "planLengthWords">>;

type ClassifierRule = {
  id: string;
  priority: number;
  keywords?: string[];
  keywordGroups?: string[][];
  classification: ClassificationPatch;
};

function ruleMatches(text: string, rule: ClassifierRule) {
  const keywordMatch = rule.keywords ? hasAny(text, rule.keywords) : false;
  const groupMatch = rule.keywordGroups
    ? rule.keywordGroups.every((group) => hasAny(text, group))
    : false;

  return keywordMatch || groupMatch;
}

export function classifyPrompt(prompt: string): ClassifiedEstimate {
  const normalized = prompt.toLowerCase();
  const planLengthWords = countWords(prompt);

  const classification: PromptClassification = {
    ...classifierRules.default,
    planLengthWords,
  };

  const matchingRules = (classifierRules.rules as ClassifierRule[])
    .filter((rule) => ruleMatches(normalized, rule))
    .sort((first, second) => first.priority - second.priority);

  for (const rule of matchingRules) {
    Object.assign(classification, rule.classification);
  }

  const estimateInput = {
    projectType: classification.projectType,
    complexity: classification.complexity,
    contextGrowth: classification.contextGrowth,
    toolUse: classification.toolUse,
    modelClass: classification.modelClass,
    reasoning: classification.reasoning,
    expectedIterations: classification.expectedIterations,
    planLengthWords,
  };

  return {
    classification,
    estimateInput,
    estimate: estimateCredits(estimateInput),
  };
}
