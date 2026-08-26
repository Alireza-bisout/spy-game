"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import { useSound } from "@/lib/SoundContext";
import { narrate } from "@/lib/narrate";
import Button from "@/components/Module/Button";
import ListCard, { ListRow } from "@/components/Module/ListCard";

const ROLE_FA = { spy: "جاسوس", citizen: "شهروند", blank: "سفید" };

export default function ResultTemplate() {
  const { state, samePlayersAgain, resetToHome } = useGame();
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

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <div className="mb-5 rounded-3xl bg-paper-2 p-6 text-center shadow-sm border border-line">
        <p className={`text-sm font-semibold ${spyWin ? "text-spy" : "text-accent"}`}>پایان دست</p>
        <h1 className="mt-1 text-3xl font-extrabold">{spyWin ? "برد جاسوس" : "برد شهروندان"}</h1>
        <p className="mt-4 text-xs text-muted">کلمه</p>
        <p className="text-3xl font-extrabold">{state.word?.fa}</p>
        <p className="mt-4 text-sm leading-7 text-muted">{narrate(state)}</p>
      </div>

      <ListCard>
        {state.players.map((p, i) => (
          <ListRow
            key={p.id}
            last={i === state.players.length - 1}
            icon={<i className={`fa-solid ${p.icon || "fa-user"}`} />}
            title={p.name}
            trailing={
              <span className={`text-sm font-semibold ${state.roles[p.id] === "spy" ? "text-spy" : "text-citizen"}`}>
                {ROLE_FA[state.roles[p.id]]}
              </span>
            }
          />
        ))}
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
