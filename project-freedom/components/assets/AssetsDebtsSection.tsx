"use client";

import { useState } from "react";
import DeleteItemConfirmation from "./DeleteItemConfirmation";
import FinancialItemEditor, { FinancialItem, ItemKind } from "./FinancialItemEditor";
import { FinancialModelV2 } from "../../types/financial";

type AssetsDebtsSectionProps = { model: FinancialModelV2; onChange: (model: FinancialModelV2) => void; formatCurrency: (value: number) => string };

const groups: { key: keyof Pick<FinancialModelV2, "pensions" | "investments" | "cash" | "properties" | "debts" | "others">; kind: ItemKind; title: string; empty: string }[] = [
  { key: "pensions", kind: "pension", title: "Pensions", empty: "No pensions added yet. Add your first pension to include it in your Investable Wealth." },
  { key: "investments", kind: "investment", title: "Investments", empty: "No investments added yet. Add an account to track your invested wealth." },
  { key: "cash", kind: "cash", title: "Cash and savings", empty: "No cash accounts added yet. Add your savings to complete your picture." },
  { key: "properties", kind: "property", title: "Properties", empty: "No properties added yet. Add your home or an investment property to complete your Net Worth picture." },
  { key: "debts", kind: "debt", title: "Debts", empty: "No debts recorded." },
  { key: "others", kind: "other", title: "Other assets", empty: "No other assets added yet." },
];

export default function AssetsDebtsSection({ model, onChange, formatCurrency }: AssetsDebtsSectionProps) {
  const [editing, setEditing] = useState<{ kind: ItemKind; id?: string } | null>(null);
  const [confirming, setConfirming] = useState<{ groupKey: typeof groups[number]["key"]; item: FinancialItem } | null>(null);
  const [feedback, setFeedback] = useState("");

  const saveItem = (item: FinancialItem) => {
    const group = groups.find((entry) => entry.kind === item.type);
    if (!group) return;
    const current = model[group.key] as FinancialItem[];
    const exists = current.some((entry) => entry.id === item.id);
    onChange({ ...model, [group.key]: exists ? current.map((entry) => entry.id === item.id ? item : entry) : [...current, item] });
    setEditing(null);
    setFeedback(`${item.name} saved.`);
  };

  const deleteItem = () => {
    if (!confirming) return;
    const { groupKey, item } = confirming;
    onChange({ ...model, [groupKey]: (model[groupKey] as FinancialItem[]).filter((entry) => entry.id !== item.id) });
    setConfirming(null);
    setFeedback(`${item.name} removed.`);
  };

  return <section id="assets" className="mt-14" aria-labelledby="assets-heading"><div className="mb-6"><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Detailed editing</p><h2 id="assets-heading" className="mt-2 text-3xl font-bold">Assets &amp; Debts</h2><p className="mt-2 max-w-3xl text-slate-400">Manage each account separately. Your home contributes to Net Worth, but its equity stays out of Investable Wealth unless you explicitly model selling or downsizing.</p></div>{feedback && <p className="mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100" role="status">{feedback}</p>}<div className="grid gap-5 lg:grid-cols-2">{groups.map((group) => { const items = model[group.key] as FinancialItem[]; const total = items.reduce((sum, item) => sum + (item.type === "debt" ? -(item.outstanding ?? item.value) : item.type === "property" ? Math.max(0, item.value - (item.outstandingMortgage ?? 0)) : item.value), 0); return <article key={group.key} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-semibold">{group.title}</h3><p className="mt-1 text-sm text-slate-400">{items.length} {items.length === 1 ? "item" : "items"} · {formatCurrency(total)}</p></div><button type="button" onClick={() => setEditing({ kind: group.kind })} className="rounded-xl bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400">+ Add</button></div>{items.length === 0 && <div className="mt-5 rounded-xl border border-dashed border-slate-700 px-4 py-5 text-sm text-slate-400"><p>{group.empty}</p><button type="button" onClick={() => setEditing({ kind: group.kind })} className="mt-3 font-semibold text-cyan-300 underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-cyan-400">Add {group.title.toLowerCase()}</button></div>}{items.map((item) => <div key={item.id} className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium text-white">{item.name}</p><p className="mt-1 text-sm text-slate-400">{formatCurrency(item.type === "debt" ? item.outstanding ?? item.value : item.type === "property" ? Math.max(0, item.value - (item.outstandingMortgage ?? 0)) : item.value)}</p></div><div className="flex gap-2"><button type="button" onClick={() => setEditing({ kind: item.type, id: item.id })} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400">Edit</button><button type="button" onClick={() => setConfirming({ groupKey: group.key, item })} className="rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs text-rose-300 hover:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400">Delete</button></div></div>{confirming?.item.id === item.id && <DeleteItemConfirmation itemName={item.name} onConfirm={deleteItem} onCancel={() => setConfirming(null)} />}{editing?.id === item.id && <FinancialItemEditor kind={item.type} item={item} onSave={saveItem} onCancel={() => setEditing(null)} />}</div>)}{editing?.kind === group.kind && !editing.id && <FinancialItemEditor kind={group.kind} onSave={saveItem} onCancel={() => setEditing(null)} />}</article>; })}</div></section>;
}