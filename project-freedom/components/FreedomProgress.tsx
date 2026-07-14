type FreedomProgressProps = {
  progress: number;
  netWorth: string;
  amountRemaining: string;
  freedomNumber: string;
  message: string;
};

export default function FreedomProgress({
  progress,
  netWorth,
  amountRemaining,
  freedomNumber,
  message,
}: FreedomProgressProps) {
  const progressBarWidth = Math.min(Math.max(progress, 0), 100);

  return (
    <section className="mt-10 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-slate-400">Freedom Progress</p>

          <p className="mt-1 text-5xl font-bold text-cyan-400">
            {progress}%
          </p>

          <p className="mt-3 text-slate-300">{message}</p>
        </div>

        <div className="md:text-right">
          <p className="text-sm text-slate-400">Freedom Number</p>

          <p className="mt-1 text-2xl font-semibold">
            {freedomNumber}
          </p>
        </div>
      </div>

      <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
          style={{ width: progressBarWidth + "%" }}
        />
      </div>

      <div className="mt-4 flex flex-col justify-between gap-2 text-sm text-slate-400 md:flex-row">
        <span>{netWorth} built</span>
        <span>{amountRemaining} remaining</span>
      </div>
    </section>
  );
}