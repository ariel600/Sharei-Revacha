"use client";

import { useTranslation } from "@/hooks/useTranslation";
import {
  formatTransactionWhenIsrael,
  resolveTransactionAmountDisplay,
  resolveTransactionCard,
  resolveTransactionId,
  resolveTransactionStatus,
} from "@/lib/transaction-display";
import type { Transaction, TransactionState } from "@/types/shaarei";
import { StatusBadge } from "@/components/status-badge";
import { Printer, X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  transaction: Transaction;
  onClose: () => void;
};

export function TransactionReceiptModal({ transaction, onClose }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const entries = Object.entries(transaction as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 print:fixed print:inset-0 print:z-[9999] print:m-0 print:block print:bg-white print:p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 print:hidden"
        aria-label={t("reports.closeModal")}
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl print:absolute print:inset-0 print:max-h-none print:max-w-none print:rounded-none print:shadow-none">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 print:hidden">
          <h2 id="receipt-title" className="text-lg font-semibold text-zinc-900">
            {t("reports.receiptTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
            aria-label={t("reports.closeModal")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="receipt-print-area min-h-0 flex-1 overflow-y-auto px-6 py-6 print:overflow-visible print:p-8">
          <div className="border-b border-dashed border-zinc-300 pb-4 text-center">
            <p className="text-base font-bold text-zinc-900">{t("meta.title")}</p>
            <p className="mt-1 text-sm text-zinc-600">{t("reports.receiptSubtitle")}</p>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-zinc-100 pb-2">
              <dt className="text-zinc-500">{t("table.colId")}</dt>
              <dd className="max-w-[60%] break-all text-start font-mono text-zinc-900">
                {resolveTransactionId(transaction)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-100 pb-2">
              <dt className="text-zinc-500">{t("table.colWhen")}</dt>
              <dd className="text-start font-mono text-zinc-900" dir="ltr">
                {formatTransactionWhenIsrael(transaction)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-100 pb-2">
              <dt className="text-zinc-500">{t("table.colCard")}</dt>
              <dd className="text-start font-mono text-zinc-900" dir="ltr">
                {resolveTransactionCard(transaction) || "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-100 pb-2">
              <dt className="text-zinc-500">{t("table.colAmount")}</dt>
              <dd className="text-start font-mono font-semibold text-zinc-900" dir="ltr">
                {resolveTransactionAmountDisplay(transaction)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 pb-2">
              <dt className="text-zinc-500">{t("table.colStatus")}</dt>
              <dd className="text-start">
                <StatusBadge status={resolveTransactionStatus(transaction) as TransactionState} />
              </dd>
            </div>
          </dl>

          <details className="mt-6 print:hidden">
            <summary className="cursor-pointer text-xs text-zinc-500">{t("reports.receiptRawFields")}</summary>
            <ul className="mt-2 max-h-40 overflow-auto rounded border border-zinc-200 bg-zinc-50 p-2 text-xs font-mono">
              {entries.map(([k, v]) => (
                <li key={k} className="break-all border-b border-zinc-100 py-1 last:border-0">
                  <span className="text-zinc-600">{k}:</span>{" "}
                  <span dir="ltr">{v === null || v === undefined ? "—" : JSON.stringify(v)}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>

        <div className="shrink-0 border-t border-zinc-200 p-4 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white shadow hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            <Printer className="h-4 w-4" aria-hidden />
            {t("reports.printReceipt")}
          </button>
        </div>
      </div>
    </div>
  );
}
