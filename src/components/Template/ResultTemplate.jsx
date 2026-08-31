"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import { useSound } from "@/lib/SoundContext";
import Button from "@/components/Module/Button";
import ListCard, { ListRow } from "@/components/Module/ListCard";

const ROLE_FA = { spy: "جاسوس", citizen: "شهروند", blank: "سفید" };

function endReason(state) {
  const name = (id) => state.players.find((p) => p.id === id)?.name || "کسی";
  const log = state.log || [];
  const guess = [...log].reverse().find((e) => e.type === "guess");
  if (guess) {
    return guess.ok ? "جاسوس کلمه را درست حدس زد." : "حدس جاسوس اشتباه بود.";
  }
  const lastExile = [...log].reverse().find((e) => e.type === "exile");
  if (lastExile && state.winner === "citizens") {
    return `${name(lastExile.id)} جاسوس بود و اخراج شد.`;
  }
  if (lastExile && state.winner === "spy") {
    return "دو شهروند به اشتباه اخراج شدند.";
  }
  return "دست به پایان رسید.";
}

export default function ResultTemplate() {
  const { state, categories, samePlayersAgain, resetToHome } = useGame();
  const router = useRouter();
  const { play } = useSound();

  useEffect(() => {
    if (!state.winner) return;
    const stats = JSON.parse(localStorage.getItem("spy-stats") || '{"spy":0,"citizens":0}');
    stats[state.winner] = (stats[state.winner] || 0) + 1;
    localStorage.setItem("spy-stats", JSON.stringify(stats));
    play(state.winner === "spy" ? "lose" : "win");
  }, [state.winner, play]);

  const spyWin = state.winner === "spy";
  const catName = categories.find((c) => c.id === state.word?.category)?.fa;
  const spies = state.players.filter((p) => state.roles[p.id] === "spy");
  const exiledIds = Object.keys(state.exiled || {});
  const questions = (state.log || []).filter((e) => e.type === "question").length;

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col gap-3">
      <div
        className={`w-full rounded-2xl border px-4 py-5 text-center ${
          spyWin ? "border-spy/40 bg-[#5b2929]/25" : "border-citizen/40 bg-citizen/10"
        }`}
      >
        <p className={`text-xs font-semibold ${spyWin ? "text-spy" : "text-citizen"}`}>پایان دست</p>
        <h1 className={`mt-1 text-[1.85rem] font-extrabold leading-tight ${spyWin ? "text-spy" : "text-citizen"}`}>
          {spyWin ? "برد جاسوس" : "برد شهروندان"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">{endReason(state)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-paper-2 px-3 py-6 text-center">
          <p className="text-[11px] text-muted">کلمهٔ این دست</p>
          <p className="mt-2 text-lg font-extrabold leading-snug">{state.word?.fa}</p>
          {catName && <p className="mt-2 text-xs text-muted">دسته: {catName}</p>}
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-paper-2 px-3 py-6 text-center">
          <p className="text-[11px] text-muted">جاسوس{spies.length > 1 ? "‌ها" : ""}</p>
          <p className="mt-2 text-lg font-extrabold leading-snug text-spy">
            {spies.map((p) => p.name).join("، ") || "—"}
          </p>
          <p className="mt-2 fa-num text-xs text-muted">
            {state.round} دور · {questions} سوال · {exiledIds.length} اخراج
          </p>
        </div>
      </div>

      <ListCard>
        {state.players.map((p, i) => {
          const out = Boolean(state.exiled?.[p.id]);
          return (
            <ListRow
              key={p.id}
              last={i === state.players.length - 1}
              icon={<i className={`fa-duotone ${p.icon || "fa-user"}`} />}
              title={p.name}
              subtitle={out ? "اخراج‌شده" : undefined}
              trailing={
                <span
                  className={`text-sm font-semibold ${
                    state.roles[p.id] === "spy" ? "text-spy" : "text-citizen"
                  }`}
                >
                  {ROLE_FA[state.roles[p.id]]}
                </span>
              }
            />
          );
        })}
      </ListCard>

      <div className="mt-auto flex flex-col gap-2 pt-6">
        <Button
          onClick={() => {
            samePlayersAgain();
            router.push("/play/roles");
          }}
        >
          دست بعد همین نفرات
        </Button>
        <Button variant="ghost" onClick={() => router.push("/play/categories")}>
          تغییر دسته
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            resetToHome();
            router.push("/");
          }}
        >
          خانه
        </Button>
      </div>
    </div>
  );
}
