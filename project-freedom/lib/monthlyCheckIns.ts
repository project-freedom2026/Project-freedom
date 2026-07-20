export type MonthlyCheckInSnapshot = {
  id: string;
  date: string;
  pension: number;
  investments: number;
  cash: number;
  debt: number;
  netWorth: number;
  freedomScore: number;
  freedomNumber: number;
};

export type SnapshotChangeSummary = {
  netWorth: number;
  pension: number;
  cash: number;
  debt: number;
};

const sanitizeNumber = (value: number | null | undefined): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return value;
};

export function sortSnapshotsByDate(
  snapshots: MonthlyCheckInSnapshot[],
): MonthlyCheckInSnapshot[] {
  return [...snapshots].sort((left, right) => {
    if (left.date === right.date) {
      return left.id.localeCompare(right.id);
    }

    return right.date.localeCompare(left.date);
  });
}

export function hasSnapshotForToday(
  snapshots: MonthlyCheckInSnapshot[],
  date: string,
): boolean {
  return snapshots.some((snapshot) => snapshot.date === date);
}

export function calculateSnapshotChanges(
  latest: MonthlyCheckInSnapshot,
  previous: MonthlyCheckInSnapshot,
): SnapshotChangeSummary {
  return {
    netWorth: sanitizeNumber(latest.netWorth) - sanitizeNumber(previous.netWorth),
    pension: sanitizeNumber(latest.pension) - sanitizeNumber(previous.pension),
    cash: sanitizeNumber(latest.cash) - sanitizeNumber(previous.cash),
    debt: sanitizeNumber(latest.debt) - sanitizeNumber(previous.debt),
  };
}
