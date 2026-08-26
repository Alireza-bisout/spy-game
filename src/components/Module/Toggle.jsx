"use client";

import { useSound } from "@/lib/SoundContext";

export default function Toggle({ on, onChange }) {
  const { play } = useSound();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => {
        play(on ? "toggleOff" : "toggleOn");
        onChange?.();
      }}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-accent" : "bg-line"}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-paper-2 shadow transition ${
          on ? "right-0.5" : "right-[1.35rem]"
        }`}
      />
    </button>
  );
}
