let ctx;
let music = null;

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function envGain(c, start, peak, attack, release) {
  const g = c.createGain();
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(peak, start + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);
  return g;
}

function tone(c, dest, { type, freq, freqTo, t, peak, attack, release }) {
  const o = c.createOscillator();
  const g = envGain(c, t, peak, attack, release);
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (freqTo) o.frequency.exponentialRampToValueAtTime(Math.max(40, freqTo), t + attack + release);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + attack + release + 0.02);
}

function kick(c, dest, t) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.frequency.setValueAtTime(140, t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.16);
  g.gain.setValueAtTime(0.22, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + 0.2);
}

function snare(c, dest, t) {
  const bufferSize = c.sampleRate * 0.12;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const src = c.createBufferSource();
  src.buffer = buffer;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1800;
  const g = envGain(c, t, 0.12, 0.002, 0.1);
  src.connect(bp).connect(g).connect(dest);
  src.start(t);
  src.stop(t + 0.12);
}

function hat(c, dest, t, peak = 0.035) {
  const bufferSize = c.sampleRate * 0.04;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7000;
  const g = envGain(c, t, peak, 0.001, 0.04);
  src.connect(hp).connect(g).connect(dest);
  src.start(t);
  src.stop(t + 0.05);
}

export function unlockAudio() {
  return audio();
}

/** ملودی کوتاه ورود. مدت تقریبی به میلی‌ثانیه برمی‌گردد. */
export function playIntroMelody() {
  const c = audio();
  if (!c) return 2200;
  const t = c.currentTime;
  const dest = c.destination;
  const notes = [
    { f: 220, at: 0, dur: 0.28 },
    { f: 261.63, at: 0.22, dur: 0.26 },
    { f: 329.63, at: 0.44, dur: 0.26 },
    { f: 392, at: 0.68, dur: 0.32 },
    { f: 329.63, at: 1.02, dur: 0.22 },
    { f: 440, at: 1.24, dur: 0.42 },
    { f: 523.25, at: 1.68, dur: 0.5 },
  ];
  notes.forEach((n) => {
    tone(c, dest, { type: "triangle", freq: n.f, t: t + n.at, peak: 0.09, attack: 0.02, release: n.dur });
    tone(c, dest, { type: "sine", freq: n.f / 2, t: t + n.at, peak: 0.05, attack: 0.03, release: n.dur + 0.08 });
  });
  kick(c, dest, t);
  kick(c, dest, t + 1.24);
  return 2300;
}

export function playSfx(name, opts = {}) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const dest = c.destination;

  if (name === "tap") tone(c, dest, { type: "triangle", freq: 380, freqTo: 160, t, peak: 0.05, attack: 0.004, release: 0.07 });
  if (name === "toggleOn") {
    tone(c, dest, { type: "sine", freq: 440, freqTo: 660, t, peak: 0.08, attack: 0.012, release: 0.14 });
    tone(c, dest, { type: "triangle", freq: 880, t: t + 0.04, peak: 0.04, attack: 0.01, release: 0.1 });
  }
  if (name === "toggleOff") tone(c, dest, { type: "sine", freq: 520, freqTo: 240, t, peak: 0.07, attack: 0.01, release: 0.16 });
  if (name === "tick") {
    const urgent = !!opts.urgent;
    tone(c, dest, { type: urgent ? "square" : "triangle", freq: urgent ? 980 : 620, t, peak: urgent ? 0.1 : 0.045, attack: 0.001, release: urgent ? 0.07 : 0.04 });
  }
  if (name === "alarm") {
    [0, 0.15, 0.3].forEach((off) => tone(c, dest, { type: "sawtooth", freq: 340, freqTo: 180, t: t + off, peak: 0.11, attack: 0.01, release: 0.12 }));
  }
  if (name === "reveal") tone(c, dest, { type: "sine", freq: 196, freqTo: 392, t, peak: 0.09, attack: 0.05, release: 0.4 });
  if (name === "intro") playIntroMelody();
  if (name === "win") [523, 659, 784].forEach((f, i) => tone(c, dest, { type: "triangle", freq: f, t: t + i * 0.11, peak: 0.08, attack: 0.02, release: 0.28 }));
  if (name === "lose") tone(c, dest, { type: "triangle", freq: 311, freqTo: 98, t, peak: 0.1, attack: 0.04, release: 0.5 });
}

export function startMusic() {
  const c = audio();
  if (!c || music) return;

  const master = c.createGain();
  master.gain.value = 0.16;
  master.connect(c.destination);

  const bpm = 88;
  const beat = 60 / bpm;
  const bar = beat * 4;
  const bass = [110, 110, 130.81, 98];

  function schedule(from) {
    for (let b = 0; b < 4; b++) {
      const t0 = from + b * bar;
      kick(c, master, t0);
      kick(c, master, t0 + beat * 2.5);
      snare(c, master, t0 + beat);
      snare(c, master, t0 + beat * 3);
      for (let h = 0; h < 8; h++) hat(c, master, t0 + h * (beat / 2), h % 2 ? 0.02 : 0.04);
      tone(c, master, {
        type: "sine",
        freq: bass[b],
        t: t0,
        peak: 0.12,
        attack: 0.02,
        release: beat * 1.6,
      });
    }
  }

  const startAt = c.currentTime + 0.05;
  schedule(startAt);
  const id = setInterval(() => {
    if (!ctx) return;
    schedule(ctx.currentTime + 0.08);
  }, bar * 4 * 1000);

  music = { master, id };
}

export function stopMusic() {
  if (!music) return;
  clearInterval(music.id);
  try {
    music.master.disconnect();
  } catch {}
  music = null;
}

export function haptic(ms = 12) {
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms);
}
