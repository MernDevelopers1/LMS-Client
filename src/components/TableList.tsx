"use client";

import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";

type TableListProps<T> = {
  columns: Array<{ label: string; key: string }>;
  data: T[];
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  searchText?: string;
  sortKey?: string | null;
  sortDirection?: "asc" | "desc";
  onSearchChange?: (value: string) => void;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  remoteSort?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchable?: boolean;
  sortable?: boolean;
  paginated?: boolean;
  serial?: boolean;
  serialLabel?: string;
  isLoading?: boolean;
};

const PAGE_SIZES = [10, 20, 50];

export default function TableList<T>({
  columns,
  data,
  currentPage = 1,
  pageSize = PAGE_SIZES[0],
  totalItems = data.length,
  searchText = "",
  sortKey: propSortKey = null,
  sortDirection: propSortDirection = "asc",
  onSearchChange,
  onSortChange,
  remoteSort = false,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  searchable = true,
  sortable = true,
  paginated = true,
  serial = true,
  serialLabel = "SR",
  isLoading = false,
}: TableListProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(propSortKey);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    propSortDirection,
  );

  useEffect(() => {
    setSortKey(propSortKey);
  }, [propSortKey]);

  useEffect(() => {
    setSortDirection(propSortDirection);
  }, [propSortDirection]);

  const resolvedSortKey = sortKey ?? propSortKey ?? null;
  const resolvedSortDirection = sortDirection ?? propSortDirection ?? "asc";

  const sortedData = useMemo(() => {
    if (!sortable || !resolvedSortKey || remoteSort) return data;

    const sortedKey = String(resolvedSortKey);
    return [...data].sort((a, b) => {
      const left = (a as any)[sortedKey];
      const right = (b as any)[sortedKey];
      const aValue =
        left === undefined || left === null ? "" : String(left).toLowerCase();
      const bValue =
        right === undefined || right === null
          ? ""
          : String(right).toLowerCase();

      if (aValue < bValue) return resolvedSortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return resolvedSortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, resolvedSortDirection, resolvedSortKey, sortable]);

  const totalPages = paginated
    ? Math.max(1, Math.ceil(totalItems / pageSize))
    : 1;

  // Local debounced search to avoid triggering parent fetch on every keystroke
  const [localSearch, setLocalSearch] = useState<string>(searchText);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const wasFocusedRef = useRef(false);

  useLayoutEffect(() => {
    wasFocusedRef.current = document.activeElement === inputRef.current;
  });

  useEffect(() => {
    if (wasFocusedRef.current) {
      inputRef.current?.focus();
      const pos = inputRef.current?.value.length ?? 0;
      try {
        inputRef.current?.setSelectionRange(pos, pos);
      } catch (e) {
        /* ignore if not supported */
      }
    }
  }, [data, currentPage, pageSize, totalItems, columns]);

  const hasSearchTypedRef = useRef(false);

  useEffect(() => {
    setLocalSearch(searchText);
    hasSearchTypedRef.current = false;
  }, [searchText]);

  useEffect(() => {
    if (!hasSearchTypedRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      onSearchChange?.(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const handleSearchChange = (value: string) => {
    hasSearchTypedRef.current = true;
    setLocalSearch(value);
  };

  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    const nextDirection =
      resolvedSortKey === columnKey && resolvedSortDirection === "asc"
        ? "desc"
        : "asc";

    setSortKey(columnKey);
    setSortDirection(nextDirection);
    onSortChange?.(columnKey, nextDirection);
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {searchable ? (
          <div className="flex-1">
            <label className="sr-only" htmlFor="table-search">
              Search
            </label>
            <input
              id="table-search"
              ref={inputRef}
              type="search"
              value={localSearch}
              onChange={(event) => handleSearchChange(event.target.value)}
              onFocus={() => (wasFocusedRef.current = true)}
              onBlur={() => (wasFocusedRef.current = false)}
              placeholder="Search records"
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ) : null}

        {paginated ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="text-sm text-slate-500">
              Show
              <select
                value={pageSize}
                onChange={(event) =>
                  onPageSizeChange?.(Number(event.target.value))
                }
                className="ml-2 rounded-3xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              entries
            </label>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100 text-left text-sm uppercase tracking-[0.12em] text-slate-500">
            <tr>
              {serial && (
                <th className="px-4 py-4 font-semibold">{serialLabel}</th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-4 font-semibold ${sortable ? "cursor-pointer" : ""}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {resolvedSortKey === column.key ? (
                      <span>{resolvedSortDirection === "asc" ? "▲" : "▼"}</span>
                    ) : null}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-4 font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {isLoading ? (
              // Render skeleton rows matching the number of columns
              Array.from({
                length: Math.max(3, Math.min(8, pageSize / 5 || 5)),
              }).map((_, rIdx) => (
                <tr
                  key={`skeleton-${rIdx}`}
                  className="odd:bg-white even:bg-slate-50"
                >
                  {serial && (
                    <td className="px-4 py-4 align-top">
                      <div className="h-4 w-8 animate-pulse rounded bg-slate-200" />
                    </td>
                  )}
                  {columns.map((column, cIdx) => (
                    <td
                      key={String(column.key) + cIdx}
                      className="px-4 py-4 align-top"
                    >
                      <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-4 align-top">
                      <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
                    </td>
                  )}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (serial ? 1 : 0) +
                    (onEdit || onDelete ? 1 : 0)
                  }
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <tr key={index} className="odd:bg-white even:bg-slate-50">
                  {serial && (
                    <td className="px-4 py-4 align-top text-slate-500">
                      {startItem + index}
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-4 py-4 align-top"
                    >
                      {String((item as any)[column.key] ?? "")}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated ? (
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            Showing {startItem} to {endItem} of {totalItems} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1 || !onPageChange}
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                onPageChange?.(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages || !onPageChange}
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
