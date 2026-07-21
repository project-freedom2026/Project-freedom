import { useState } from "react";

type CalculationExplanationProps = {
  formula: string;
  description?: string;
};

export default function CalculationExplanation({
  formula,
  description,
}: CalculationExplanationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        aria-expanded={isOpen}
      >
        {isOpen ? "Hide" : "How is this calculated?"}
      </button>

      {isOpen && (
        <div className="mt-3 rounded-xl bg-slate-800/50 p-3 text-xs text-slate-300">
          <p className="font-mono font-semibold text-slate-200">{formula}</p>
          {description && <p className="mt-2">{description}</p>}
        </div>
      )}
    </div>
  );
}
