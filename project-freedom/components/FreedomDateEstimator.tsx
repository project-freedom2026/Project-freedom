import { estimateFreedomDate } from "../lib/estimateFreedomDate";
import { isFreedomAchieved } from "../lib/isFreedomAchieved";
import CalculationExplanation from "./CalculationExplanation";

type FreedomDateEstimatorProps = {
  investableWealth: number;
  annualContribution: number;
  annualReturn: number;
  freedomNumber: number;
  futureIncomeAtYear?: (year: number) => number;
  onAnnualContributionChange: (value: number) => void;
};

export default function FreedomDateEstimator({
  investableWealth,
  annualContribution,
  annualReturn,
  freedomNumber,
  futureIncomeAtYear,
  onAnnualContributionChange,
}: FreedomDateEstimatorProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  const achievementReached = isFreedomAchieved({
    investableWealth,
    freedomNumber,
  });

  const estimate = estimateFreedomDate({
    investableWealth,
    annualContribution,
    annualReturn,
    freedomNumber,
    futureIncomeAtYear,
  });

  const currentYear = new Date().getFullYear();
  const estimatedYear =
    estimate.status === "reachable" && estimate.years !== null
      ? currentYear + estimate.years
      : null;

  const getMessage = () => {
    if (achievementReached) {
      return "🎉 Financial Freedom Achieved";
    }

    if (estimate.status === "reachable" && estimate.years !== null) {
      return `Approximately ${estimate.years} years`;
    }

    return "This target is not reachable within 100 years under the current assumptions.";
  };

  const getSubtitle = () => {
    if (achievementReached) {
      return "Freedom achieved today.";
    }

    if (estimate.status === "reachable" && estimatedYear !== null) {
      return `Estimated around ${estimatedYear}`;
    }

    if (estimate.status === "unreachable") {
      return "Your current assumptions do not reach the target within 100 years.";
    }

    return "You are already at or above your Freedom Number.";
  };

  return (
    <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Freedom Date Estimator</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {getMessage()}
          </h3>
          <p className="mt-3 text-sm text-slate-400">
            {getSubtitle()}
          </p>
        </div>

        {!achievementReached && (
          <div className="rounded-2xl bg-slate-800/80 px-4 py-3">
            <label className="text-sm font-medium text-slate-300" htmlFor="annual-contribution">
              Annual contribution
            </label>
            <div className="mt-3 flex items-center rounded-xl bg-slate-900 px-4">
              <span className="text-slate-400">£</span>
              <input
                id="annual-contribution"
                type="number"
                min="0"
                value={annualContribution}
                onChange={(event) =>
                  onAnnualContributionChange(Number(event.target.value))
                }
                className="w-full bg-transparent px-2 py-3 text-lg font-semibold text-white outline-none"
                aria-label="Annual contribution"
              />
            </div>
          </div>
        )}
      </div>

      {achievementReached && (
        <div className="mt-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-6">
          <h4 className="text-2xl font-semibold text-emerald-300">You&apos;ve built the freedom.</h4>
          <p className="mt-2 text-emerald-100">Freedom achieved today. Now you choose what&apos;s next.</p>
          <div className="mt-4 grid gap-3 text-sm text-emerald-100 sm:grid-cols-3"><span>0 years remaining</span><span>Current: {formatCurrency(investableWealth)}</span><span>Target: {formatCurrency(freedomNumber)}</span></div>
          <p className="mt-3 text-sm text-emerald-200">
            Project Freedom was built to help you reach this moment. Congratulations.
          </p>
        </div>
      )}

      {!achievementReached && (
        <div className="mt-6 rounded-2xl bg-slate-800/70 p-4 text-sm text-slate-300">
          <p>
            Based on your current investable wealth, annual contribution, expected return, and Freedom Number.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            This is an estimate, not a guarantee of future investment performance.
          </p>
          <CalculationExplanation
            formula="Estimates based on: Investable Wealth + (Annual Contributions × Years) + Investment Returns = Freedom Number"
            description="Freedom Date estimates are based on your investable wealth, annual contributions, expected investment return, and Freedom Number."
          />
        </div>
      )}

      {achievementReached && (
        <div className="mt-6 rounded-2xl bg-slate-800/70 p-4 text-xs text-slate-400">
          <p>
            0 years remaining.
          </p>
          <p className="mt-2">
            Adjust your lifestyle assumptions in the Lifestyle Planner if you would like to model different scenarios.
          </p>
        </div>
      )}
    </section>
  );
}
