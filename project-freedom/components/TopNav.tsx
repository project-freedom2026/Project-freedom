type TopNavItem = {
  href: string;
  label: string;
};

const navItems: TopNavItem[] = [
  { href: "#overview", label: "Overview" },
  { href: "#assets", label: "Assets & Debts" },
  { href: "#lifestyle", label: "Retirement Plan" },
  { href: "#projection", label: "Projection" },
  { href: "#check-in", label: "Monthly Check-In" },
  { href: "#history", label: "History" },
  { href: "#insights", label: "Insights" },
  { href: "#settings", label: "Settings" },
];

export default function TopNav() {
  return (
    <nav aria-label="Primary navigation" className="mt-8 rounded-3xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-full border border-slate-800/70 bg-slate-900/80 px-4 py-2 transition hover:border-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
