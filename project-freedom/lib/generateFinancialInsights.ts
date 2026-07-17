export type FinancialInsightTone = "positive" | "neutral" | "warning";

export type FinancialInsight = {
  id: string;
  title: string;
  message: string;
  tone: FinancialInsightTone;
  priority: number;
};

export type FinancialInsightInput = {
  pension: number | null | undefined;
  investments: number | null | undefined;
  property: number | null | undefined;
  cash: number | null | undefined;
  debts: number | null | undefined;
  annualContribution: number | null | undefined;
  annualReturn: number | null | undefined;
  freedomNumber: number | null | undefined;
  investableWealth: number | null | undefined;
  netWorth: number | null | undefined;
  freedomProgress: number | null | undefined;
  estimatedFreedomYears?: number | null;
  estimatedFreedomStatus?: "already-reached" | "reachable" | "unreachable" | null;
};

const sanitizeNumber = (value: number | null | undefined): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function generateFinancialInsights(
  input: FinancialInsightInput,
): FinancialInsight[] {
  const pension = sanitizeNumber(input.pension);
  const investments = sanitizeNumber(input.investments);
  const property = sanitizeNumber(input.property);
  const cash = sanitizeNumber(input.cash);
  const debts = sanitizeNumber(input.debts);
  const annualContribution = sanitizeNumber(input.annualContribution);
  const netWorth = sanitizeNumber(input.netWorth);
  const freedomProgress = sanitizeNumber(input.freedomProgress);
  const estimatedFreedomYears = input.estimatedFreedomYears ?? null;
  const estimatedFreedomStatus = input.estimatedFreedomStatus ?? null;

  const insights: FinancialInsight[] = [];

  if (freedomProgress >= 100) {
    insights.push({
      id: "milestone-complete",
      title: "Freedom milestone reached",
      message:
        "You have reached your Freedom Number. That is a meaningful milestone, and it is worth recognising the progress you have already made.",
      tone: "positive",
      priority: 1,
    });
  } else if (freedomProgress >= 75) {
    insights.push({
      id: "milestone-75",
      title: "You are close to the finish line",
      message:
        "Your balance is already above 75% of your target. Keep building steadily and the remaining gap should feel more manageable.",
      tone: "positive",
      priority: 2,
    });
  } else if (freedomProgress >= 50) {
    insights.push({
      id: "milestone-50",
      title: "Halfway to your target",
      message:
        "You have reached the halfway mark. That is strong momentum, and it shows the plan is working.",
      tone: "positive",
      priority: 2,
    });
  } else if (freedomProgress >= 25) {
    insights.push({
      id: "milestone-25",
      title: "Momentum is building",
      message:
        "You are already a quarter of the way to your target. Small consistent actions can make a noticeable difference over time.",
      tone: "positive",
      priority: 2,
    });
  } else {
    insights.push({
      id: "milestone-start",
      title: "Every step counts",
      message:
        "You are still building your foundation. Steady contributions and careful habits can add up over time.",
      tone: "neutral",
      priority: 2,
    });
  }

  if (annualContribution <= 0) {
    insights.push({
      id: "annual-contribution-zero",
      title: "Add an annual contribution",
      message:
        "Your annual contribution is currently zero. Even a modest regular amount can help your balance grow faster and reduce the time needed to reach freedom.",
      tone: "neutral",
      priority: 3,
    });
  } else {
    insights.push({
      id: "annual-contribution-impact",
      title: "Contributions can change the timeline",
      message:
        `With an annual contribution of ${formatCurrency(annualContribution)}, you are giving your progress a stronger boost than leaving the balance untouched. Increasing that amount can shorten the estimated timeline, depending on returns and other assumptions.`,
      tone: "neutral",
      priority: 3,
    });
  }

  if (debts > cash) {
    insights.push({
      id: "debt-vs-cash",
      title: "Debt is higher than cash",
      message:
        "Debts are currently larger than your cash balance. Keeping some cash available and reducing high-interest debt can ease pressure while you continue building wealth.",
      tone: "warning",
      priority: 4,
    });
  }

  const propertyShareOfNetWorth = netWorth > 0 ? (property / netWorth) * 100 : 0;
  if (property > 0 && propertyShareOfNetWorth >= 25) {
    insights.push({
      id: "property-weight",
      title: "Property is a large part of your picture",
      message:
        `Property makes up about ${Math.round(propertyShareOfNetWorth)}% of your net worth. It is included in your overall balance, but it is excluded from investable wealth, so the two measures can look different.`,
      tone: "neutral",
      priority: 5,
    });
  }

  if (estimatedFreedomStatus === "unreachable") {
    insights.push({
      id: "freedom-unreachable",
      title: "The target is not reachable under these assumptions",
      message:
        "Your current assumptions do not reach the Freedom Number within 100 years. A higher contribution, lower debt, or a different growth assumption would change the estimate.",
      tone: "warning",
      priority: 6,
    });
  } else if (estimatedFreedomStatus === "already-reached") {
    insights.push({
      id: "freedom-already-reached",
      title: "Your current plan already clears the target",
      message:
        "You are already at or above your Freedom Number based on the current inputs. That is a strong position to build from.",
      tone: "positive",
      priority: 6,
    });
  } else if (estimatedFreedomYears !== null) {
    insights.push({
      id: "freedom-timeline",
      title: "Your estimate is moving forward",
      message:
        `The current assumptions suggest a timeline of about ${estimatedFreedomYears} years. Small changes to contributions or returns can have a noticeable effect on that estimate.`,
      tone: "neutral",
      priority: 6,
    });
  }

  if (pension === 0 && investments === 0 && property === 0 && cash === 0) {
    insights.push({
      id: "empty-start",
      title: "Start with the basics",
      message:
        "Your figures are still empty. Entering your current balances gives the dashboard a clearer picture and makes the insights more useful.",
      tone: "neutral",
      priority: 7,
    });
  }

  return insights
    .sort((left, right) => left.priority - right.priority)
    .slice(0, 5);
}
