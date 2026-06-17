type TableListProps<T> = {
  columns: Array<{ label: string; key: keyof T }>;
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
};

export default function TableList<T>({
  columns,
  data,
  onEdit,
  onDelete,
}: TableListProps<T>) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-100 text-left text-sm uppercase tracking-[0.12em] text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-4 font-semibold">
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-4 font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
          {data.map((item, index) => (
            <tr key={index} className="odd:bg-white even:bg-slate-50">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-4 align-top">
                  {String(item[column.key] ?? "")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-4 align-top space-x-2">
                  {onEdit ? (
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="rounded-xl bg-rose-600 px-3 py-2 text-sm text-white transition hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  ) : null}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
