import Button from "./Button";

export default function RoleOverlay({ player, info, onSeen, onRelease }) {
  if (!player) return null;
  return (
    <div className="spy-overlay" onPointerUp={onRelease}>
      <div className="spy-card w-full max-w-sm text-center p-8 border" style={{ borderColor: info.spy ? "var(--danger-500)" : "var(--primary-500)" }}>
        <p className="text-sm opacity-70">{player.name}</p>
        <h2 className="mt-2">{info.title}</h2>
        <p className="text-3xl font-extrabold mt-2">{info.word}</p>
        <Button className="mt-6" onClick={onSeen}>
          دیدم
        </Button>
      </div>
    </div>
  );
}
