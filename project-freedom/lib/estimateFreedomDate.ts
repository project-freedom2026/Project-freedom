export type FreedomEstimateStatus =
  | "already-reached"
  | "reachable"
  | "unreachable";

export type FreedomEstimateResult = {
  status: FreedomEstimateStatus;
  years: number | null;
  projectedBalance: number;
};

const sanitizeNumber = (value: number | null | undefined): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
};

export function estimateFreedomDate({
  investableWealth,
  annualContribution,
  annualReturn,
  freedomNumber,
}: {
  investableWealth: number;
  annualContribution: number;
  annualReturn: number;
  freedomNumber: number;
}): FreedomEstimateResult {
  const safeInvestableWealth = sanitizeNumber(investableWealth);
  const safeAnnualContribution = sanitizeNumber(annualContribution);
  const safeAnnualReturn = sanitizeNumber(annualReturn);
  const safeFreedomNumber = sanitizeNumber(freedomNumber);

  if (safeFreedomNumber <= 0) {
    return {
      status: "already-reached",
      years: 0,
      projectedBalance: safeInvestableWealth,
    };
  }

  if (safeInvestableWealth >= safeFreedomNumber) {
    return {
      status: "already-reached",
      years: 0,
      projectedBalance: safeInvestableWealth,
    };
  }

  let balance = safeInvestableWealth;

  for (let years = 0; years <= 100; years += 1) {
    if (balance >= safeFreedomNumber) {
      return {
        status: "reachable",
        years,
        projectedBalance: balance,
      };
    }

    if (years === 100) {
      break;
    }

    balance *= 1 + safeAnnualReturn / 100;
    balance += safeAnnualContribution;
  }

  return {
    status: "unreachable",
    years: null,
    projectedBalance: balance,
  };
}
