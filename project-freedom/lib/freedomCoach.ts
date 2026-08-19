import { MonthlyCheckInSnapshot } from "./monthlyCheckIns";

export type CoachGuidance = {
  biggestWin: string;
  biggestOpportunity: string;
  recommendedAction: string;
};

type CoachInput = {
  pension: number;
  investments: number;
  cash: number;
  debts: number;
  investableWealth: number;
  freedomProgress: number;
  annualContribution: number;
  snapshots: MonthlyCheckInSnapshot[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(Math.abs(value));

export function generateFreedomCoach(input: CoachInput): CoachGuidance {
  const ordered = [...input.snapshots].sort((left, right) => right.date.localeCompare(left.date));
  const latest = ordered[0];
  const previous = ordered[1];
  const latestWealth = latest?.investableWealth ?? 0;
  const previousWealth = previous?.investableWealth ?? 0;
  const momentum = latest && previous ? latestWealth - previousWealth : 0;
  const pensionShare = input.investableWealth > 0 ? Math.round((input.pension / input.investableWealth) * 100) : 0;

  const biggestWin = momentum > 0
    ? `Your Investable Wealth increased by ${formatCurrency(momentum)} since your last check-in.`
    : input.freedomProgress >= 50
      ? `You have built ${Math.round(input.freedomProgress)}% of your Freedom Number.`
      : input.pension > 0
        ? `Your pension represents approximately ${pensionShare}% of your Investable Wealth.`
        : "You have started making your financial position visible.";

  const biggestOpportunity = input.debts > 0
    ? `Reducing your ${formatCurrency(input.debts)} of debt would improve your position immediately.`
    : input.annualContribution <= 0
      ? "Adding a regular annual contribution would give your Freedom Date a clearer path."
      : input.investments + input.cash === 0
        ? "Adding another account type could make your financial position more resilient."
        : "Keep reviewing your assumptions as your circumstances change.";

  const recommendedAction = input.debts > 0
    ? "Review your highest-cost debt and choose one repayment amount for this month."
    : input.annualContribution <= 0
      ? "Add an annual contribution in Projection to see how your timeline changes."
      : ordered.length === 0
        ? "Save your first Monthly Check-In so your direction of travel becomes visible."
        : "Keep your figures updated and check in again next month.";

  return { biggestWin, biggestOpportunity, recommendedAction };
}
