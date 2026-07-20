import { useMemo, useState } from "react";
import {
  calculateSnapshotChanges,
  hasSnapshotForToday,
  MonthlyCheckInSnapshot,
  sortSnapshotsByDate,
} from "../lib/monthlyCheckIns";

type MonthlyCheckInProps = {
  pension: number;
  investments: number;
  cash: number;
  debt: number;
  netWorth: number;
  freedomScore: number;
  freedomNumber: number;
  snapshots: MonthlyCheckInSnapshot[];
  onSaveSnapshot: (snapshot: MonthlyCheckInSnapshot) => void;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export default function MonthlyCheckIn({
  pension,
  investments,
  cash,
  debt,
  netWorth,
  freedomScore,
  freedomNumber,
  snapshots,
  onSaveSnapshot,
}: MonthlyCheckInProps) {
  const [isSaved, setIsSaved] = useState(false);

  const sortedSnapshots = useMemo(() => sortSnapshotsByDate(snapshots), [snapshots]);
  const recentSnapshots = sortedSnapshots.slice(0, 5);
  const today = new Date().toISOString().slice(0, 10);
  const alreadySavedToday = hasSnapshotForToday(snapshots, today);

  const latestSnapshot = recentSnapshots[0];
  const previousSnapshot = recentSnapshots[1];
  const changes =
    latestSnapshot && previousSnapshot
      ? calculateSnapshotChanges(latestSnapshot, previousSnapshot)
      : null;

  const handleSave = () => {
    const snapshot: MonthlyCheckInSnapshot = {
      id: `${today}-${Date.now()}`,
      date: today,
      pension,
      investments,
      cash,
      debt,
      netWorth,
      freedomScore,
      freedomNumber,
    };

    onSaveSnapshot(snapshot);
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 1200);
  };

  return (
    <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Monthly Freedom Check-In</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Save your current figures to track progress over time.
          </h3>
          <p className="mt-3 text-sm text-slate-400">
            Monthly check-ins are estimates based on the figures you enter and are intended to help you track direction of travel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          {alreadySavedToday ? "Update Today’s Check-In" : "+ Save Monthly Check-In"}
        </button>
      </div>

      {isSaved ? (
        <p className="mt-4 text-sm text-cyan-300">
          {alreadySavedToday ? "Your check-in has been updated." : "Your check-in has been saved."}
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl bg-slate-800/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-lg font-semibold text-white">Recent check-ins</h4>
          <span className="text-sm text-slate-400">Newest first</span>
        </div>

        {recentSnapshots.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            No snapshots saved yet. Save your first monthly check-in to begin tracking progress.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {recentSnapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{snapshot.date}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Net Worth: {formatCurrency(snapshot.netWorth)}
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm text-slate-400 sm:grid-cols-3">
                    <span>Pension: {formatCurrency(snapshot.pension)}</span>
                    <span>Cash: {formatCurrency(snapshot.cash)}</span>
                    <span>Debt: {formatCurrency(snapshot.debt)}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span>Freedom Score: {snapshot.freedomScore}%</span>
                  <span>Freedom Number: {formatCurrency(snapshot.freedomNumber)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {changes ? (
        <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
          <h4 className="text-lg font-semibold text-white">Change since previous check-in</h4>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-900/70 p-3">
              <p className="text-sm text-slate-400">Net Worth</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {changes.netWorth >= 0 ? "+" : ""}{formatCurrency(changes.netWorth)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-3">
              <p className="text-sm text-slate-400">Pension</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {changes.pension >= 0 ? "+" : ""}{formatCurrency(changes.pension)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-3">
              <p className="text-sm text-slate-400">Cash</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {changes.cash >= 0 ? "+" : ""}{formatCurrency(changes.cash)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-3">
              <p className="text-sm text-slate-400">Debt</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {changes.debt <= 0 ? "+" : ""}{formatCurrency(Math.abs(changes.debt))}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
