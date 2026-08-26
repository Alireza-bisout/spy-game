export default function PlayerAvatar({ icon, className = "" }) {
  return (
    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-paper text-accent ${className}`}>
      <i className={`fa-solid ${icon || "fa-user"}`} />
    </span>
  );
}
