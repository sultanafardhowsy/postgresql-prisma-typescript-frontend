const STATUS_STYLES = {
  ACTIVE: "bg-signal/10 text-signal-dark",
  INACTIVE: "bg-brass-soft text-brass",
  OUT_OF_STOCK: "bg-danger-soft text-danger",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-paper-raised text-ink-soft";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${style}`}
    >
      {status?.replace(/_/g, " ") || "Unknown"}
    </span>
  );
}
