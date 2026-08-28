export function narrate(state) {
  const name = (id) => state.players.find((p) => p.id === id)?.name || "کسی";
  const lines = [];
  (state.log || []).forEach((e) => {
    if (e.type === "burn") lines.push(`${name(e.playerId)} نوبتش سوخت.`);
    if (e.type === "question")
      lines.push(`${name(e.asker)} از ${name(e.target)} پرسید ${e.a} یا ${e.b}؛ جواب: ${e.answer}.`);
    if (e.type === "exile") {
      const roleFa = e.role === "spy" ? "جاسوس" : e.role === "blank" ? "سفید" : "شهروند";
      lines.push(`${name(e.id)} اخراج شد (${roleFa}).`);
    }
    if (e.type === "guess") lines.push(e.ok ? "جاسوس کلمه را درست حدس زد." : "حدس جاسوس اشتباه بود.");
  });
  if (!lines.length) return "دست بدون سوال و اخراج به پایان رسید.";
  return lines.join(" ");
}
