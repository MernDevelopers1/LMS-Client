type DashboardCardProps = {
  value: string | number;
  label: string;
  description?: string;
};

export default function DashboardCard({ value, label, description }: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-4xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
      {description ? <p className="mt-3 text-sm text-slate-400">{description}</p> : null}
    </div>
  );
}
