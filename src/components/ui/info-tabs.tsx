"use client";

import { useState } from "react";

type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type InformationTabsProps = {
  tabs: TabItem[];
  // optional controlled props
  activeTabId?: string;
  onChange?: (id: string) => void;
};

export function InformationTabs({ tabs, activeTabId, onChange }: InformationTabsProps) {
  const [internalActive, setInternalActive] = useState<string>(tabs[0]?.id ?? "");

  // if controlled
  const activeTab = activeTabId ?? internalActive;


  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  function handleClick(id: string) {
    if (onChange) onChange(id);
    else setInternalActive(id);
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--panel)] shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] bg-[var(--panel-soft)] p-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleClick(tab.id)}
            className={`rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[var(--brand)] text-[var(--button-text)] shadow-[0_12px_30px_rgba(255,122,0,0.28)]"
                : "text-[var(--text-soft)] hover:bg-[var(--panel-elevated)] hover:text-[var(--text)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-6">{currentTab?.content}</div>
    </div>
  );
}
