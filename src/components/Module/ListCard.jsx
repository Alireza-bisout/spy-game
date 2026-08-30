"use client";

import { useSound } from "@/lib/SoundContext";

export default function ListCard({ children, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-line bg-paper-2 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function ListRow({ icon, title, subtitle, trailing, onClick, last, dimmed }) {
  const { play } = useSound();
  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={
        onClick
          ? () => {
              play("tap");
              onClick();
            }
          : undefined
      }
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-right ${
        onClick ? "hover:bg-paper active:scale-[0.99]" : ""
      } ${last ? "" : "border-b border-line"} ${dimmed ? "opacity-40" : ""}`}
    >
      {icon && (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-paper text-accent">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`block font-semibold ${dimmed ? "line-through" : ""}`}>{title}</span>
        {subtitle && <span className="fa-num mt-0.5 block text-xs text-muted">{subtitle}</span>}
      </span>
      {trailing}
    </div>
  );
}
