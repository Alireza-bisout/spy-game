"use client";

import { useSound } from "@/lib/SoundContext";

export default function Button({ children, variant = "primary", className = "", onClick, ...props }) {
  const { play } = useSound();
  const styles = {
    primary: "bg-accent text-accent-ink shadow-sm hover:bg-accent-2",
    ghost: "bg-paper-2 text-ink border border-line hover:opacity-90",
    danger: "bg-spy text-white",
  };
  return (
    <button
      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant] || styles.primary} ${className}`}
      onClick={(e) => {
        play("tap");
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
