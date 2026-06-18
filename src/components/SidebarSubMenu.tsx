"use client";

import { SidebarSection } from "./Sidebar";

interface SidebarSubMenuProps {
  activeSection: SidebarSection | undefined;
  onClose: () => void;
}

export default function SidebarSubMenu({
  activeSection,
  onClose,
}: SidebarSubMenuProps) {
  if (!activeSection?.childItems) {
    return null;
  }

  return (
    <div className="absolute left-full top-0 z-20 h-full w-72 border-l border-slate-800 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {activeSection.title}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
          aria-label="Close section"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {activeSection.childItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
