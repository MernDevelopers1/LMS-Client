"use client";

import { ReactNode } from "react";

export interface DetailPageHeaderProps {
  title: string;
  subtitle?: string;
  profileImage?: string;
  status?: string;
  statusColor?: "green" | "red" | "yellow" | "blue";
  headerInfo?: Array<{
    label: string;
    value: string | number;
  }>;
  actionButton?: ReactNode;
}

const statusColors = {
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
  blue: "bg-blue-100 text-blue-800",
};

export default function DetailPageHeader({
  title,
  subtitle,
  profileImage,
  status,
  statusColor = "blue",
  headerInfo = [],
  actionButton,
}: DetailPageHeaderProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
      <div className="flex flex-col gap-6">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-slate-200">
          {profileImage && (
            <div className="shrink-0">
              <img
                src={profileImage}
                alt={title}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-200"
              />
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {title}
              </h1>
              {status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                    statusColors[statusColor]
                  }`}
                >
                  {status}
                </span>
              )}
            </div>
            {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
          </div>

          {actionButton && (
            <div className="flex items-center gap-2 shrink-0">
              {actionButton}
            </div>
          )}
        </div>

        {/* Header Info Grid */}
        {headerInfo.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {headerInfo.map((info, idx) => (
              <div key={idx} className="flex flex-col">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {info.label}
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {info.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
