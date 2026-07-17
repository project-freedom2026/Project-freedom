"use client";

import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import FreedomDateEstimator from "../components/FreedomDateEstimator";
import InsightsPanel from "../components/InsightsPanel";
import MoneyInput from "../components/MoneyInput";
import FreedomProgress from "../components/FreedomProgress";
import { estimateFreedomDate } from "../lib/estimateFreedomDate";
import { generateFinancialInsights } from "../lib/generateFinancialInsights";

type FinancialData = {
  pension: number;
  investments: number;
  property: number;
  cash: number;
  debts: number;
  freedomNumber: number;
  annualReturn: number;
  annualContribution: number;
};

const startingData: FinancialData = {
  pension: 118000,
  investments: 6000,
  property: 400000,
  cash: 0,
  debts: 0,
  freedomNumber: 1000000,
  annualReturn: 7,
  annualContribution: 0,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

const sanitizeFinancialValue = (value: number | null | undefined): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
};

const normalizeFinancialData = (value: Partial<FinancialData> | null | undefined): FinancialData => ({
  pension: sanitizeFinancialValue(value?.pension),
  investments: sanitizeFinancialValue(value?.investments),
  property: sanitizeFinancialValue(value?.property),
  cash: sanitizeFinancialValue(value?.cash),
  debts: sanitizeFinancialValue(value?.debts),
  freedomNumber: sanitizeFinancialValue(value?.freedomNumber),
  annualReturn: sanitizeFinancialValue(value?.annualReturn),
  annualContribution: sanitizeFinancialValue(value?.annualContribution),
});

export default function Home() {
  const [data, setData] = useState<FinancialData>(() => {
    if (typeof window === "undefined") {
      return startingData;
    }

    const savedData = window.localStorage.getItem("project-freedom-data");

    if (!savedData) {
      return startingData;
    }

    try {
      const parsedData = JSON.parse(savedData) as Partial<FinancialData>;
      return normalizeFinancialData(parsedData);
    } catch {
      console.error("Project Freedom data could not be loaded.");
      return startingData;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("project-freedom-data", JSON.stringify(data));
    }
  }, [data]);

  const updateValue = (field: keyof FinancialData, value: number) => {
    setData((currentData) => ({
      ...currentData,
      [field]: sanitizeFinancialValue(value),
    }));
  };

  const netWorth =
    data.pension +
    data.investments +
    data.property +
    data.cash -
    data.debts;

  const investableWealth =
    data.pension + data.investments + data.cash - data.debts;

  const freedomProgress =
    data.freedomNumber > 0
      ? Math.round((netWorth / data.freedomNumber) * 100)
      : 0;

  const estimatedDailyGrowth =
    ((data.pension + data.investments + data.cash) *
      (data.annualReturn / 100)) /
    365;

  const amountRemaining = Math.max(data.freedomNumber - netWorth, 0);

  const motivationalMessage =
    freedomProgress >= 100
      ? "You have reached your Freedom Number."
      : freedomProgress >= 75
        ? "Freedom is firmly in sight."
        : freedomProgress >= 50
          ? "You have already built a powerful financial foundation."
          : freedomProgress >= 25
            ? "Momentum is building. Keep moving forward."
            : "Every contribution moves you closer to freedom.";

  const freedomEstimate = estimateFreedomDate({
    investableWealth,
    annualContribution: data.annualContribution,
    annualReturn: data.annualReturn,
    freedomNumber: data.freedomNumber,
  });

  const insights = generateFinancialInsights({
    pension: data.pension,
    investments: data.investments,
    property: data.property,
    cash: data.cash,
    debts: data.debts,
    annualContribution: data.annualContribution,
    annualReturn: data.annualReturn,
    freedomNumber: data.freedomNumber,
    investableWealth,
    netWorth,
    freedomProgress,
    estimatedFreedomYears: freedomEstimate.years,
    estimatedFreedomStatus: freedomEstimate.status,
  });

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Project Freedom
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Welcome Andrew 👋
          </h1>

          <p className="mt-3 text-slate-400">
            Make your progress visible. Make work optional.
          </p>
        </header>

        <FreedomProgress
  progress={freedomProgress}
  netWorth={formatCurrency(netWorth)}
  amountRemaining={formatCurrency(amountRemaining)}
  freedomNumber={formatCurrency(data.freedomNumber)}
  message={motivationalMessage}
/>

        <FreedomDateEstimator
          investableWealth={investableWealth}
          annualContribution={data.annualContribution}
          annualReturn={data.annualReturn}
          freedomNumber={data.freedomNumber}
          onAnnualContributionChange={(value) =>
            updateValue("annualContribution", value)
          }
        />

        <InsightsPanel insights={insights} />

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Net Worth"
            value={formatCurrency(netWorth)}
            subtitle="Assets minus debts"
          />

          <DashboardCard
            title="Investable Wealth"
            value={formatCurrency(investableWealth)}
            subtitle="Excludes your home"
          />

          <DashboardCard
  title="Today's Wealth"
  value={formatCurrency(estimatedDailyGrowth)}
  subtitle={"Estimated at " + data.annualReturn + "% annually"}
  highlight
/>

          <DashboardCard
  title="Freedom Score"
  value={freedomProgress + "%"}
  subtitle="Progress towards your target"
/>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Your Financial Picture</h2>
            <p className="mt-1 text-sm text-slate-400">
              Change any number and the dashboard updates instantly.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <MoneyInput
              label="Pensions"
              value={data.pension}
              onChange={(value) => updateValue("pension", value)}
            />

            <MoneyInput
              label="Investments"
              value={data.investments}
              onChange={(value) => updateValue("investments", value)}
            />

            <MoneyInput
              label="Property"
              value={data.property}
              onChange={(value) => updateValue("property", value)}
            />

            <MoneyInput
              label="Cash and Savings"
              value={data.cash}
              onChange={(value) => updateValue("cash", value)}
            />

            <MoneyInput
              label="Debts"
              value={data.debts}
              onChange={(value) => updateValue("debts", value)}
            />

            <MoneyInput
              label="Freedom Number"
              value={data.freedomNumber}
              onChange={(value) => updateValue("freedomNumber", value)}
            />
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-slate-900 p-6">
          <label
            htmlFor="annual-return"
            className="text-sm font-medium text-slate-300"
          >
            Estimated annual investment return
          </label>

          <div className="mt-4 flex items-center gap-4">
            <input
              id="annual-return"
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={data.annualReturn}
              onChange={(event) =>
                updateValue("annualReturn", Number(event.target.value))
              }
              className="w-full accent-cyan-400"
            />

            <span className="w-16 text-right text-lg font-semibold text-cyan-400">
              {data.annualReturn}%
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            This is an estimate, not a guaranteed return.
          </p>
        </section>

        <footer className="mt-10 text-center text-xs text-slate-600">
          Project Freedom v0.1.0 — Foundation
        </footer>
      </div>
    </main>
  );
}