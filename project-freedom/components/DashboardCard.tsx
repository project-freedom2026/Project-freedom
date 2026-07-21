import { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  value: string;
  subtitle: string;
  highlight?: boolean;
  children?: ReactNode;
};

export default function DashboardCard({
  title,
  value,
  subtitle,
  highlight = false,
  children,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{title}</p>

      <p
  className={
    "mt-2 text-3xl font-bold " +
    (highlight ? "text-emerald-400" : "text-white")
  }
>
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>

      {children}
    </div>
  );
}