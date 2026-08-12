import { Html } from "@react-three/drei";

export function FloatingLabel({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <Html position={position} center style={{ pointerEvents: "none" }}>
      <span className="rounded-full border border-[var(--brand)]/30 bg-[var(--panel-strong)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.32em] text-[var(--text)] shadow-[0_10px_30px_rgba(255,122,0,0.12)] backdrop-blur-lg">
        {text}
      </span>
    </Html>
  );
}
