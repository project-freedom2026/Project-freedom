export type FreedomHealthResult = {
  score: number;
  label: "Exceptional" | "Strong" | "Building Momentum" | "Early Stage" | "Starting Out";
};

type FreedomHealthInput = {
  freedomProgress: number;
  debts: number;
  investableWealth: number;
  annualContribution: number;
  annualIncome: number;
  pension: number;
  investments: number;
  cash: number;
  snapshotCount: number;
};

export function calculateFreedomHealth(input: FreedomHealthInput): FreedomHealthResult {
  const progressScore = Math.min(Math.max(input.freedomProgress, 0), 100) * 0.45;
  const debtScore = input.investableWealth > 0 ? Math.max(0, 25 - Math.min(25, (input.debts / input.investableWealth) * 25)) : input.debts === 0 ? 25 : 0;
  const contributionScore = input.annualIncome > 0 ? Math.min(15, Math.max(0, (input.annualContribution / input.annualIncome) * 15)) : 0;
  const totalAssets = input.pension + input.investments + input.cash;
  const diversificationScore = totalAssets > 0 ? Math.min(15, [input.pension, input.investments, input.cash].filter((value) => value > 0).length * 5) : 0;
  const consistencyScore = input.snapshotCount >= 2 ? 5 : 0;
  const score = Math.round(Math.min(100, progressScore + debtScore + contributionScore + diversificationScore + consistencyScore));
  const label = score >= 90 ? "Exceptional" : score >= 75 ? "Strong" : score >= 50 ? "Building Momentum" : score >= 25 ? "Early Stage" : "Starting Out";
  return { score, label };
}
