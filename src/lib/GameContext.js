"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import categories from "@/data/categories.json";
import words from "@/data/words.json";
import { maxSpies, pickWord, shuffle } from "./gameUtils";

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
  exiled: {},
  lastExile: null,
};

const Ctx = createContext(null);

function deal(s) {
  const word = pickWord(words, s.enabledCategories, s.historyWords);
  const n = s.players.length;
  const spyCount = Math.min(Math.max(1, s.spyCount), maxSpies(n));
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
    exiled: {},
    lastExile: null,
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
          const n = s.players.length;
          let turnIndex = s.turnIndex;
          let round = s.round;
          let guard = 0;
          do {
            turnIndex += 1;
            if (turnIndex >= n) {
              turnIndex = 0;
              round += 1;
            }
            guard += 1;
          } while (s.exiled?.[s.players[turnIndex]?.id] && guard <= n + 1);
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
          if (s.exiled?.[id]) return s;
          const role = s.roles[id];
          const exiled = { ...(s.exiled || {}), [id]: role };
          const log = [...s.log, { type: "exile", id, role }];
          const hist = s.word ? [...s.historyWords, s.word.id].slice(-20) : s.historyWords;
          const spiesLeft = s.players.filter((p) => !exiled[p.id] && s.roles[p.id] === "spy").length;
          const citizensExiled = Object.values(exiled).filter((r) => r !== "spy").length;
          if (spiesLeft === 0) {
            return { ...s, exiled, log, lastExile: { id, role }, phase: "result", winner: "citizens", historyWords: hist };
          }
          if (citizensExiled >= 2) {
            return { ...s, exiled, log, lastExile: { id, role }, phase: "result", winner: "spy", historyWords: hist };
          }
          const n = s.players.length;
          let turnIndex = s.turnIndex;
          if (s.players[turnIndex]?.id === id || exiled[s.players[turnIndex]?.id]) {
            let guard = 0;
            do {
              turnIndex = (turnIndex + 1) % n;
              guard += 1;
            } while (exiled[s.players[turnIndex]?.id] && guard <= n);
          }
          return { ...s, exiled, log, lastExile: { id, role }, turnIndex };
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
