"use client";

import { ReactNode } from "react";

export interface DetailSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  columns?: 1 | 2;
}

export default function DetailSection({
  title,
  description,
  children,
  className = "",
  columns = 1,
}: DetailSectionProps) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-sm p-6 ${className}`}
    >
      {(title || description) && (
        <div className="mb-6 pb-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          {description && (
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          )}
        </div>
      )}
      <div
        className={`grid gap-6 ${
          columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export interface DetailFieldProps {
  label: string;
  value?: string | number | null;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "date" | "number";
  className?: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export function DetailField({
  label,
  value,
  placeholder = "-",
  type = "text",
  className = "",
  editable = false,
  onChange,
}: DetailFieldProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      {editable && onChange ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      ) : (
        <p className="text-sm font-semibold text-slate-900">
          {value || placeholder}
        </p>
      )}
    </div>
  );
}
