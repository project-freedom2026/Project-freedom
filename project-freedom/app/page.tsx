"use client";

import { useEffect, useState } from "react";
import AssetsDebtsSection from "../components/assets/AssetsDebtsSection";
import CalculationExplanation from "../components/CalculationExplanation";
import DashboardCard from "../components/DashboardCard";
import FinancialDefinitions from "../components/FinancialDefinitions";
import FreedomDateEstimator from "../components/FreedomDateEstimator";
import FreedomLifestylePlanner from "../components/FreedomLifestylePlanner";
import FreedomProgress from "../components/FreedomProgress";
import FreedomCoach from "../components/FreedomCoach";
import FreedomHealthScore from "../components/FreedomHealthScore";
import FutureIncomeImpactComparison from "../components/FutureIncomeImpactComparison";
import InsightsPanel from "../components/InsightsPanel";
import MonthlyCheckIn from "../components/MonthlyCheckIn";
import ProgressHistory from "../components/ProgressHistory";
import ProductSetup from "../components/ProductSetup";
import SectionHeading from "../components/SectionHeading";
import TopNav from "../components/TopNav";
import { appMetadata } from "../lib/appMetadata";
import { calculateFreedomNumber } from "../lib/calculateFreedomNumber";
import { estimateFreedomDate } from "../lib/estimateFreedomDate";
import { getFutureIncomeProjection } from "../lib/futureIncome";
import { compareFutureIncomeImpact } from "../lib/futureIncomeImpact";
import { generateFreedomCoach } from "../lib/freedomCoach";
import { calculateFreedomHealth } from "../lib/freedomHealth";
import { getFinancialTotals } from "../lib/financialTotals";
import { generateFinancialInsights } from "../lib/generateFinancialInsights";
import { MonthlyCheckInSnapshot, normalizeSnapshot } from "../lib/monthlyCheckIns";
import { migrateIfNeeded } from "../lib/migrations/migrateToV2";
import { readJson, writeJson } from "../lib/storage";
import { FinancialModelV2 } from "../types/financial";

