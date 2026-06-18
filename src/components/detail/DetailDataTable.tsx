"use client";

import React from "react";
import Button from "../Button";

export interface DetailDataTableColumn<T> {
  label: string;
  key: keyof T;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

export interface DetailDataTableProps<T> {
  title?: string;
  columns: DetailDataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  actions?: boolean;
}

export default function DetailDataTable<T>({
  title,
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records found.",
  onEdit,
  onDelete,
  actions = true,
}: DetailDataTableProps<T>) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
          <thead className="bg-slate-100 text-left uppercase tracking-[0.12em] text-slate-500">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-4 font-semibold ${column.className || ""}`}
                >
                  {column.label}
                </th>
              ))}
              {actions && (onEdit || onDelete) && (
                <th className="px-4 py-4 font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <tr
                  key={`skeleton-${idx}`}
                  className="odd:bg-white even:bg-slate-50"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-4 py-4 align-top ${column.className || ""}`}
                    >
                      <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                  {actions && (onEdit || onDelete) && (
                    <td className="px-4 py-4 align-top">
                      <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (actions && (onEdit || onDelete) ? 1 : 0)
                  }
                  className="px-4 py-12 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr key={rowIdx} className="odd:bg-white even:bg-slate-50">
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-4 py-4 align-top ${column.className || ""}`}
                    >
                      {column.render
                        ? column.render((item as any)[column.key], item)
                        : String((item as any)[column.key] ?? "-")}
                    </td>
                  ))}
                  {actions && (onEdit || onDelete) && (
                    <td className="px-4 py-4 align-top space-x-2">
                      {onEdit ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          Edit
                        </Button>
                      ) : null}
                      {onDelete ? (
                        <Button
                          variant="danger"
                          type="button"
                          size="sm"
                          onClick={() => onDelete(item)}
                        >
                          Delete
                        </Button>
                      ) : null}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
