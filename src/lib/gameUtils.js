export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickWord(words, categoryIds, history = []) {
  const pool = words.filter((w) => categoryIds.includes(w.category) && !history.includes(w.id));
  const src = pool.length ? pool : words.filter((w) => categoryIds.includes(w.category));
  if (!src.length) return null;
  return src[Math.floor(Math.random() * src.length)];
}
