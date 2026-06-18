"use client";

import { ReactNode } from "react";
import Button from "./Button";
import TableList, { TableListProps } from "./TableList";

type AdminListPageProps<T> = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  actionOnClick?: () => void;
  error?: string | null;
  tableProps: Omit<
    TableListProps<T>,
    "headerContent" | "toolbarContent" | "errorMessage"
  >;
};

export default function AdminListPage<T>({
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  error,
  tableProps,
}: AdminListPageProps<T>) {
  const actionButton = actionHref ? (
    <Button href={actionHref}>{actionLabel}</Button>
  ) : (
    <Button type="button" onClick={actionOnClick}>
      {actionLabel}
    </Button>
  );

  return (
    <div className="space-y-6">
      <TableList
        headerContent={
          <div className="mb-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              {title}
            </h1>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        }
        toolbarContent={actionButton}
        errorMessage={error ?? undefined}
        {...tableProps}
      />
    </div>
  );
}
