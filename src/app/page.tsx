"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpenCheck, Gauge, Lightbulb, Rocket } from "lucide-react";
import { useState } from "react";

import dynamic from "next/dynamic";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
const EducationScene = dynamic(() => import("@/components/scene/education-scene").then((mod) => mod.EducationScene), { ssr: false });
const SceneControls = dynamic(() => import("@/components/scene/scene-controls").then((mod) => mod.SceneControls), { ssr: false });
import { Chip } from "@/components/ui/chip";
import { InformationTabs } from "@/components/ui/info-tabs";
import { chapters } from "@/data/chapters";
import { useTheme } from "@/hooks/use-theme";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const [resetCameraKey, setResetCameraKey] = useState(0);

  const [activeInfoTab, setActiveInfoTab] = useState<string | undefined>(undefined);

  const tabs = [
    {
      id: "explanation",
      label: "Explanation",
      content: (
        <div className="space-y-4 text-base leading-8 text-[var(--text-soft)]">
          <p>
            The client creates a request package containing the HTTP method, headers, cookies, and body.
            This package represents the intent of the user action, such as fetching, updating, or deleting
            data.
          </p>
          <p>
            TCP then handles the reliable delivery path. It ensures the message is packaged, transmitted,
            and acknowledged before the server processes the payload.
          </p>
          <p>
            Once the server receives the request, it computes the response and sends a new package back on
            the same reliable route.
          </p>
        </div>
      ),
    },
    {
      id: "analogy",
      label: "Real-world Analogy",
      content: (
        <div className="space-y-4 text-base leading-8 text-[var(--text-soft)]">
          <p className="font-medium text-[var(--text)]">Customer → Waiter → Kitchen → Food → Waiter → Customer</p>
          <p>
            The customer is the client, the waiter is the TCP transport layer, and the kitchen is the
            server. HTTP describes what the customer wants, while TCP guarantees the delivery of the order
            with care and reliability.
          </p>
        </div>
      ),
    },
    {
      id: "internals",
      label: "Internals",
      content: (
        <ul className="space-y-3 text-base leading-8 text-[var(--text-soft)]">
          <li>• HTTP expresses intent through verbs such as GET, POST, PUT, and DELETE.</li>
          <li>• TCP ensures reliable packet transport through sequencing, acknowledgements, and retries.</li>
          <li>• HTTP is app-level semantics; TCP is transport-level reliability.</li>
          <li>• The server turns the request into a response payload that flows back to the client.</li>
        </ul>
      ),
    },
    {
      id: "interview",
      label: "Interview Notes",
      content: (
        <div className="space-y-4 text-base leading-8 text-[var(--text-soft)]">
          <p>
            <span className="font-semibold text-[var(--text)]">Q:</span> Why do we need both HTTP and TCP?
          </p>
          <p>
            <span className="font-semibold text-[var(--text)]">A:</span> HTTP defines the request and
            response structure, while TCP handles guaranteed packet delivery.
          </p>
          <p>
            <span className="font-semibold text-[var(--text)]">Q:</span> What happens when packets are lost?
          </p>
          <p>
            <span className="font-semibold text-[var(--text)]">A:</span> TCP retransmits missing packets so
            the application receives complete data.
          </p>
        </div>
      ),
    },
    {
      id: "summary",
      label: "Summary",
      content: (
        <div className="space-y-4 text-base leading-8 text-[var(--text-soft)]">
          <p>
            HTTP and TCP work together: HTTP communicates intent, and TCP ensures the journey is reliable.
            Together, they form the core of the web request lifecycle.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <TopNav theme={theme} onToggleTheme={toggleTheme} />

      <div className="mx-auto flex max-w-[1600px] flex-1 flex-col lg:flex-row">
        <Sidebar chapters={chapters} />

        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Chip>Networking</Chip>
            <Chip>HTTP + TCP</Chip>
          </div>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--brand)]">Chapter 01</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] md:text-5xl">
                HTTP + TCP
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:border-[var(--brand)]/45 hover:text-[var(--brand)]"
              >
                <ArrowRight className="h-4 w-4" />
                Next concept
              </button>
            </div>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[0_25px_70px_rgba(15,23,42,0.12)]"
          >
            <EducationScene
              key={sceneKey}
              isPlaying={isPlaying}
              autoRotate={autoRotate}
              resetSignal={resetCameraKey}
              theme={theme}
            />
            <div className="px-2 pb-2 pt-4">
              <SceneControls
                isPlaying={isPlaying}
                autoRotate={autoRotate}
                onTogglePlay={() => setIsPlaying((value) => !value)}
                onReplay={() => setSceneKey((value) => value + 1)}
                onResetCamera={() => setResetCameraKey((value) => value + 1)}
                onToggleAutoRotate={() => setAutoRotate((value) => !value)}
              />
            </div>
          </motion.section>

          <div className="mt-8">
            <InformationTabs tabs={tabs} activeTabId={activeInfoTab} onChange={(id) => setActiveInfoTab(id)} />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <BookOpenCheck className="h-5 w-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-soft)]">Purpose</p>
              <p className="mt-3 text-lg font-semibold text-[var(--text)]">Deliver intent</p>
            </div>

            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Gauge className="h-5 w-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-soft)]">Reliability</p>
              <p className="mt-3 text-lg font-semibold text-[var(--text)]">Ordered delivery</p>
            </div>

            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Rocket className="h-5 w-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-soft)]">Response</p>
              <p className="mt-3 text-lg font-semibold text-[var(--text)]">Server processing</p>
            </div>

            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Lightbulb className="h-5 w-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-soft)]">Insight</p>
              <p className="mt-3 text-lg font-semibold text-[var(--text)]">Web requests flow</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
