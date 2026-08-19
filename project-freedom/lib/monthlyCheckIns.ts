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
  investableWealth?: number;
  freedomDateYears?: number | null;
  freedomDateStatus?: "already-reached" | "reachable" | "unreachable";
  withdrawalRate?: number;
  annualLifestyleGoal?: number;
  note?: string;
};

export type SnapshotChangeSummary = {
  netWorth: number;
  pension: number;
  investments: number;
  cash: number;
  debt: number;
  investableWealth: number;
  freedomScore: number;
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
    investments: sanitizeNumber(latest.investments) - sanitizeNumber(previous.investments),
    cash: sanitizeNumber(latest.cash) - sanitizeNumber(previous.cash),
    debt: sanitizeNumber(latest.debt) - sanitizeNumber(previous.debt),
    investableWealth:
      sanitizeNumber(latest.investableWealth ?? latest.pension + latest.investments + latest.cash - latest.debt) -
      sanitizeNumber(previous.investableWealth ?? previous.pension + previous.investments + previous.cash - previous.debt),
    freedomScore: sanitizeNumber(latest.freedomScore) - sanitizeNumber(previous.freedomScore),
  };
}

export function normalizeSnapshot(snapshot: MonthlyCheckInSnapshot): MonthlyCheckInSnapshot {
  return {
    ...snapshot,
    investments: sanitizeNumber(snapshot.investments),
    investableWealth: sanitizeNumber(snapshot.investableWealth ?? snapshot.pension + (snapshot.investments ?? 0) + snapshot.cash - snapshot.debt),
    freedomDateYears: snapshot.freedomDateYears === null ? null : sanitizeNumber(snapshot.freedomDateYears),
    note: typeof snapshot.note === "string" ? snapshot.note.slice(0, 240) : undefined,
  };
}

export function getSnapshotMilestones(snapshots: MonthlyCheckInSnapshot[]): string[] {
  const ordered = [...snapshots].sort((left, right) => left.date.localeCompare(right.date));
  if (ordered.length === 0) return [];

  const milestones = ["Milestone reached — First Monthly Check-In."];
  const latest = ordered[ordered.length - 1];
  const thresholds = [25, 50, 75];
  thresholds.forEach((threshold) => {
    if (ordered.some((snapshot) => snapshot.freedomScore >= threshold)) {
      milestones.push(`Milestone reached — ${threshold}% of your Freedom Number.`);
    }
  });
  if (ordered.some((snapshot) => snapshot.freedomScore >= 100 || snapshot.freedomDateStatus === "already-reached")) {
    milestones.push("Milestone reached — Financial Freedom achieved.");
  }
  if (latest.debt === 0) milestones.push("Milestone reached — Debt reached £0.");
  return milestones;
}
