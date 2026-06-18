"use client";

import { ReactNode, useState } from "react";

export interface DetailPageTab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DetailPageTabsProps {
  tabs: DetailPageTab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
}

export default function DetailPageTabs({
  tabs,
  defaultTabId,
  onChange,
}: DetailPageTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id || "");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="rounded-t-3xl border border-b-0 border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`px-4 sm:px-6 py-4 font-semibold text-sm sm:text-base border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-blue-600 bg-blue-50"
                  : "text-slate-600 border-b-transparent hover:text-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed"
              }`}
            >
              {tab.icon && <span className="inline mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-b-3xl border border-t-0 border-slate-200 bg-white shadow-sm p-6">
        {activeTabContent}
      </div>
    </div>
  );
}
