export default function Chip({ on, children, ...props }) {
  return (
    <button
      type="button"
      className={`rounded-full px-4 py-2 text-sm transition ${
        on ? "bg-accent text-accent-ink" : "bg-paper-2 text-ink border border-line"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
