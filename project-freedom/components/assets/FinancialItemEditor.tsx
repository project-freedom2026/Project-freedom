"use client";

import { useState } from "react";
import {
  CashAccountItem,
  DebtItem,
  InvestmentItem,
  OtherAssetItem,
  PensionItem,
  PropertyItem,
} from "../../types/financial";

export type FinancialItem = PensionItem | InvestmentItem | CashAccountItem | PropertyItem | DebtItem | OtherAssetItem;
export type ItemKind = FinancialItem["type"];

type FinancialItemEditorProps = {
  kind: ItemKind;
  item?: FinancialItem;
  onSave: (item: FinancialItem) => void;
  onCancel: () => void;
};

const labels: Record<ItemKind, string> = {
  pension: "Pension",
  investment: "Investment",
  cash: "Cash and savings",
  property: "Property",
  debt: "Debt",
  other: "Other asset",
};

const numberValue = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

export default function FinancialItemEditor({ kind, item, onSave, onCancel }: FinancialItemEditorProps) {
  const [name, setName] = useState(item?.name ?? "");
  const [value, setValue] = useState(String(item?.value ?? ""));
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [specific, setSpecific] = useState<Record<string, string | boolean>>({
    pensionType: item && item.type === "pension" ? item.pensionType ?? "" : "",
    employerName: item && item.type === "pension" ? item.employerName ?? "" : "",
    accountType: item && (item.type === "investment" || item.type === "cash") ? item.accountType ?? "" : "",
    provider: item && (item.type === "investment" || item.type === "cash") ? item.provider ?? "" : "",
    propertyType: item && item.type === "property" ? item.propertyType ?? "" : "",
    outstandingMortgage: item && item.type === "property" ? String(item.outstandingMortgage ?? "") : "",
    monthlyRentalIncome: item && item.type === "property" ? String(item.monthlyRentalIncome ?? "") : "",
    monthlyCosts: item && item.type === "property" ? String(item.monthlyCosts ?? "") : "",
    isPrimaryResidence: item && item.type === "property" ? item.isPrimaryResidence ?? false : false,
    includeInInvestableWealth: item && item.type === "property" ? item.includeInInvestableWealth ?? false : false,
    debtType: item && item.type === "debt" ? item.debtType ?? "" : "",
    interestRate: item && item.type === "debt" ? String(item.interestRate ?? "") : "",
    monthlyPayment: item && item.type === "debt" ? String(item.monthlyPayment ?? "") : "",
  });

  const updateSpecific = (key: string, nextValue: string | boolean) => {
    setSpecific((current) => ({ ...current, [key]: nextValue }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || numberValue(value) <= 0) return;

    const base = { id: item?.id ?? `${kind}-${crypto.randomUUID()}`, name: name.trim(), value: numberValue(value), notes: notes.trim() || undefined, type: kind };
    let nextItem: FinancialItem = base as FinancialItem;

    if (kind === "pension") nextItem = { ...base, type: kind, pensionType: String(specific.pensionType || "") || undefined, employerName: String(specific.employerName || "") || undefined } as PensionItem;
    if (kind === "investment") nextItem = { ...base, type: kind, accountType: String(specific.accountType || "") || undefined, provider: String(specific.provider || "") || undefined } as InvestmentItem;
    if (kind === "cash") nextItem = { ...base, type: kind, accountType: String(specific.accountType || "") || undefined, provider: String(specific.provider || "") || undefined } as CashAccountItem;
    if (kind === "other") nextItem = { ...base, type: kind } as OtherAssetItem;
    if (kind === "debt") nextItem = { ...base, type: kind, outstanding: numberValue(value), debtType: String(specific.debtType || "") || undefined, interestRate: numberValue(String(specific.interestRate || "")), monthlyPayment: numberValue(String(specific.monthlyPayment || "")) } as DebtItem;
    if (kind === "property") nextItem = { ...base, type: kind, propertyType: String(specific.propertyType || "") || undefined, outstandingMortgage: numberValue(String(specific.outstandingMortgage || "")), monthlyRentalIncome: numberValue(String(specific.monthlyRentalIncome || "")), monthlyCosts: numberValue(String(specific.monthlyCosts || "")), isPrimaryResidence: Boolean(specific.isPrimaryResidence), includeInInvestableWealth: Boolean(specific.includeInInvestableWealth) } as PropertyItem;

    onSave(nextItem);
  };

  const textField = (id: string, label: string, currentValue: string, onChange: (value: string) => void, type = "text") => (
    <label className="block text-sm text-slate-300" htmlFor={id}>
      {label}
      <input id={id} type={type} value={currentValue} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30" required={id === "item-name" || id === "item-value"} min={type === "number" ? 0 : undefined} />
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-2xl border border-cyan-500/30 bg-slate-950/70 p-4" aria-label={`${item ? "Edit" : "Add"} ${labels[kind]}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        {textField("item-name", "Name", name, setName)}
        {textField("item-value", kind === "debt" ? "Outstanding balance" : "Current value", value, setValue, "number")}
      </div>
      {kind === "pension" && <div className="grid gap-4 sm:grid-cols-2">{textField("pension-type", "Pension type", String(specific.pensionType), (value) => updateSpecific("pensionType", value))}{textField("employer-name", "Employer (optional)", String(specific.employerName), (value) => updateSpecific("employerName", value))}</div>}
      {(kind === "investment" || kind === "cash") && <div className="grid gap-4 sm:grid-cols-2">{textField("account-type", "Account type", String(specific.accountType), (value) => updateSpecific("accountType", value))}{textField("provider", "Provider (optional)", String(specific.provider), (value) => updateSpecific("provider", value))}</div>}
      {kind === "debt" && <div className="grid gap-4 sm:grid-cols-3">{textField("debt-type", "Debt type", String(specific.debtType), (value) => updateSpecific("debtType", value))}{textField("interest-rate", "Interest rate % (optional)", String(specific.interestRate), (value) => updateSpecific("interestRate", value), "number")}{textField("monthly-payment", "Monthly repayment (optional)", String(specific.monthlyPayment), (value) => updateSpecific("monthlyPayment", value), "number")}</div>}
      {kind === "property" && <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2">{textField("property-type", "Property type", String(specific.propertyType), (value) => updateSpecific("propertyType", value))}{textField("mortgage", "Outstanding mortgage", String(specific.outstandingMortgage), (value) => updateSpecific("outstandingMortgage", value), "number")}</div><div className="grid gap-4 sm:grid-cols-2">{textField("rental-income", "Monthly rent (optional)", String(specific.monthlyRentalIncome), (value) => updateSpecific("monthlyRentalIncome", value), "number")}{textField("property-costs", "Monthly costs (optional)", String(specific.monthlyCosts), (value) => updateSpecific("monthlyCosts", value), "number")}</div><label className="flex items-start gap-3 text-sm text-slate-300"><input type="checkbox" checked={Boolean(specific.isPrimaryResidence)} onChange={(event) => updateSpecific("isPrimaryResidence", event.target.checked)} className="mt-1 accent-cyan-400" />Primary residence</label><label className="flex items-start gap-3 text-sm text-slate-300"><input type="checkbox" checked={Boolean(specific.includeInInvestableWealth)} onChange={(event) => updateSpecific("includeInInvestableWealth", event.target.checked)} className="mt-1 accent-cyan-400" />Include this equity in Investable Wealth for an explicit retirement scenario</label></div>}
      {textField("item-notes", "Notes (optional)", notes, setNotes)}
      <div className="flex flex-wrap justify-end gap-3"><button type="button" onClick={onCancel} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400">Cancel</button><button type="submit" className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400">{item ? "Save changes" : `Add ${labels[kind].toLowerCase()}`}</button></div>
    </form>
  );
}