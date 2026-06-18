"use client";

import { useState } from "react";

export type SidebarSection = {
  title: string;
  items?: Array<{ label: string; href: string }>;
  childItems?: Array<{ label: string; href: string }>;
};

interface SidebarProps {
  sections: SidebarSection[];
  activeSection: string | null;
  onSectionToggle: (title: string) => void;
  onLogout: () => void;
}

export default function Sidebar({
  sections,
  activeSection,
  onSectionToggle,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 z-10 w-80 border-r border-slate-200 bg-slate-950 text-slate-100 shadow-lg overflow-hidden flex flex-col h-[calc(100vh-64px)]">
      <div className="px-6 py-5 text-slate-400 mt-6">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="space-y-2">
              {section.items?.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              {section.childItems ? (
                <button
                  type="button"
                  onClick={() => onSectionToggle(section.title)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                    activeSection === section.title
                      ? "bg-slate-800 text-white"
                      : "text-slate-200 hover:bg-slate-800 hover:text-white"
                  }`}
                  aria-expanded={activeSection === section.title}
                >
                  <span>{section.title}</span>
                  <span
                    className={`text-slate-400 transition-transform duration-200 ${
                      activeSection === section.title
                        ? "rotate-180 text-slate-200"
                        : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-slate-800 px-6 py-6">
        <div className="mb-3 text-sm text-slate-400">Signed in as</div>
        <div className="mb-3 rounded-3xl bg-slate-900 px-4 py-4 text-sm text-slate-200 shadow-sm">
          <div className="font-medium">Admin User</div>
          <div className="text-slate-500">admin@viiontech.com</div>
        </div>
        <button
          onClick={onLogout}
          className="w-full rounded-3xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          type="button"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
