"use client";

import { useRef, useState } from "react";
import { getStatePensionStartYear } from "../lib/futureIncome";
import { MonthlyCheckInSnapshot } from "../lib/monthlyCheckIns";
import { FinancialModelV2, FutureIncomeStream } from "../types/financial";

type ProductSetupProps = {
  model: FinancialModelV2;
  onChange: (model: FinancialModelV2) => void;
  onReset: () => void;
  snapshots: MonthlyCheckInSnapshot[];
  onImport: (model: FinancialModelV2, snapshots: MonthlyCheckInSnapshot[]) => void;
  isOnboarding?: boolean;
};

const inputClass = "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30";

export default function ProductSetup({ model, onChange, onReset, snapshots, onImport, isOnboarding = false }: ProductSetupProps) {
  const [importMessage, setImportMessage] = useState("");
  const [incomeType, setIncomeType] = useState<FutureIncomeStream["type"]>("defined-benefit");
  const [incomeName, setIncomeName] = useState("");
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [incomeStartYear, setIncomeStartYear] = useState(new Date().getFullYear() + 10);
  const fileRef = useRef<HTMLInputElement>(null);
  const profile = model.profile ?? {};
  const updateProfile = (field: keyof NonNullable<FinancialModelV2["profile"]>, value: string | number | boolean) => onChange({ ...model, profile: { ...profile, [field]: value } });
  const streams = model.futureIncome ?? [];
  const statePension = streams.find((stream) => stream.type === "state-pension");
  const updateStream = (stream: FutureIncomeStream) => onChange({ ...model, futureIncome: streams.some((item) => item.id === stream.id) ? streams.map((item) => item.id === stream.id ? stream : item) : [...streams, stream] });
  const setStatePensionEnabled = (enabled: boolean) => updateStream(statePension ?? { id: "state-pension", type: "state-pension", name: "UK State Pension", annualAmount: 0, startYear: getStatePensionStartYear(profile.dateOfBirth), enabled });
  const addIncomeStream = () => { if (!incomeName.trim() || incomeAmount <= 0) return; updateStream({ id: `${incomeType}-${crypto.randomUUID()}`, type: incomeType, name: incomeName.trim(), annualAmount: incomeAmount, startYear: incomeStartYear, enabled: true }); setIncomeName(""); setIncomeAmount(0); };
  const handleImport = async (file: File) => {
    try {
      const imported = JSON.parse(await file.text()) as Partial<FinancialModelV2> & { model?: Partial<FinancialModelV2>; monthlyCheckIns?: unknown };
      const importedModel = (imported.model ?? imported) as Partial<FinancialModelV2>;
      if (typeof importedModel.schemaVersion !== "number" || !Array.isArray(importedModel.pensions) || !Array.isArray(importedModel.investments) || !Array.isArray(importedModel.cash) || !Array.isArray(importedModel.debts) || !Array.isArray(importedModel.properties) || !Array.isArray(importedModel.others)) throw new Error("This file is not a valid Project Freedom export.");
      const importedSnapshots = Array.isArray(imported.monthlyCheckIns) ? imported.monthlyCheckIns as MonthlyCheckInSnapshot[] : snapshots;
      onImport({ ...model, ...importedModel, schemaVersion: Math.max(model.schemaVersion, importedModel.schemaVersion) }, importedSnapshots);
      setImportMessage("Data imported successfully.");
    } catch {
      setImportMessage("Import failed. Your current data was kept unchanged.");
    }
  };
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ model, monthlyCheckIns: snapshots }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "project-freedom-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  const removeStream = (id: string) => onChange({ ...model, futureIncome: streams.filter((stream) => stream.id !== id) });

  return <section id={isOnboarding ? "onboarding" : "settings"} className={isOnboarding ? "rounded-3xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl md:p-10" : "mt-14 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8"} aria-labelledby={isOnboarding ? "onboarding-heading" : "settings-heading"}>
    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">{isOnboarding ? "Welcome to Project Freedom" : "Settings & profile"}</p>
    <h2 id={isOnboarding ? "onboarding-heading" : "settings-heading"} className="mt-2 text-3xl font-bold">{isOnboarding ? "Build your first Freedom plan" : "Your profile and privacy controls"}</h2>
    <p className="mt-3 max-w-2xl text-slate-400">Project Freedom helps you understand where you are today, what Financial Freedom could look like for you, and how your progress changes over time.</p>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <label className="text-sm text-slate-300" htmlFor="first-name">First name<input id="first-name" value={profile.firstName ?? ""} onChange={(event) => updateProfile("firstName", event.target.value)} className={inputClass} autoComplete="given-name" /></label>
      <label className="text-sm text-slate-300" htmlFor="date-of-birth">Date of birth<input id="date-of-birth" type="date" value={profile.dateOfBirth ?? ""} onChange={(event) => updateProfile("dateOfBirth", event.target.value)} className={inputClass} /></label>
      <label className="text-sm text-slate-300" htmlFor="country">Country / retirement system<input id="country" value={profile.country ?? ""} onChange={(event) => updateProfile("country", event.target.value)} placeholder="United Kingdom" className={inputClass} /></label>
      <label className="text-sm text-slate-300" htmlFor="preferred-currency">Preferred currency<select id="preferred-currency" value={profile.preferredCurrency ?? "GBP"} onChange={(event) => { updateProfile("preferredCurrency", event.target.value); onChange({ ...model, currency: event.target.value, profile: { ...profile, preferredCurrency: event.target.value } }); }} className={inputClass}><option value="GBP">GBP - British pound</option><option value="EUR">EUR - Euro</option><option value="USD">USD - US dollar</option></select></label>
    </div>
    {isOnboarding && <button type="button" onClick={() => document.getElementById("assets")?.scrollIntoView({ behavior: "smooth" })} className="mt-6 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400">Begin adding financial information</button>}
    {!isOnboarding && <>
      <div className="mt-8 border-t border-slate-800 pt-6"><h3 className="text-xl font-semibold">Planning assumptions</h3><div className="mt-4 grid gap-4 md:grid-cols-2"><label className="text-sm text-slate-300" htmlFor="settings-income">Target annual lifestyle income<input id="settings-income" type="number" min="0" value={profile.annualLifestyleGoal ?? 0} onChange={(event) => updateProfile("annualLifestyleGoal", Math.max(0, Number(event.target.value)))} className={inputClass} /></label><label className="text-sm text-slate-300" htmlFor="settings-withdrawal">Withdrawal assumption %<input id="settings-withdrawal" type="number" min="0" step="0.1" value={profile.withdrawalAssumption ?? 4} onChange={(event) => updateProfile("withdrawalAssumption", Math.max(0, Number(event.target.value)))} className={inputClass} /></label></div><details className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 p-4"><summary className="cursor-pointer text-sm font-semibold text-slate-200">Advanced options</summary><label className="mt-4 flex items-start gap-3 text-sm text-slate-300"><input type="checkbox" checked={Boolean(profile.useManualFreedomNumber)} onChange={(event) => updateProfile("useManualFreedomNumber", event.target.checked)} className="mt-1 accent-cyan-400" />Override calculated Freedom Number</label>{profile.useManualFreedomNumber && <label className="mt-4 block text-sm text-slate-300" htmlFor="manual-freedom-number">Manual Freedom Number<input id="manual-freedom-number" type="number" min="0" value={profile.manualFreedomNumber ?? 0} onChange={(event) => updateProfile("manualFreedomNumber", Math.max(0, Number(event.target.value)))} className={inputClass} /><span className="mt-2 block text-xs text-amber-200">This replaces the lifestyle-derived target until you turn the override off.</span></label>}</details><p className="mt-3 text-xs leading-5 text-slate-500">A higher withdrawal percentage generally lowers the required target but may increase depletion risk. A lower assumption requires more capital and is a more conservative planning basis.</p></div>
      <div className="mt-8 border-t border-slate-800 pt-6"><h3 className="text-xl font-semibold">Future retirement income</h3><p className="mt-2 text-sm text-slate-400">Future income reduces the portfolio requirement only after its start year. For the most accurate estimate, use your official State Pension forecast.</p><label className="mt-4 flex items-start gap-3 text-sm text-slate-300"><input type="checkbox" checked={Boolean(statePension?.enabled)} onChange={(event) => setStatePensionEnabled(event.target.checked)} className="mt-1 accent-cyan-400" />Include estimated UK State Pension?</label>{statePension?.enabled && <div className="mt-4 grid gap-4 md:grid-cols-3"><label className="text-sm text-slate-300" htmlFor="state-pension-amount">Expected annual amount<input id="state-pension-amount" type="number" min="0" value={statePension.annualAmount} onChange={(event) => updateStream({ ...statePension, annualAmount: Math.max(0, Number(event.target.value)) })} className={inputClass} /></label><label className="text-sm text-slate-300" htmlFor="state-pension-year">Expected start year<input id="state-pension-year" type="number" min={new Date().getFullYear()} value={statePension.startYear} onChange={(event) => updateStream({ ...statePension, startYear: Math.max(new Date().getFullYear(), Number(event.target.value)) })} className={inputClass} /></label><label className="text-sm text-slate-300" htmlFor="state-pension-note">Note (optional)<input id="state-pension-note" value={statePension.notes ?? ""} onChange={(event) => updateStream({ ...statePension, notes: event.target.value.slice(0, 240) })} className={inputClass} /></label></div>}<div className="mt-5 grid gap-3 md:grid-cols-4"><label className="text-sm text-slate-300" htmlFor="income-type">Income type<select id="income-type" value={incomeType} onChange={(event) => setIncomeType(event.target.value as FutureIncomeStream["type"])} className={inputClass}><option value="defined-benefit">Defined-benefit pension</option><option value="annuity">Annuity</option><option value="rental">Rental income</option><option value="other">Other recurring income</option></select></label><label className="text-sm text-slate-300" htmlFor="income-name">Name<input id="income-name" value={incomeName} onChange={(event) => setIncomeName(event.target.value)} className={inputClass} /></label><label className="text-sm text-slate-300" htmlFor="income-amount">Annual amount<input id="income-amount" type="number" min="0" value={incomeAmount} onChange={(event) => setIncomeAmount(Math.max(0, Number(event.target.value)))} className={inputClass} /></label><label className="text-sm text-slate-300" htmlFor="income-start-year">Start year<input id="income-start-year" type="number" min={new Date().getFullYear()} value={incomeStartYear} onChange={(event) => setIncomeStartYear(Math.max(new Date().getFullYear(), Number(event.target.value)))} className={inputClass} /></label></div><button type="button" onClick={addIncomeStream} className="mt-3 rounded-xl border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400">Add future income</button>{streams.filter((stream) => stream.type !== "state-pension").map((stream) => <div key={stream.id} className="mt-2 flex items-center justify-between gap-3 text-sm text-slate-400"><span>{stream.name}: £{stream.annualAmount.toLocaleString()} from {stream.startYear}</span><button type="button" onClick={() => removeStream(stream.id)} className="text-rose-300 underline focus:outline-none focus:ring-2 focus:ring-rose-400">Remove</button></div>)}<p className="mt-3 text-xs text-slate-500">Income is not counted before its start year, and does not change today&apos;s Investable Wealth.</p></div>
      <div className="mt-8 border-t border-slate-800 pt-6"><h3 className="text-xl font-semibold">Local data</h3><p className="mt-2 text-sm text-slate-400">Your Project Freedom data is currently stored locally in this browser.</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={exportData} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-200 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400">Export data</button><button type="button" onClick={() => fileRef.current?.click()} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-200 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400">Import data</button><button type="button" onClick={onReset} className="rounded-xl border border-rose-500/40 px-4 py-2.5 text-sm text-rose-300 hover:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400">Reset data</button><input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImport(file); }} /></div>{importMessage && <p className="mt-3 text-sm text-cyan-300" role="status">{importMessage}</p>}</div>
    </>}
  </section>;
}
