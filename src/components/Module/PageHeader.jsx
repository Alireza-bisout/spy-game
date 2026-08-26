"use client";

import { useRouter } from "next/navigation";
import { useSound } from "@/lib/SoundContext";

export default function PageHeader({ title, subtitle, back }) {
  const router = useRouter();
  const { play } = useSound();
  return (
    <header className="mb-5">
      {back && (
        <button
          type="button"
          onClick={() => {
            play("tap");
            router.push(back);
          }}
          className="mb-3 flex items-center gap-2 text-sm text-muted"
        >
          <i className="fa-solid fa-arrow-right" />
          بازگشت
        </button>
      )}
      <h1 className="text-[1.65rem] font-extrabold leading-snug">{title}</h1>
      {subtitle && <p className="mt-1 text-sm leading-7 text-muted">{subtitle}</p>}
    </header>
  );
}
