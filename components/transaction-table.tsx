"use client";

import type { Transaction } from "@/types/shaarei";
import { StatusBadge } from "@/components/status-badge";

function cellCard(tx: Transaction): string {
  const v =
    tx.cardNumber ?? tx.card ?? tx.maskedCard ?? tx.pan ?? (tx.cardLastFour as string | undefined);
  return v !== undefined && v !== null ? String(v) : "—";
}

function cellAmount(tx: Transaction): string {
  const n = tx.amount ?? tx.total ?? tx.value;
  if (typeof n === "number" && !Number.isNaN(n)) {
    return String(n);
  }
  return "—";
}

function cellState(tx: Transaction): string {
  const s = tx.state ?? tx.status;
  return s !== undefined && s !== null ? String(s) : "—";
}

function cellId(tx: Transaction): string {
  const id = tx.id ?? tx._id ?? tx.transactionId;
  return id !== undefined && id !== null ? String(id) : "—";
}

function cellWhen(tx: Transaction): string {
  const t = tx.createdAt ?? tx.date ?? tx.timestamp;
  return t !== undefined && t !== null ? String(t) : "—";
}

export function TransactionTable({ rows }: { rows: Transaction[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40">
        No transactions to display.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Card</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {rows.map((tx, i) => {
            const key = cellId(tx) + String(i);
            return (
              <tr key={key} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
                <td className="px-4 py-2.5 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {cellId(tx)}
                </td>
                <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">{cellWhen(tx)}</td>
                <td className="px-4 py-2.5 font-mono text-xs">{cellCard(tx)}</td>
                <td className="px-4 py-2.5">{cellAmount(tx)}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={tx.state ?? tx.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
