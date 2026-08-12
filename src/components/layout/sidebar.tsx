import { BookOpenText, Settings, Sparkles, ChevronRight, Globe, Server, Box, Cloud, Database, Cpu, Layers } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";

import type { Chapter } from "@/types";

type SidebarProps = {
  chapters: Chapter[];
};

type Section = {
  id: string;
  label: string;
  icon: ComponentType<Record<string, unknown>>;
  children?: { id: string; title: string; icon?: ComponentType<Record<string, unknown>> }[];
};

const DEFAULT_SECTIONS: Section[] = [
  { id: "introduction", label: "Introduction", icon: BookOpenText },
  {
    id: "networking",
    label: "Networking",
    icon: Globe,
    children: [
      { id: "http", title: "HTTP" },
      { id: "https", title: "HTTPS" },
      { id: "tcp", title: "TCP" },
      { id: "udp", title: "UDP" },
      { id: "dns", title: "DNS" },
      { id: "websocket", title: "WebSocket" },
    ],
  },
  { id: "browser", label: "Browser", icon: Cpu, children: [{ id: "rendering", title: "Rendering" }] },
  { id: "react", label: "React", icon: Layers, children: [{ id: "components", title: "Components" }, { id: "hooks", title: "Hooks" }] },
  { id: "backend", label: "Backend", icon: Server, children: [{ id: "api", title: "APIs" }] },
  { id: "databases", label: "Databases", icon: Database },
  { id: "aws", label: "AWS", icon: Cloud },
  { id: "docker", label: "Docker", icon: Box },
  { id: "kubernetes", label: "Kubernetes", icon: Layers },
  { id: "system-design", label: "System Design", icon: Cpu },
];

export function Sidebar({ chapters }: SidebarProps) {
  // derive initial from localStorage or active chapter
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let nextExpanded: string | null = null;
    try {
      const raw = window.localStorage.getItem("conceptverse-sidebar-expanded");
      if (raw) nextExpanded = raw;
    } catch {
      /* ignore */
    }

    if (!nextExpanded) {
      const active = chapters.find((c) => c.isActive);
      if (active) {
        const parent = DEFAULT_SECTIONS.find((s) => s.children?.some((ch) => ch.id === active.id));
        if (parent) nextExpanded = parent.id;
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpanded(nextExpanded);
  }, [chapters]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (expanded) window.localStorage.setItem("conceptverse-sidebar-expanded", expanded);
      else window.localStorage.removeItem("conceptverse-sidebar-expanded");
    } catch {
      /* ignore */
    }
  }, [expanded]);

  function toggleSection(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <aside className="flex w-full max-w-[340px] flex-col border-r border-[var(--border)] bg-[var(--panel-soft)] px-4 py-6 backdrop-blur-xl overflow-y-auto">
      <div className="mb-6 flex items-center justify-between px-1">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-soft)]">Library</p>
          <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">Docs</h2>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--brand)]/35 bg-[var(--brand-soft)] text-[var(--brand)]">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <nav className="px-1">
        {DEFAULT_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isOpen = expanded === section.id;

          return (
            <div key={section.id} className="mb-1">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-all duration-200 hover:bg-[var(--panel-elevated)] ${
                  isOpen ? "bg-[var(--panel-elevated)]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isOpen ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "bg-[var(--panel-strong)] text-[var(--text-soft)]"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">{section.label}</p>
                  </div>
                </div>

                <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90 text-[var(--brand)]" : "text-[var(--text-soft)]"}`} />
              </button>

              {/* children */}
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: isOpen ? `${(section.children?.length ?? 0) * 48 + 8}px` : "0px", opacity: isOpen ? 1 : 0 }}
              >
                <div className="mt-2 space-y-1 pl-12 pr-3">
                  {section.children?.map((child) => {
                    const isActive = chapters.some((c) => c.id === child.id && c.isActive);
                    return (
                      <button
                        key={child.id}
                        className={`flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left transition-all duration-200 ${
                          isActive
                            ? "bg-[var(--brand-soft)] text-[var(--brand)] border-l-2 border-[var(--brand)]/80 pl-3"
                            : "text-[var(--text-soft)] hover:bg-[var(--panel-elevated)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[13px]">•</span>
                          <span className="text-sm">{child.title}</span>
                        </div>
                        {/* small placeholder for future icons */}
                        <span className="text-xs text-[var(--text-soft)]"> </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto px-1 pt-6 pb-3">
        <button className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-3 py-3 text-left text-[var(--text)] transition hover:border-[var(--brand)]/25 hover:bg-[var(--panel-elevated)]">
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-[var(--text-soft)]" />
            Settings
          </span>
          <span className="text-xs text-[var(--text-soft)]">Soon</span>
        </button>
      </div>
    </aside>
  );
}
