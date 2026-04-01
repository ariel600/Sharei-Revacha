import type { TransactionState } from "@/types/shaarei";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  error: "bg-red-100 text-red-800 ring-red-600/20",
  canceled: "bg-amber-100 text-amber-900 ring-amber-600/20",
  payment: "bg-sky-100 text-sky-900 ring-sky-600/20",
  started: "bg-violet-100 text-violet-900 ring-violet-600/20",
  created: "bg-zinc-100 text-zinc-800 ring-zinc-600/20",
};

export function StatusBadge({ status }: { status: TransactionState | undefined }) {
  const s = String(status ?? "unknown").toLowerCase();
  const cls = STATUS_STYLES[s] ?? "bg-zinc-100 text-zinc-800 ring-zinc-600/20";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {String(status ?? "—")}
    </span>
  );
}
