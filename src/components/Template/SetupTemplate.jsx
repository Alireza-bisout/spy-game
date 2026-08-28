"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import { maxSpies } from "@/lib/gameUtils";
import Button from "@/components/Module/Button";
import PageHeader from "@/components/Module/PageHeader";
import ListCard, { ListRow } from "@/components/Module/ListCard";
import Toggle from "@/components/Module/Toggle";

function Stepper({ value, onMinus, onPlus, suffix = "", minusDisabled, plusDisabled }) {
  const btn = (disabled) =>
    `grid h-8 w-8 place-items-center rounded-full ${
      disabled ? "bg-paper text-line opacity-40" : "bg-paper text-muted"
    }`;
  return (
    <div className="flex items-center gap-2">
      <button type="button" disabled={minusDisabled} onClick={onMinus} className={btn(minusDisabled)}>
        −
      </button>
      <span className="fa-num min-w-8 text-center font-semibold">
        {value}
        {suffix}
      </span>
      <button type="button" disabled={plusDisabled} onClick={onPlus} className={btn(plusDisabled)}>
        +
      </button>
    </div>
  );
}

export default function SetupTemplate() {
  const { state, patch, dealRoles } = useGame();
  const router = useRouter();
  const cap = maxSpies(state.players.length);
  const spies = Math.min(Math.max(1, state.spyCount), cap);
  const plusOff = spies >= cap;
  const minusOff = spies <= 1;

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <PageHeader back="/play/categories" title="تنظیمات دست" subtitle="برای مهمانی کلاسیک همین پیش‌فرض‌ها کافی است." />

      <p className="mb-2 px-1 text-xs font-semibold text-muted">نقش‌ها</p>
      <ListCard>
        <ListRow
          icon={<i className="fa-solid fa-user-secret" />}
          title="تعداد جاسوس"
          subtitle={
            cap < 2
              ? "برای ۲ جاسوس حداقل ۵ بازیکن لازم است"
              : state.players.length < 7
                ? "دو جاسوس از ۵ نفر ممکن است؛ با ۷ نفر بهتر جا می‌افتد"
                : "می‌توانی ۱ یا ۲ جاسوس بگذاری"
          }
          trailing={
            <Stepper
              value={spies}
              minusDisabled={minusOff}
              plusDisabled={plusOff}
              onMinus={() => {
                if (minusOff) return;
                patch({ spyCount: spies - 1 });
              }}
              onPlus={() => {
                if (plusOff) return;
                patch({ spyCount: spies + 1 });
              }}
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
              minusDisabled={state.roundsBeforeQuestion <= 1}
              plusDisabled={false}
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
              minusDisabled={state.turnSeconds <= 10}
              plusDisabled={state.turnSeconds >= 60}
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
