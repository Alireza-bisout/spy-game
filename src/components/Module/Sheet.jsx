export default function Sheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-3xl bg-paper-2 p-5 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="mb-3 text-lg">{title}</h2>}
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}
