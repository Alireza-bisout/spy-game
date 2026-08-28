export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** حداقل ۲ غیرجاسوس؛ از ۵ نفر به بعد حداکثر ۲ جاسوس. */
export function maxSpies(playerCount) {
  const n = playerCount || 0;
  if (n < 5) return 1;
  return Math.min(2, n - 2);
}

export function pickWord(words, categoryIds, history = []) {
  const pool = words.filter((w) => categoryIds.includes(w.category) && !history.includes(w.id));
  const src = pool.length ? pool : words.filter((w) => categoryIds.includes(w.category));
  if (!src.length) return null;
  return src[Math.floor(Math.random() * src.length)];
}
