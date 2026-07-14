type MoneyInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export default function MoneyInput({
  label,
  value,
  onChange,
}: MoneyInputProps) {
  return (
    <div className="rounded-2xl bg-slate-900 p-5">
      <label className="text-sm font-medium text-slate-400">{label}</label>

      <div className="mt-3 flex items-center rounded-xl bg-slate-800 px-4">
        <span className="text-slate-400">£</span>

        <input
          type="number"
          min="0"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full bg-transparent px-2 py-3 text-lg font-semibold text-white outline-none"
          aria-label={label}
        />
      </div>
    </div>
  );
}