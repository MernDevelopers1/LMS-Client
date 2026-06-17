type DashboardSummaryProps = {
  stats: Array<{ value: string | number; label: string }>;
  title: string;
};

export default function DashboardSummary({ stats, title }: DashboardSummaryProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      </div>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-4xl font-semibold text-slate-900">{stat.value}</p>
          <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
