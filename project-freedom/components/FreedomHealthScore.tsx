import { FreedomHealthResult } from "../lib/freedomHealth";

type FreedomHealthScoreProps = { result: FreedomHealthResult };

export default function FreedomHealthScore({ result }: FreedomHealthScoreProps) {
  return <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5" aria-labelledby="health-heading"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-slate-400">Freedom Health</p><h2 id="health-heading" className="mt-1 text-xl font-semibold">{result.label}</h2></div><div className="text-right"><p className="text-3xl font-bold text-cyan-300">{result.score}</p><p className="text-xs text-slate-500">out of 100</p></div></div><div className="mt-4 h-2 rounded-full bg-slate-800" role="progressbar" aria-label="Freedom Health Score" aria-valuemin={0} aria-valuemax={100} aria-valuenow={result.score}><div className="h-2 rounded-full bg-cyan-400" style={{ width: `${result.score}%` }} /></div><p className="mt-3 text-xs leading-5 text-slate-500">A supplementary view of progress, debt, contributions, diversification and check-in consistency. It does not replace Freedom Progress.</p></section>;
}
