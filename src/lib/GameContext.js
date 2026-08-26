"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import categories from "@/data/categories.json";
import words from "@/data/words.json";
import { pickWord, shuffle } from "./gameUtils";

const STORAGE = "spy-game-v1";

const defaultState = {
  players: [
    { id: "p1", name: "رضا", icon: "fa-user-tie" },
    { id: "p2", name: "علی", icon: "fa-user-secret" },
    { id: "p3", name: "حسین", icon: "fa-user-shield" },
    { id: "p4", name: "امیر", icon: "fa-user-graduate" },
  ],
  enabledCategories: categories.map((c) => c.id),
  spyCount: 1,
  blankOn: false,
  roundsBeforeQuestion: 3,
  turnSeconds: 20,
  spyDifficulty: "none",
  word: null,
  roles: {},
  seen: {},
  round: 1,
  turnIndex: 0,
  suspicion: {},
  log: [],
  phase: "home",
  winner: null,
  question: null,
  historyWords: [],
};

const Ctx = createContext(null);

function deal(s) {
  const word = pickWord(words, s.enabledCategories, s.historyWords);
  const n = s.players.length;
  const spyCount = Math.min(s.spyCount, Math.max(1, n - 1));
  const order = shuffle(s.players.map((_, i) => i));
  const roles = {};
  order.forEach((idx, i) => {
    const id = s.players[idx].id;
    if (i < spyCount) roles[id] = "spy";
    else if (s.blankOn && i === spyCount) roles[id] = "blank";
    else roles[id] = "citizen";
  });
  const suspicion = {};
  s.players.forEach((p) => (suspicion[p.id] = 0));
  return {
    ...s,
    word,
    roles,
    seen: {},
    round: 1,
    turnIndex: 0,
    suspicion,
    log: [],
    phase: "roles",
    winner: null,
    question: null,
  };
}

export function GameProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const api = useMemo(() => {
    const patch = (p) => setState((s) => ({ ...s, ...p }));
    return {
      state,
      categories,
      words,
      patch,
      setPlayers: (players) => patch({ players }),
      toggleCategory: (id) =>
        setState((s) => {
          const has = s.enabledCategories.includes(id);
          return {
            ...s,
            enabledCategories: has
              ? s.enabledCategories.filter((x) => x !== id)
              : [...s.enabledCategories, id],
          };
        }),
      dealRoles: () => setState(deal),
      markSeen: (id) => setState((s) => ({ ...s, seen: { ...s.seen, [id]: true } })),
      startTable: () => patch({ phase: "table" }),
      nextTurn: (opts = {}) =>
        setState((s) => {
          const pid = s.players[s.turnIndex]?.id;
          const log = opts.burned
            ? [...s.log, { type: "burn", playerId: pid }]
            : [...s.log, { type: "clue", playerId: pid }];
          let turnIndex = s.turnIndex + 1;
          let round = s.round;
          if (turnIndex >= s.players.length) {
            turnIndex = 0;
            round += 1;
          }
          return { ...s, turnIndex, round, log };
        }),
      addSuspicion: (id) =>
        setState((s) => ({
          ...s,
          suspicion: { ...s.suspicion, [id]: Math.min(5, (s.suspicion[id] || 0) + 1) },
        })),
      setQuestion: (question) =>
        setState((s) => ({
          ...s,
          question,
          log: [...s.log, { type: "question", ...question }],
        })),
      guess: (wordId) =>
        setState((s) => {
          const ok = s.word && s.word.id === wordId;
          return {
            ...s,
            phase: "result",
            winner: ok ? "spy" : "citizens",
            log: [...s.log, { type: "guess", wordId, ok }],
            historyWords: s.word ? [...s.historyWords, s.word.id].slice(-20) : s.historyWords,
          };
        }),
      exile: (id) =>
        setState((s) => {
          const role = s.roles[id];
          return {
            ...s,
            phase: "result",
            winner: role === "spy" ? "citizens" : "spy",
            log: [...s.log, { type: "exile", id, role }],
            historyWords: s.word ? [...s.historyWords, s.word.id].slice(-20) : s.historyWords,
          };
        }),
      samePlayersAgain: () => setState(deal),
      resetToHome: () => patch({ phase: "home", winner: null }),
    };
  }, [state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useGame() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useGame outside provider");
  return v;
}
