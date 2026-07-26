type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  id?: string;
};

export default function SectionHeading({ title, subtitle, id }: SectionHeadingProps) {
  return (
    <div id={id} className="mb-6 flex flex-col gap-2">
      <div className="flex items-center gap-3 text-slate-400">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lg text-cyan-400 ring-1 ring-slate-800">•</span>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>
      {subtitle ? (
        <p className="max-w-3xl text-sm text-slate-400">{subtitle}</p>
      ) : null}
    </div>
  );
}
