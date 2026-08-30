"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import { useSound } from "@/lib/SoundContext";
import Button from "@/components/Module/Button";

export default function RoleRevealTemplate({ playerId }) {
  const { state, categories, markSeen } = useGame();
  const router = useRouter();
  const { play } = useSound();
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const player = state.players.find((p) => p.id === playerId);

  useEffect(() => {
    if (player && state.seen[player.id]) router.replace("/play/roles");
  }, [player, state.seen, router]);

  if (!player) {
    return (
      <div className="flex flex-col gap-3 pt-10">
        <p>این بازیکن پیدا نشد.</p>
        <Button onClick={() => router.replace("/play/roles")}>بازگشت</Button>
      </div>
    );
  }

  const catName = categories.find((c) => c.id === state.word?.category)?.fa;
  const role = state.roles[player.id];
  let title = "شهروند";
  let word = state.word?.fa || "—";
  let spy = false;
  const spyPartners = state.players.filter(
    (p) => p.id !== player.id && state.roles[p.id] === "spy"
  );
  if (role === "spy") {
    title = "تو جاسوسی";
    spy = true;
    word = "کلمه را نمی‌دانی.";
    if (state.spyDifficulty === "category") word = "دسته: " + catName;
    if (state.spyDifficulty === "near") word = "نزدیک: " + (state.word?.near?.[0] || "—");
  }
  if (role === "blank") {
    title = "سفید";
    word = "هیچ کلمه‌ای نداری";
    spy = true;
  }

  function down() {
    timer.current = setTimeout(() => {
      setOpen(true);
      play("reveal");
    }, 700);
  }
  function up() {
    clearTimeout(timer.current);
  }

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <p className="text-center text-sm text-muted">این صفحه فقط برای {player.name}</p>
      <div className="flex flex-1 flex-col items-center justify-center">
        <button
          type="button"
          onPointerDown={down}
          onPointerUp={up}
          onPointerCancel={up}
          className={`w-full rounded-[2rem] border-2 px-6 py-16 text-center shadow-sm ${
            open
              ? spy
                ? "border-spy bg-[#5b2929]/40"
                : "border-citizen bg-citizen/15"
              : "border-dashed border-line bg-paper-2"
          }`}
        >
          {!open ? (
            <>
              <span className="text-5xl text-accent">
                <i className={`fa-solid ${player.icon || "fa-user"}`} />
              </span>
              <h1 className="mt-5 text-3xl font-extrabold">{player.name}</h1>
              <p className="mt-3 text-muted">انگشت را یک ثانیه نگه دار</p>
              <div className="mx-auto mt-6 h-1.5 w-24 overflow-hidden rounded-full bg-line">
                <div className="h-full w-1/3 rounded-full bg-accent/50" />
              </div>
            </>
          ) : (
            <>
              <p className={`text-sm font-semibold ${spy ? "text-spy" : "text-citizen"}`}>{title}</p>
              {!spy && catName && <p className="mt-3 text-sm text-muted">دسته: {catName}</p>}
              <p className="mt-2 text-4xl font-extrabold leading-snug">{word}</p>
              {role === "spy" && spyPartners.length > 0 && (
                <p className="mt-4 text-base font-semibold text-spy">
                  یار تو: {spyPartners.map((p) => p.name).join("، ")}
                </p>
              )}
            </>
          )}
        </button>
      </div>
      {open ? (
        <Button
          onClick={() => {
            markSeen(player.id);
            router.replace("/play/roles");
          }}
        >
          دیدم
        </Button>
      ) : (
        <Button variant="ghost" onClick={() => router.replace("/play/roles")}>
          انصراف
        </Button>
      )}
    </div>
  );
}
