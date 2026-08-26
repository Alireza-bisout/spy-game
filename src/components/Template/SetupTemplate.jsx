"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import Button from "@/components/Module/Button";
import PageHeader from "@/components/Module/PageHeader";
import ListCard, { ListRow } from "@/components/Module/ListCard";
import Toggle from "@/components/Module/Toggle";

function Stepper({ value, onMinus, onPlus, suffix = "" }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onMinus} className="grid h-8 w-8 place-items-center rounded-full bg-paper text-muted">
        −
      </button>
      <span className="fa-num min-w-8 text-center font-semibold">{value}{suffix}</span>
      <button type="button" onClick={onPlus} className="grid h-8 w-8 place-items-center rounded-full bg-paper text-muted">
        +
      </button>
    </div>
  );
}

export default function SetupTemplate() {
  const { state, patch, dealRoles } = useGame();
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <PageHeader back="/play/categories" title="تنظیمات دست" subtitle="برای مهمانی کلاسیک همین پیش‌فرض‌ها کافی است." />

      <p className="mb-2 px-1 text-xs font-semibold text-muted">نقش‌ها</p>
      <ListCard>
        <ListRow
          icon={<i className="fa-solid fa-user-secret" />}
          title="تعداد جاسوس"
          trailing={
            <Stepper
              value={state.spyCount}
              onMinus={() => patch({ spyCount: Math.max(1, state.spyCount - 1) })}
              onPlus={() =>
                patch({ spyCount: Math.min(state.players.length >= 8 ? 2 : 1, state.spyCount + 1) })
              }
            />
          }
        />
        <ListRow
          last
          icon={<i className="fa-solid fa-ghost" />}
          title="نقش سفید"
          subtitle="هیچ کلمه‌ای نمی‌بیند"
          trailing={<Toggle on={state.blankOn} onChange={() => patch({ blankOn: !state.blankOn })} />}
        />
      </ListCard>

      <p className="mb-2 mt-5 px-1 text-xs font-semibold text-muted">زمان و دور</p>
      <ListCard>
        <ListRow
          icon={<i className="fa-solid fa-rotate" />}
          title="دور قبل از سوال"
          trailing={
            <Stepper
              value={state.roundsBeforeQuestion}
              onMinus={() => patch({ roundsBeforeQuestion: Math.max(1, state.roundsBeforeQuestion - 1) })}
              onPlus={() => patch({ roundsBeforeQuestion: state.roundsBeforeQuestion + 1 })}
            />
          }
        />
        <ListRow
          last
          icon={<i className="fa-solid fa-clock" />}
          title="زمان هر اشاره"
          trailing={
            <Stepper
              value={state.turnSeconds}
              suffix="ث"
              onMinus={() => patch({ turnSeconds: Math.max(10, state.turnSeconds - 5) })}
              onPlus={() => patch({ turnSeconds: Math.min(60, state.turnSeconds + 5) })}
            />
          }
        />
      </ListCard>

      <p className="mb-2 mt-5 px-1 text-xs font-semibold text-muted">سختی جاسوس</p>
      <ListCard>
        {[
          ["none", "هیچ سرنخ", "سخت"],
          ["category", "فقط دسته", "متوسط"],
          ["near", "کلمه نزدیک", "آسان"],
        ].map(([id, title, sub], i, arr) => (
          <ListRow
            key={id}
            last={i === arr.length - 1}
            title={title}
            subtitle={sub}
            onClick={() => patch({ spyDifficulty: id })}
            trailing={
              state.spyDifficulty === id ? (
                <i className="fa-solid fa-circle-check text-accent" />
              ) : (
                <i className="fa-regular fa-circle text-line" />
              )
            }
          />
        ))}
      </ListCard>

      <div className="mt-auto pt-6">
        <Button
          onClick={() => {
            dealRoles();
            router.push("/play/roles");
          }}
        >
          رفتن به پردهٔ نقش‌ها
        </Button>
      </div>
    </div>
  );
}
