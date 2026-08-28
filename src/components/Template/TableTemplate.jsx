"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import { useSound } from "@/lib/SoundContext";
import Button from "@/components/Module/Button";
import ListCard, { ListRow } from "@/components/Module/ListCard";
import Sheet from "@/components/Module/Sheet";

export default function TableTemplate() {
  const { state, words, categories, nextTurn, addSuspicion, exile, guess, setQuestion } = useGame();
  const router = useRouter();
  const { play } = useSound();
  const [left, setLeft] = useState(state.turnSeconds);
  const [guessOpen, setGuessOpen] = useState(false);
  const [qOpen, setQOpen] = useState(false);
  const [qStep, setQStep] = useState(1);
  const [votePhase, setVotePhase] = useState(null);
  const [announce, setAnnounce] = useState(null);
  const [q, setQ] = useState({ asker: "", target: "", a: "", b: "" });
  const [filter, setFilter] = useState("");
  const burned = useRef(false);
  const skippedTick = useRef(true);

  const exiled = state.exiled || {};
  const alive = state.players.filter((p) => !exiled[p.id]);
  const current = state.players[state.turnIndex];
  const pool = words.filter((w) => state.enabledCategories.includes(w.category));
  const questionPhase = state.round > state.roundsBeforeQuestion;
  const hot = alive.filter((p) => (state.suspicion[p.id] || 0) >= 3);
  const near = state.word?.near || [];

  useEffect(() => {
    burned.current = false;
    skippedTick.current = true;
    setLeft(state.turnSeconds);
    const t = setInterval(() => setLeft((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, [state.turnIndex, state.round, state.turnSeconds]);

  useEffect(() => {
    if (state.phase === "result" && votePhase !== "announce") router.push("/play/result");
  }, [state.phase, votePhase, router]);

  useEffect(() => {
    if (left === 0 && !burned.current && current) {
      burned.current = true;
      play("alarm");
      nextTurn({ burned: true });
      return;
    }
    if (skippedTick.current) {
      skippedTick.current = false;
      return;
    }
    if (left > 0) play("tick", { urgent: left <= 5 });
  }, [left, play, current, nextTurn]);

  if (!current) {
    return (
      <div className="flex flex-col gap-3 pt-8">
        <p className="text-muted">بازی پیدا نشد. از خانه دوباره شروع کنید.</p>
        <Button onClick={() => router.push("/")}>خانه</Button>
      </div>
    );
  }

  function confirmExile(id) {
    const p = state.players.find((x) => x.id === id);
    const role = state.roles[id];
    setAnnounce({ name: p?.name || "بازیکن", role });
    setVotePhase("announce");
    play("reveal");
    exile(id);
  }

  function closeAnnounce() {
    setVotePhase(null);
    setAnnounce(null);
    if (state.phase === "result") router.push("/play/result");
  }

  function openQuestion() {
    setQ({
      asker: current.id,
      target: alive.find((p) => p.id !== current.id)?.id || "",
      a: near[0] || "",
      b: near[1] || "",
    });
    setQStep(1);
    setQOpen(true);
  }

  const asker = state.players.find((p) => p.id === q.asker);
  const target = state.players.find((p) => p.id === q.target);

  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col gap-4">
      <div className="flex items-center justify-between rounded-3xl border border-line bg-paper-2 px-4 py-3">
        <div>
          <p className="text-xs text-muted">نوبت</p>
          <p className="font-extrabold">
            <i className={`fa-solid ${current.icon || "fa-user"} ml-1`} /> {current.name}
          </p>
        </div>
        <div className="text-left">
          <p className="text-xs text-muted">زمان</p>
          <p className={`fa-num text-2xl font-extrabold ${left <= 5 ? "text-spy" : "text-accent"}`}>
            {String(left).padStart(2, "0")}
          </p>
        </div>
        <div className="text-left">
          <p className="text-xs text-muted">دور</p>
          <p className="fa-num font-bold">
            {Math.min(state.round, state.roundsBeforeQuestion)}/{state.roundsBeforeQuestion}
          </p>
        </div>
      </div>

      {questionPhase && (
        <div className="rounded-2xl border border-accent/40 bg-paper-2 px-4 py-3 text-sm">
          فاز سوال فعال است. از کسی که شک دارید دو گزینه بپرسید.
        </div>
      )}

      <ListCard>
        {alive.map((p, i) => {
          const sus = state.suspicion[p.id] || 0;
          const idx = state.players.findIndex((x) => x.id === p.id);
          return (
            <ListRow
              key={p.id}
              last={i === alive.length - 1}
              icon={<i className={`fa-solid ${p.icon || "fa-user"}`} />}
              title={p.name}
              subtitle={idx === state.turnIndex ? "در حال اشاره" : sus >= 3 ? "سوءظن بالا" : "منتظر"}
              trailing={
                <button
                  type="button"
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    sus >= 3 ? "bg-spy/15 text-spy" : "bg-paper text-muted"
                  }`}
                  onClick={() => addSuspicion(p.id)}
                >
                  شک {sus}
                </button>
              }
            />
          );
        })}
      </ListCard>

      {hot.length > 0 && (
        <button
          type="button"
          className="text-sm font-semibold text-spy"
          onClick={() => setVotePhase("pick")}
        >
          پیشنهاد اخراج: {hot.map((p) => p.name).join("، ")}
        </button>
      )}

      {(() => {
        const qs = (state.log || []).filter((e) => e.type === "question").slice().reverse();
        if (!qs.length) return null;
        const nameOf = (id) => state.players.find((p) => p.id === id)?.name || "کسی";
        return (
          <div className="rounded-3xl border border-line bg-paper-2 px-4 py-3">
            <p className="mb-2 text-xs font-semibold text-muted">تاریخچه سوالات</p>
            <div className="flex max-h-40 flex-col gap-2 overflow-auto">
              {qs.map((item, i) => (
                <p key={i} className={`text-sm leading-7 ${i === 0 ? "font-semibold" : "text-muted"}`}>
                  {nameOf(item.asker)} از {nameOf(item.target)} پرسید: {item.a} یا {item.b} →{" "}
                  <strong className="text-ink">{item.answer}</strong>
                </p>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="mt-auto flex flex-col gap-2">
        <Button onClick={() => nextTurn()}>اشاره گفته شد</Button>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="ghost" className="px-2 text-sm" onClick={openQuestion}>
            سوال
          </Button>
          <Button variant="ghost" className="px-2 text-sm" onClick={() => setVotePhase("pick")}>
            اخراج
          </Button>
          <Button variant="danger" className="px-2 text-sm" onClick={() => setGuessOpen(true)}>
            حدس
          </Button>
        </div>
      </div>

      <Sheet open={guessOpen} onClose={() => setGuessOpen(false)} title="حدس جاسوس">
        <p className="text-sm text-muted">گوشی را به جاسوس بدهید. حدس اشتباه بازی را به شهروندان می‌دهد.</p>
        <input
          className="rounded-2xl border border-line bg-paper px-3 py-3"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="جستجوی کلمه"
        />
        <div className="flex max-h-60 flex-col gap-1 overflow-auto">
          {pool
            .filter((w) => w.fa.includes(filter))
            .map((w) => (
              <Button key={w.id} variant="ghost" onClick={() => guess(w.id)}>
                {w.fa}
                <span className="text-muted"> · {categories.find((c) => c.id === w.category)?.fa}</span>
              </Button>
            ))}
        </div>
      </Sheet>

      <Sheet
        open={qOpen}
        onClose={() => setQOpen(false)}
        title={qStep === 1 ? "سوال دوگزینه‌ای" : `گوشی را به ${target?.name || "متهم"} بده`}
      >
        {qStep === 1 ? (
          <>
            <p className="text-xs text-muted">پرسنده</p>
            <div className="flex flex-wrap gap-2">
              {alive.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setQ({ ...q, asker: p.id })}
                  className={`rounded-full px-3 py-1 text-sm ${q.asker === p.id ? "bg-accent text-accent-ink" : "bg-paper"}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted">متهم</p>
            <div className="flex flex-wrap gap-2">
              {alive.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setQ({ ...q, target: p.id })}
                  className={`rounded-full px-3 py-1 text-sm ${q.target === p.id ? "bg-accent text-accent-ink" : "bg-paper"}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            {near.length > 0 && (
              <p className="text-xs text-muted">پیشنهاد نزدیک به فضای بازی (لو ندهید اگر بقیه می‌بینند)</p>
            )}
            <div className="flex flex-wrap gap-2">
              {near.map((n) => (
                <button
                  key={n}
                  type="button"
                  className="rounded-full bg-paper px-3 py-1 text-sm"
                  onClick={() => setQ((prev) => ({ ...prev, a: prev.a ? prev.a : n, b: prev.a && !prev.b ? n : prev.b }))}
                >
                  {n}
                </button>
              ))}
            </div>
            <input className="rounded-2xl border border-line bg-paper px-3 py-3" placeholder="گزینه آ" value={q.a} onChange={(e) => setQ({ ...q, a: e.target.value })} />
            <input className="rounded-2xl border border-line bg-paper px-3 py-3" placeholder="گزینه ب" value={q.b} onChange={(e) => setQ({ ...q, b: e.target.value })} />
            <Button disabled={!q.asker || !q.target || !q.a || !q.b || q.asker === q.target} onClick={() => setQStep(2)}>
              نشان دادن به {target?.name || "متهم"}
            </Button>
          </>
        ) : (
          <>
            <p className="text-center text-sm text-muted">
              {asker?.name} می‌پرسد. فقط {target?.name} جواب بدهد.
            </p>
            <Button
              className="py-5 text-lg"
              onClick={() => {
                setQuestion({ ...q, answer: q.a });
                setQOpen(false);
                setQStep(1);
              }}
            >
              {q.a}
            </Button>
            <Button
              variant="ghost"
              className="py-5 text-lg"
              onClick={() => {
                setQuestion({ ...q, answer: q.b });
                setQOpen(false);
                setQStep(1);
              }}
            >
              {q.b}
            </Button>
          </>
        )}
      </Sheet>

      <Sheet open={votePhase === "pick"} onClose={() => setVotePhase(null)} title="چه کسی اخراج شود؟">
        <p className="text-sm text-muted">اسم را بزن. بعد نقشش جدا اعلام می‌شود.</p>
        {alive.map((p) => (
          <Button key={p.id} variant="danger" onClick={() => confirmExile(p.id)}>
            <i className={`fa-solid ${p.icon || "fa-user"} ml-1`} /> {p.name}
            {(state.suspicion[p.id] || 0) >= 3 ? " · سوءظن بالا" : ""}
          </Button>
        ))}
      </Sheet>

      <Sheet open={votePhase === "announce"} onClose={closeAnnounce} title="نتیجه اخراج">
        {announce && (
          <>
            <p className="text-center text-sm text-muted">از میز خارج شد</p>
            <p className="mt-1 text-center text-3xl font-extrabold">{announce.name}</p>
            <p
              className={`mt-4 text-center text-2xl font-extrabold ${
                announce.role === "spy" ? "text-spy" : "text-citizen"
              }`}
            >
              {announce.role === "spy" ? "جاسوس بود" : announce.role === "blank" ? "سفید بود" : "شهروند بود"}
            </p>
            <Button className="mt-4" onClick={closeAnnounce}>
              {state.phase === "result" ? "دیدن نتیجه دست" : "ادامه بازی"}
            </Button>
          </>
        )}
      </Sheet>
    </div>
  );
}
