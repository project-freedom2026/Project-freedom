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
  investableWealth: number;
  freedomDateYears: number | null;
  freedomDateStatus: "already-reached" | "reachable" | "unreachable";
  withdrawalRate: number;
  annualLifestyleGoal: number;
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
  investableWealth,
  freedomDateYears,
  freedomDateStatus,
  withdrawalRate,
  annualLifestyleGoal,
  snapshots,
  onSaveSnapshot,
}: MonthlyCheckInProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [note, setNote] = useState("");

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
  const freedomDateChange = latestSnapshot?.freedomDateYears !== null && latestSnapshot?.freedomDateYears !== undefined && previousSnapshot?.freedomDateYears !== null && previousSnapshot?.freedomDateYears !== undefined
    ? latestSnapshot.freedomDateYears - previousSnapshot.freedomDateYears
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
      investableWealth,
      freedomDateYears,
      freedomDateStatus,
      withdrawalRate,
      annualLifestyleGoal,
      note: note.trim() || undefined,
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

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
        <h4 className="text-lg font-semibold text-white">This check-in will capture</h4>
        <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          <span>Investable Wealth: {formatCurrency(investableWealth)}</span>
          <span>Net Worth: {formatCurrency(netWorth)}</span>
          <span>Freedom Progress: {freedomScore}%</span>
          <span>Freedom Date: {freedomDateStatus === "already-reached" ? "Achieved" : freedomDateYears === null ? "Not reachable" : `${freedomDateYears} years`}</span>
        </div>
        <label className="mt-4 block text-sm text-slate-300" htmlFor="check-in-note">
          Note (optional)
          <textarea id="check-in-note" value={note} maxLength={240} onChange={(event) => setNote(event.target.value)} rows={2} placeholder="What changed this month?" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30" />
          <span className="mt-1 block text-xs text-slate-500">{note.length}/240</span>
        </label>
      </div>

      {isSaved ? (
        <p className="mt-4 text-sm text-cyan-300">
          {alreadySavedToday ? "Your check-in has been updated." : "Your check-in has been saved."}
        </p>
      ) : null}

      <div id="history" className="mt-6 rounded-2xl bg-slate-800/80 p-4">
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
              <p className="text-sm text-slate-400">Investable Wealth</p>
              <p className="mt-1 text-lg font-semibold text-white">{changes.investableWealth >= 0 ? "+" : ""}{formatCurrency(changes.investableWealth)}</p>
            </div>
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
              <p className="text-sm text-slate-400">Investments</p>
              <p className="mt-1 text-lg font-semibold text-white">{changes.investments >= 0 ? "+" : ""}{formatCurrency(changes.investments)}</p>
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
          <p className="mt-4 text-sm text-slate-300">Freedom Progress: {changes.freedomScore >= 0 ? "+" : ""}{changes.freedomScore.toFixed(1)}%</p>
          {freedomDateChange !== null && freedomDateChange !== 0 && <p className="mt-2 text-sm text-slate-400">Your estimated Freedom Date moved approximately {Math.abs(Math.round(freedomDateChange * 12))} months {freedomDateChange < 0 ? "closer" : "later"}.</p>}
        </div>
      ) : null}
    </section>
  );
}
