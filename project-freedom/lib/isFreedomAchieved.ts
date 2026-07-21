const sanitizeNumber = (value: number | null | undefined): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
};

export function isFreedomAchieved({
  investableWealth,
  freedomNumber,
}: {
  investableWealth: number;
  freedomNumber: number;
}): boolean {
  const safeInvestableWealth = sanitizeNumber(investableWealth);
  const safeFreedomNumber = sanitizeNumber(freedomNumber);

  if (safeFreedomNumber <= 0) {
    return false;
  }

  return safeInvestableWealth >= safeFreedomNumber;
}
