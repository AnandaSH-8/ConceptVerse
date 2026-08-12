"use client";

import { Camera, Pause, Play, RotateCcw, RotateCw, StepForward } from "lucide-react";

type SceneControlsProps = {
  isPlaying: boolean;
  autoRotate: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  onResetCamera: () => void;
  onToggleAutoRotate: () => void;
};

export function SceneControls({
  isPlaying,
  autoRotate,
  onTogglePlay,
  onReplay,
  onResetCamera,
  onToggleAutoRotate,
}: SceneControlsProps) {
  const buttonClass =
    "inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--panel-soft)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:border-[var(--brand)]/50 hover:text-[var(--brand)]";

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel-strong)] p-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.12)]">
      <button type="button" onClick={onTogglePlay} className={buttonClass}>
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button type="button" onClick={onReplay} className={buttonClass}>
        <StepForward className="h-4 w-4" />
        Replay
      </button>

      <button type="button" onClick={onResetCamera} className={buttonClass}>
        <Camera className="h-4 w-4" />
        Reset Camera
      </button>

      <button type="button" onClick={onToggleAutoRotate} className={buttonClass}>
        {autoRotate ? <RotateCw className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
        {autoRotate ? "Auto Rotate" : "Manual"}
      </button>
    </div>
  );
}
