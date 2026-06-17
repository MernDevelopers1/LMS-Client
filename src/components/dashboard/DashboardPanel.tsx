import DashboardCard from "./DashboardCard";

type DashboardPanelProps = {
  title: string;
  data: Array<{ value: string | number; label: string; description?: string }>;
};

export default function DashboardPanel({ title, data }: DashboardPanelProps) {
  return (
    <section className="space-y-6 px-4 py-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.map((item) => (
          <div key={item.label}>
            <DashboardCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}
