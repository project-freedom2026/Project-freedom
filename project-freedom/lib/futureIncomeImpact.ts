import { estimateFreedomDate, FreedomEstimateResult } from "./estimateFreedomDate";

export type FutureIncomeImpact = {
  withoutIncome: FreedomEstimateResult;
  withIncome: FreedomEstimateResult;
  yearsSaved: number | null;
  percentageImprovement: number;
};

type FutureIncomeImpactInput = {
  investableWealth: number;
  annualContribution: number;
  annualReturn: number;
  freedomNumber: number;
  futureIncomeAtYear: (year: number) => number;
};

export function compareFutureIncomeImpact(input: FutureIncomeImpactInput): FutureIncomeImpact {
  const withoutIncome = estimateFreedomDate({
    investableWealth: input.investableWealth,
    annualContribution: input.annualContribution,
    annualReturn: input.annualReturn,
    freedomNumber: input.freedomNumber,
  });
  const withIncome = estimateFreedomDate({ ...input, futureIncomeAtYear: input.futureIncomeAtYear });
  const yearsSaved = withoutIncome.years !== null && withIncome.years !== null ? Math.max(0, withoutIncome.years - withIncome.years) : null;
  const percentageImprovement = withoutIncome.years && withoutIncome.years > 0 && withIncome.years !== null
    ? Math.round(((withoutIncome.years - withIncome.years) / withoutIncome.years) * 100)
    : 0;
  return { withoutIncome, withIncome, yearsSaved, percentageImprovement };
}
