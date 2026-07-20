type FreedomLifestylePlannerProps = {
  annualIncome: number;
  withdrawalRate: number;
  calculatedFreedomNumber: number;
  onAnnualIncomeChange: (value: number) => void;
  onWithdrawalRateChange: (value: number) => void;
};

const withdrawalRateOptions = [3, 3.5, 4, 4.5, 5];

export default function FreedomLifestylePlanner({
  annualIncome,
  withdrawalRate,
  calculatedFreedomNumber,
  onAnnualIncomeChange,
  onWithdrawalRateChange,
}: FreedomLifestylePlannerProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Freedom lifestyle planner</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Design the retirement lifestyle you want
          </h3>
          <p className="mt-3 text-sm text-slate-400">
            Set your target annual income and withdrawal rate to calculate your Freedom Number automatically.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl bg-slate-800/80 p-5">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium text-slate-300" htmlFor="annual-income">
              Annual lifestyle income
            </label>
            <span className="text-lg font-semibold text-cyan-400">
              {formatCurrency(annualIncome)}
            </span>
          </div>

          <input
            id="annual-income"
            type="range"
            min="10000"
            max="100000"
            step="1000"
            value={annualIncome}
            onChange={(event) => onAnnualIncomeChange(Number(event.target.value))}
            className="mt-4 w-full accent-cyan-400"
          />

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>£10,000</span>
            <span>£100,000</span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-800/80 p-5">
          <label className="text-sm font-medium text-slate-300" htmlFor="withdrawal-rate">
            Withdrawal rate
          </label>

          <select
            id="withdrawal-rate"
            value={withdrawalRate}
            onChange={(event) => onWithdrawalRateChange(Number(event.target.value))}
            className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
          >
            {withdrawalRateOptions.map((option) => (
              <option key={option} value={option}>
                {option}%
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-800/70 p-4">
          <p className="text-sm text-slate-400">Annual lifestyle goal</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {formatCurrency(annualIncome)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-800/70 p-4">
          <p className="text-sm text-slate-400">Withdrawal rate</p>
          <p className="mt-2 text-xl font-semibold text-cyan-400">
            {withdrawalRate}%
          </p>
        </div>

        <div className="rounded-2xl bg-slate-800/70 p-4">
          <p className="text-sm text-slate-400">Calculated Freedom Number</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {formatCurrency(calculatedFreedomNumber)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Withdrawal rates are planning assumptions and are not guaranteed. Actual retirement outcomes depend on investment performance, inflation, taxes and spending.
      </p>
    </section>
  );
}
