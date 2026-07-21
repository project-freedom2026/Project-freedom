import { useState } from "react";

export default function FinancialDefinitions() {
  const [isOpen, setIsOpen] = useState(false);

  const definitions = [
    {
      term: "Net Worth",
      definition: "Everything you own minus everything you owe.",
    },
    {
      term: "Investable Wealth",
      definition:
        "The assets that can realistically support your retirement lifestyle.",
    },
    {
      term: "Freedom Number",
      definition:
        "The investment value needed to support your chosen annual lifestyle using your selected withdrawal assumption.",
    },
    {
      term: "Withdrawal Assumption",
      definition:
        "The percentage of your investments you expect to withdraw each year during retirement.",
    },
    {
      term: "Freedom Score",
      definition: "Your progress towards your Freedom Number.",
    },
  ];

  return (
    <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-white">
          Financial Definitions
        </h3>
        <span className="text-slate-400">
          {isOpen ? "▼" : "▶"}
        </span>
      </button>

      {isOpen && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {definitions.map((item) => (
            <div
              key={item.term}
              className="rounded-lg bg-slate-800/50 p-4"
            >
              <p className="font-semibold text-cyan-400">{item.term}</p>
              <p className="mt-2 text-sm text-slate-300">{item.definition}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
