"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import Button from "@/components/Module/Button";
import PageHeader from "@/components/Module/PageHeader";
import ListCard, { ListRow } from "@/components/Module/ListCard";

export default function RolesTemplate() {
  const { state, startTable } = useGame();
  const router = useRouter();
  const remaining = state.players.filter((p) => !state.seen[p.id]);
  const seenCount = state.players.length - remaining.length;

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <PageHeader
        title="پردهٔ نقش‌ها"
        subtitle="فقط اسم خودت را بزن. گوشی را به نفر بعد بده. دیده شده‌ها از لیست حذف می‌شوند."
      />

      {remaining.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-accent bg-paper-2 p-8 text-center">
          <i className="fa-solid fa-check text-2xl text-accent" />
          <p className="mt-3 font-semibold">همه نقش‌شان را دیدند</p>
          <p className="mt-1 text-sm text-muted">گوشی را وسط میز بگذارید و شروع کنید.</p>
        </div>
      ) : (
        <ListCard>
          {remaining.map((p, i) => (
            <ListRow
              key={p.id}
              last={i === remaining.length - 1}
              icon={<i className={`fa-solid ${p.icon || "fa-user"}`} />}
              title={p.name}
              subtitle="بزن تا صفحهٔ خودت باز شود"
              onClick={() => router.replace("/play/roles/reveal?id=" + p.id)}
              trailing={<i className="fa-solid fa-chevron-left text-xs text-muted" />}
            />
          ))}
        </ListCard>
      )}

      <p className="mt-4 text-center text-sm text-muted fa-num">
        {seenCount} از {state.players.length} دیدند
      </p>

      <div className="mt-auto pt-6">
        <Button
          disabled={remaining.length > 0}
          onClick={() => {
            startTable();
            router.replace("/play/table");
          }}
        >
          شروع میز
        </Button>
      </div>
    </div>
  );
}
