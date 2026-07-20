const sanitizeNumber = (value: number | null | undefined): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
};

export function calculateFreedomNumber({
  annualIncome,
  withdrawalRate,
}: {
  annualIncome: number;
  withdrawalRate: number;
}): number {
  const safeAnnualIncome = sanitizeNumber(annualIncome);
  const safeWithdrawalRate = sanitizeNumber(withdrawalRate);

  if (safeAnnualIncome <= 0 || safeWithdrawalRate <= 0) {
    return 0;
  }

  return Math.round(safeAnnualIncome / (safeWithdrawalRate / 100));
}
