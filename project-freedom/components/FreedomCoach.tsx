import { CoachGuidance } from "../lib/freedomCoach";

type FreedomCoachProps = { guidance: CoachGuidance };

export default function FreedomCoach({ guidance }: FreedomCoachProps) {
  return (
    <section className="mt-6 rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 md:p-8" aria-labelledby="coach-heading">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Freedom Coach</p><h2 id="coach-heading" className="mt-2 text-2xl font-bold">Your clearest next move</h2></div><p className="text-sm text-slate-400">Personalised from your current figures</p></div>
      <div className="mt-6 grid gap-4 md:grid-cols-3"><article className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"><p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Biggest Win</p><p className="mt-3 text-sm leading-6 text-slate-200">{guidance.biggestWin}</p></article><article className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4"><p className="text-xs uppercase tracking-[0.16em] text-amber-200">Biggest Opportunity</p><p className="mt-3 text-sm leading-6 text-slate-200">{guidance.biggestOpportunity}</p></article><article className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4"><p className="text-xs uppercase tracking-[0.16em] text-cyan-200">Recommended Next Action</p><p className="mt-3 text-sm leading-6 text-slate-100">{guidance.recommendedAction}</p></article></div>
    </section>
  );
}
