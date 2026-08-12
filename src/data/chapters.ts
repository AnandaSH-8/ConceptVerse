import type { Chapter } from "@/types";

export const chapters: Chapter[] = [
  {
    id: "http",
    title: "HTTP Requests",
    category: "Networking",
    duration: "12 min",
    progress: 82,
    isActive: true,
  },
  {
    id: "tcp",
    title: "TCP Handshakes",
    category: "Transport",
    duration: "10 min",
    progress: 64,
  },
  {
    id: "dns",
    title: "DNS Resolution",
    category: "Infrastructure",
    duration: "8 min",
    progress: 41,
  },
  {
    id: "browser",
    title: "Browser Rendering",
    category: "Frontend",
    duration: "15 min",
    progress: 26,
  },
  {
    id: "react",
    title: "React Reconciliation",
    category: "UI",
    duration: "18 min",
    progress: 12,
  },
];
