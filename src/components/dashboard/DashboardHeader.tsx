type DashboardHeaderProps = {
  schoolName: string;
  dateLabel: string;
};

export default function DashboardHeader({ schoolName, dateLabel }: DashboardHeaderProps) {
  return (
    <div className="mb-8 space-y-3 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">DASHBOARD</p>
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-semibold text-slate-900">{schoolName}</h2>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">{dateLabel}</span>
      </div>
    </div>
  );
}
