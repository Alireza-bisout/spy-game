import PlayerAvatar from "./PlayerAvatar";

export default function PlayerRow({ player, extra, onClick }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-paper-2 px-4 py-3.5 text-right shadow-sm"
    >
      <PlayerAvatar icon={player.icon} />
      <strong className="flex-1 text-base">{player.name}</strong>
      {extra}
    </Comp>
  );
}
