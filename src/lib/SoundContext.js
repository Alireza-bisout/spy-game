"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { haptic, playIntroMelody, playSfx, startMusic, stopMusic, unlockAudio } from "./soundEngine";

const KEY = "spy-audio";
const Ctx = createContext(null);

export function SoundProvider({ children }) {
  const [sfx, setSfx] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const [vibrate, setVibrate] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (typeof raw.sfx === "boolean") setSfx(raw.sfx);
      if (typeof raw.music === "boolean") setMusicOn(raw.music);
      if (typeof raw.vibrate === "boolean") setVibrate(raw.vibrate);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ sfx, music: musicOn, vibrate }));
    if (!musicOn) stopMusic();
  }, [sfx, musicOn, vibrate]);

  const play = useCallback(
    (name, opts) => {
      if (sfx) playSfx(name, opts);
      if (vibrate && (name === "tap" || name === "toggleOn" || name === "toggleOff")) haptic(12);
      if (vibrate && name === "alarm") haptic([40, 40, 80]);
      if (vibrate && name === "tick" && opts?.urgent) haptic(8);
    },
    [sfx, vibrate]
  );

  const boot = useCallback(() => {
    unlockAudio();
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    let wait = 2200;
    if (raw.sfx !== false) wait = playIntroMelody() || 2200;
    if (raw.music !== false) {
      window.setTimeout(() => startMusic(), Math.min(400, wait));
    }
    window.setTimeout(() => setUnlocked(true), wait);
  }, []);

  useEffect(() => {
    boot();
  }, [boot]);

  const api = useMemo(
    () => ({
      sfx,
      music: musicOn,
      vibrate,
      unlocked,
      boot,
      setSfx,
      setMusic: (v) => {
        setMusicOn(v);
        if (v) {
          unlockAudio();
          startMusic();
        } else stopMusic();
      },
      setVibrate,
      play,
    }),
    [sfx, musicOn, vibrate, unlocked, play, boot]
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      {!unlocked && (
        <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-5 bg-paper text-ink">
          <span className="spy-pulse overflow-hidden rounded-[1.8rem] shadow-[0_16px_40px_rgba(201,44,60,0.35)]">
            <img src="/logo.png" alt="" width={96} height={96} className="h-24 w-24 object-cover" draggable={false} />
          </span>
          <span className="spy-enter text-3xl font-extrabold tracking-wide">جاسوس</span>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useSound() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSound");
  return v;
}
