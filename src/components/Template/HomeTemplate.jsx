"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import { useTheme } from "@/lib/ThemeContext";
import Button from "@/components/Module/Button";
import ListCard, { ListRow } from "@/components/Module/ListCard";

export default function HomeTemplate() {
  const { state } = useGame();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const canResume = state.phase === "roles" || state.phase === "table";
  const dark = theme === "dark";

  return (
    <div className="spy-enter flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setTheme(dark ? "light" : "dark")}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-paper-2 text-accent"
          aria-label="تغییر تم"
        >
          <i className={`fa-solid ${dark ? "fa-sun" : "fa-moon"}`} />
        </button>
      </div>
      <header className="pb-6 pt-4 text-center">
        <div className="mx-auto mb-5 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-[1.6rem] bg-accent text-accent-ink shadow-[0_12px_30px_var(--glow)]">
          <i className="fa-solid fa-user-secret text-3xl" />
        </div>
        <p className="text-xs font-semibold tracking-[0.35em] text-accent">SPY</p>
        <h1 className="mt-1 text-[2.4rem] font-extrabold">جاسوس</h1>
        <p className="mt-2 text-muted">یک گوشی. چند بازیکن. یک خائن.</p>
      </header>

      <div className="mt-2 flex flex-col gap-3">
        <Link href="/play/players">
          <Button className="py-4 text-base">
            <i className="fa-solid fa-play" /> شروع بازی جدید
          </Button>
        </Link>
        {canResume && (
          <Link href={state.phase === "roles" ? "/play/roles" : "/play/table"}>
            <Button variant="ghost">ادامه دست ناتمام</Button>
          </Link>
        )}
      </div>

      <ListCard className="mt-6">
        <ListRow
          onClick={() => router.push("/guide")}
          icon={<i className="fa-solid fa-circle-info" />}
          title="راهنما"
          subtitle="نقش سفید، سوال، حدس و اخراج"
          trailing={<i className="fa-solid fa-chevron-left text-xs text-muted" />}
        />
        <ListRow
          onClick={() => router.push("/rules")}
          icon={<i className="fa-solid fa-book" />}
          title="قوانین"
          subtitle="سه دقیقه تا شروع مهمانی"
          trailing={<i className="fa-solid fa-chevron-left text-xs text-muted" />}
        />
        <ListRow
          onClick={() => router.push("/stats")}
          icon={<i className="fa-solid fa-chart-simple" />}
          title="آمارها"
          trailing={<i className="fa-solid fa-chevron-left text-xs text-muted" />}
        />
        <ListRow
          last
          onClick={() => router.push("/settings")}
          icon={<i className="fa-solid fa-gear" />}
          title="تنظیمات"
          trailing={<i className="fa-solid fa-chevron-left text-xs text-muted" />}
        />
      </ListCard>
      <div className="mt-auto pt-8" />
    </div>
  );
}
