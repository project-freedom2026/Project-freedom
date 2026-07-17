import { FinancialInsight, FinancialInsightTone } from "../lib/generateFinancialInsights";

type InsightsPanelProps = {
  insights: FinancialInsight[];
};

const toneStyles: Record<FinancialInsightTone, string> = {
  positive: "border-cyan-500/30 bg-cyan-500/10 text-cyan-100",
  neutral: "border-slate-700 bg-slate-900/80 text-slate-200",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-100",
};

const toneLabel: Record<FinancialInsightTone, string> = {
  positive: "Positive",
  neutral: "Neutral",
  warning: "Warning",
};

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 md:p-8" aria-labelledby="insights-heading">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Financial insights</p>
          <h3 id="insights-heading" className="mt-2 text-2xl font-semibold text-white">
            Your Next Moves
          </h3>
          <p className="mt-3 text-sm text-slate-400">
            A practical view of the next steps your numbers suggest, based on the current assumptions.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {insights.map((insight) => (
          <article
            key={insight.id}
            className={`rounded-2xl border p-4 ${toneStyles[insight.tone]}`}
            aria-label={`${toneLabel[insight.tone]} insight: ${insight.title}`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
                {toneLabel[insight.tone]}
              </p>
            </div>
            <h4 className="mt-3 text-lg font-semibold text-white">{insight.title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-200">{insight.message}</p>
          </article>
        ))}
      </div>

      <p className="mt-6 text-xs leading-5 text-slate-500">
        These insights are educational estimates, not personal financial advice.
      </p>
    </section>
  );
}