const storageKey = "project-freedom-data";
const monthlyCheckInStorageKey = "project-freedom-monthly-check-ins";
const formatCurrencyValue = (value: number, currency = "GBP") => new Intl.NumberFormat(currency === "GBP" ? "en-GB" : undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

const startingModel: FinancialModelV2 = {
  schemaVersion: 3,
  currency: "GBP",
  profile: { annualLifestyleGoal: 30000, withdrawalAssumption: 4 },
  pensions: [{ id: "starter-pension", name: "Existing Pension", value: 118000, type: "pension" }],
  investments: [{ id: "starter-investments", name: "Existing Investments", value: 6000, type: "investment" }],
  cash: [],
  debts: [],
  properties: [{ id: "starter-property", name: "Primary residence", value: 400000, type: "property", outstandingMortgage: 0, isPrimaryResidence: true, includeInInvestableWealth: false }],
  others: [],
  futureIncome: [],
  legacy: { pension: 118000, investments: 6000, property: 400000, cash: 0, debts: 0, freedomNumber: calculateFreedomNumber({ annualIncome: 30000, withdrawalRate: 4 }), annualReturn: 7, annualContribution: 0, annualIncome: 30000, withdrawalRate: 4 },
};

const isModel = (value: unknown): value is FinancialModelV2 => {
  if (!value || typeof value !== "object") return false;
  const model = value as Partial<FinancialModelV2>;
  return typeof model.schemaVersion === "number" && model.schemaVersion >= 2 && Array.isArray(model.pensions) && Array.isArray(model.investments) && Array.isArray(model.cash) && Array.isArray(model.debts) && Array.isArray(model.properties) && Array.isArray(model.others);
};

const safeNumber = (value: number | undefined, fallback: number) => typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : fallback;

export default function Home() {
  const [model, setModel] = useState<FinancialModelV2>(() => {
    if (typeof window === "undefined") return startingModel;
    migrateIfNeeded();
    const saved = readJson<unknown>(storageKey);
    return isModel(saved) ? saved : startingModel;
  });
  const [checkIns, setCheckIns] = useState<MonthlyCheckInSnapshot[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = readJson<MonthlyCheckInSnapshot[]>(monthlyCheckInStorageKey) ?? [];
    return saved.filter((snapshot) => snapshot && typeof snapshot.id === "string" && typeof snapshot.date === "string").map(normalizeSnapshot);
  });
  const [isResetting, setIsResetting] = useState(false);
  const formatCurrency = (value: number) => formatCurrencyValue(value, model.currency || "GBP");

  useEffect(() => { writeJson(storageKey, model); }, [model]);
  useEffect(() => { writeJson(monthlyCheckInStorageKey, checkIns); }, [checkIns]);

  const legacy = model.legacy ?? {};
  const annualIncome = safeNumber(model.profile?.annualLifestyleGoal ?? legacy.annualIncome, 30000);
  const withdrawalRate = safeNumber(model.profile?.withdrawalAssumption ?? legacy.withdrawalRate, 4);
  const annualReturn = safeNumber(legacy.annualReturn, 7);
  const annualContribution = safeNumber(legacy.annualContribution, 0);
  const configuredFreedomNumber = safeNumber(model.profile?.manualFreedomNumber ?? legacy.freedomNumber, 0);
  const calculatedFreedomNumber = calculateFreedomNumber({ annualIncome, withdrawalRate });
  const effectiveFreedomNumber = model.profile?.useManualFreedomNumber && configuredFreedomNumber > 0 ? configuredFreedomNumber : calculatedFreedomNumber;
  const futureIncomeProjection = getFutureIncomeProjection(model.futureIncome);
  const totals = getFinancialTotals(model);
  const freedomProgress = effectiveFreedomNumber > 0 ? Math.round((totals.investableWealth / effectiveFreedomNumber) * 100) : 0;
  const amountRemaining = Math.max(effectiveFreedomNumber - totals.investableWealth, 0);
  const freedomEstimate = estimateFreedomDate({ investableWealth: totals.investableWealth, annualContribution, annualReturn, freedomNumber: effectiveFreedomNumber, futureIncomeAtYear: futureIncomeProjection.retirementIncomeAtYear });
  const coachGuidance = generateFreedomCoach({ pension: totals.pension, investments: totals.investments, cash: totals.cash, debts: totals.debts, investableWealth: totals.investableWealth, freedomProgress, annualContribution, snapshots: checkIns });
  const healthScore = calculateFreedomHealth({ freedomProgress, debts: totals.debts, investableWealth: totals.investableWealth, annualContribution, annualIncome, pension: totals.pension, investments: totals.investments, cash: totals.cash, snapshotCount: checkIns.length });
  const futureIncomeImpact = compareFutureIncomeImpact({ investableWealth: totals.investableWealth, annualContribution, annualReturn, freedomNumber: effectiveFreedomNumber, futureIncomeAtYear: futureIncomeProjection.retirementIncomeAtYear });
  const insights = generateFinancialInsights({ pension: totals.pension, investments: totals.investments, property: totals.propertyEquity, cash: totals.cash, debts: totals.debts, annualContribution, annualReturn, freedomNumber: effectiveFreedomNumber, investableWealth: totals.investableWealth, netWorth: totals.netWorth, freedomProgress, estimatedFreedomYears: freedomEstimate.years, estimatedFreedomStatus: freedomEstimate.status });
  const latestCheckIn = [...checkIns].sort((left, right) => right.date.localeCompare(left.date))[0];
  const featuredInsight = insights[0];
  const previousCheckIn = [...checkIns].sort((left, right) => right.date.localeCompare(left.date))[1];
  const monthlyInvestableChange = latestCheckIn && previousCheckIn ? (latestCheckIn.investableWealth ?? 0) - (previousCheckIn.investableWealth ?? 0) : null;
  const monthlyProgressChange = latestCheckIn && previousCheckIn ? latestCheckIn.freedomScore - previousCheckIn.freedomScore : null;
  const updatePlan = (field: "annualIncome" | "withdrawalRate", value: number) => setModel((current) => ({ ...current, profile: { ...current.profile, annualLifestyleGoal: field === "annualIncome" ? Math.max(0, value) : current.profile?.annualLifestyleGoal, withdrawalAssumption: field === "withdrawalRate" ? Math.max(0, value) : current.profile?.withdrawalAssumption } }));
  const updateProjection = (field: "annualReturn" | "annualContribution", value: number) => setModel((current) => ({ ...current, legacy: { ...current.legacy, [field]: Math.max(0, value) } }));
  const saveSnapshot = (snapshot: MonthlyCheckInSnapshot) => setCheckIns((current) => { const index = current.findIndex((item) => item.date === snapshot.date); if (index < 0) return [snapshot, ...current]; const next = [...current]; next[index] = snapshot; return next; });
  const resetData = () => { if (!isResetting) { setIsResetting(true); return; } setModel(startingModel); setCheckIns([]); setIsResetting(false); };
  const importData = (nextModel: FinancialModelV2, nextSnapshots: MonthlyCheckInSnapshot[]) => { setModel(nextModel); setCheckIns(nextSnapshots.filter((snapshot) => snapshot && typeof snapshot.id === "string" && typeof snapshot.date === "string").map(normalizeSnapshot)); };
  const needsOnboarding = !model.profile?.firstName || !model.profile?.dateOfBirth;

  return <main className="min-h-screen bg-slate-950 px-5 py-10 text-white md:px-10"><div className="mx-auto max-w-6xl"><header><p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Project Freedom</p><h1 className="mt-4 text-4xl font-bold md:text-5xl">Your path to financial freedom</h1><p className="mt-3 max-w-2xl text-slate-400">Make your progress visible. Keep your financial picture clear, calm and actionable.</p></header><TopNav />{needsOnboarding && <ProductSetup model={model} onChange={setModel} onReset={resetData} snapshots={checkIns} onImport={importData} isOnboarding />}
    <FreedomCoach guidance={coachGuidance} /><section id="overview" className="mt-10" aria-labelledby="overview-heading"><div className="mb-5"><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Overview</p><h2 id="overview-heading" className="mt-2 text-3xl font-bold">Your position at a glance</h2></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><DashboardCard title="Investable Wealth" value={formatCurrency(totals.investableWealth)} subtitle="Available to support your retirement plan" /><DashboardCard title="Total Net Worth" value={formatCurrency(totals.netWorth)} subtitle="All assets and liabilities included" /><DashboardCard title="Freedom Number" value={formatCurrency(effectiveFreedomNumber)} subtitle="Your target based on lifestyle assumptions" /><DashboardCard title="Freedom Date" value={freedomEstimate.status === "already-reached" ? "Achieved" : freedomEstimate.years === null ? "Not reachable" : `${new Date().getFullYear() + freedomEstimate.years}`} subtitle={freedomEstimate.status === "already-reached" ? "Your investable wealth clears the target" : "Planning estimate, not a guarantee"} /></div><div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><FreedomProgress progress={freedomProgress} investableWealth={formatCurrency(totals.investableWealth)} amountRemaining={formatCurrency(amountRemaining)} freedomNumber={formatCurrency(effectiveFreedomNumber)} message={freedomProgress >= 100 ? "You've built the freedom. Now you choose what's next." : "Every contribution moves you closer to freedom."} /><div className="space-y-4">{latestCheckIn && <DashboardCard title="Since latest check-in" value={`${totals.netWorth - latestCheckIn.netWorth >= 0 ? "+" : ""}${formatCurrency(totals.netWorth - latestCheckIn.netWorth)}`} subtitle={`Compared with ${latestCheckIn.date}`} />}{featuredInsight && <article id="insights" className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6"><p className="text-sm text-cyan-300">Featured insight</p><h3 className="mt-2 text-xl font-semibold">{featuredInsight.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{featuredInsight.message}</p></article>}</div></div></section>
    <AssetsDebtsSection model={model} onChange={setModel} formatCurrency={formatCurrency} />
    <section id="lifestyle" className="mt-14 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]"><FreedomLifestylePlanner annualIncome={annualIncome} withdrawalRate={withdrawalRate} calculatedFreedomNumber={calculatedFreedomNumber} onAnnualIncomeChange={(value) => updatePlan("annualIncome", value)} onWithdrawalRateChange={(value) => updatePlan("withdrawalRate", value)} /><FreedomDateEstimator investableWealth={totals.investableWealth} annualContribution={annualContribution} annualReturn={annualReturn} freedomNumber={effectiveFreedomNumber} futureIncomeAtYear={futureIncomeProjection.retirementIncomeAtYear} onAnnualContributionChange={(value) => updateProjection("annualContribution", value)} /></section>
    <section id="projection" className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-900 p-6 md:p-8"><SectionHeading title="Projection settings" subtitle="Control the assumptions that determine your estimated freedom timeline." /><div className="mt-6 grid gap-6 md:grid-cols-2"><label className="rounded-2xl bg-slate-800/80 p-5 text-sm text-slate-300" htmlFor="annual-return">Estimated annual investment return <strong className="float-right text-cyan-400">{annualReturn}%</strong><input id="annual-return" type="range" min="0" max="12" step="0.5" value={annualReturn} onChange={(event) => updateProjection("annualReturn", Number(event.target.value))} className="mt-4 w-full accent-cyan-400" /></label><label className="rounded-2xl bg-slate-800/80 p-5 text-sm text-slate-300" htmlFor="annual-contribution">Annual contribution<input id="annual-contribution" type="number" min="0" value={annualContribution} onChange={(event) => updateProjection("annualContribution", Number(event.target.value))} className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30" /></label></div><div className="mt-5 grid gap-4 md:grid-cols-3"><DashboardCard title="Investable Wealth" value={formatCurrency(totals.investableWealth)} subtitle="Current position" /><DashboardCard title="Freedom Score" value={`${freedomProgress}%`} subtitle="Investable Wealth / Freedom Number"><CalculationExplanation formula="Freedom Score = Investable Wealth ÷ Freedom Number" /></DashboardCard><DashboardCard title="Target year" value={freedomEstimate.years === null ? "Not reachable" : `${new Date().getFullYear() + freedomEstimate.years}`} subtitle="Based on current assumptions" /></div></section>
    {monthlyInvestableChange !== null && <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5" aria-labelledby="momentum-preview"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-cyan-300">Monthly Momentum</p><h2 id="momentum-preview" className="mt-1 text-xl font-semibold">This month</h2></div><a href="#history" className="rounded-xl border border-cyan-400/40 px-3 py-2 text-sm text-cyan-200 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400">View full history</a></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><span className="rounded-xl bg-slate-950/50 p-3 text-sm text-slate-300">{monthlyInvestableChange >= 0 ? "+" : ""}{formatCurrency(monthlyInvestableChange)} Investable Wealth</span><span className="rounded-xl bg-slate-950/50 p-3 text-sm text-slate-300">{monthlyProgressChange !== null && monthlyProgressChange >= 0 ? "+" : ""}{monthlyProgressChange?.toFixed(1)}% Freedom Progress</span></div></section>}
    <section className="mt-8 grid gap-5 lg:grid-cols-2"><FreedomHealthScore result={healthScore} /><FutureIncomeImpactComparison impact={futureIncomeImpact} formatCurrency={formatCurrency} hasFutureIncome={futureIncomeProjection.enabledIncome > 0} /></section><ProductSetup model={model} onChange={setModel} onReset={resetData} snapshots={checkIns} onImport={importData} />{isResetting && <p className="mt-3 text-sm text-rose-300" role="alert">Press Reset data again to confirm. This removes local financial data and history.</p>}<section id="check-in" className="mt-14"><MonthlyCheckIn pension={totals.pension} investments={totals.investments} cash={totals.cash} debt={totals.debts} netWorth={totals.netWorth} freedomScore={freedomProgress} freedomNumber={effectiveFreedomNumber} investableWealth={totals.investableWealth} freedomDateYears={freedomEstimate.years} freedomDateStatus={freedomEstimate.status} withdrawalRate={withdrawalRate} annualLifestyleGoal={annualIncome} snapshots={checkIns} onSaveSnapshot={saveSnapshot} /></section><ProgressHistory snapshots={checkIns} formatCurrency={formatCurrency} /><InsightsPanel insights={insights} /><FinancialDefinitions /><footer className="mt-10 border-t border-slate-800 pt-6 text-center"><p className="text-xs leading-5 text-slate-500">Project Freedom provides planning estimates based on the information you enter. Investment performance, inflation, taxation and personal circumstances will affect real-world outcomes.</p><p className="mt-4 text-xs text-slate-500">{appMetadata.appName} {appMetadata.version} · {appMetadata.releaseName}</p></footer>
  </div></main>;
}
