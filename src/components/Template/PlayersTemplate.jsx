"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import Button from "@/components/Module/Button";
import PageHeader from "@/components/Module/PageHeader";
import ListCard from "@/components/Module/ListCard";
import PlayerAvatar from "@/components/Module/PlayerAvatar";
import { PLAYER_ICONS, nextIcon } from "@/lib/avatars";

export default function PlayersTemplate() {
  const { state, setPlayers } = useGame();
  const router = useRouter();
  const players = state.players;

  function update(i, patch) {
    setPlayers(players.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <PageHeader back="/" title="بازیکنان" subtitle="اسم‌ها را بنویسید. حداقل سه نفر." />

      <ListCard>
        {players.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center gap-3 px-4 py-3 ${i === players.length - 1 ? "" : "border-b border-line"}`}
          >
            <button
              type="button"
              onClick={() => update(i, { icon: nextIcon(p.icon) })}
              title="عوض کردن آواتار"
            >
              <PlayerAvatar icon={p.icon} />
            </button>
            <input
              className="min-w-0 flex-1 bg-transparent py-2 text-base font-semibold outline-none"
              value={p.name}
              onChange={(e) => update(i, { name: e.target.value })}
            />
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-paper"
              onClick={() => setPlayers(players.filter((_, idx) => idx !== i))}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        ))}
      </ListCard>

      <div className="mt-3 flex gap-2">
        <Button
          variant="ghost"
          onClick={() =>
            setPlayers([
              ...players,
              {
                id: "p" + Date.now(),
                name: "بازیکن " + (players.length + 1),
                icon: PLAYER_ICONS[players.length % PLAYER_ICONS.length],
              },
            ])
          }
        >
          <i className="fa-solid fa-plus" /> افزودن
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            setPlayers([
              { id: "p1", name: "رضا", icon: "fa-user-tie" },
              { id: "p2", name: "علی", icon: "fa-user-secret" },
              { id: "p3", name: "حسین", icon: "fa-user-shield" },
              { id: "p4", name: "امیر", icon: "fa-user-graduate" },
            ])
          }
        >
          نمونه
        </Button>
      </div>

      <div className="mt-auto pt-6">
        <p className="mb-3 text-center text-sm text-muted fa-num">{players.length} نفر</p>
        <Button disabled={players.length < 3} onClick={() => router.push("/play/categories")}>
          ادامه
        </Button>
      </div>
    </div>
  );
}
