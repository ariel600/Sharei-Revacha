"use client";

import { apiClient } from "@/lib/api-client";
import { buildDatesQueryParam } from "@/lib/dates";
import { normalizeApiArray } from "@/lib/normalize-api-array";
import { StatusBadge } from "@/components/status-badge";
import type { Transaction, TransactionState } from "@/types/shaarei";
import { useTranslation } from "@/hooks/useTranslation";
import type { MessageKey } from "@/lib/i18n/dictionaries";
import { Loader2, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS: TransactionState[] = [
  "completed",
  "error",
  "canceled",
  "payment",
  "started",
  "created",
];

function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseDatetimeLocal(s: string): Date {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function cellId(tx: Transaction): string {
  const id = tx.id ?? tx._id ?? tx.transactionId;
  return id !== undefined && id !== null ? String(id) : "—";
}

function cellWhen(tx: Transaction): string {
  const t = tx.createdAt ?? tx.date ?? tx.timestamp;
  return t !== undefined && t !== null ? String(t) : "—";
}

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

export default function StatusReportsPage() {
  const { t } = useTranslation();
  const defaultRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 14);
    return { start, end };
  }, []);

  const [rangeStart, setRangeStart] = useState(() => toDatetimeLocalValue(defaultRange.start));
  const [rangeEnd, setRangeEnd] = useState(() => toDatetimeLocalValue(defaultRange.end));
  const [stateFilter, setStateFilter] = useState<TransactionState>("completed");
  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchReports() {
    setLoading(true);
    try {
      const start = parseDatetimeLocal(rangeStart);
      const end = parseDatetimeLocal(rangeEnd);
      const dates = buildDatesQueryParam(start, end);
      const { data } = await apiClient.get<unknown>("/api/transactions", {
        params: { dates, state: stateFilter },
      });
      const list = normalizeApiArray<Transaction>(data, [
        "data",
        "items",
        "transactions",
        "results",
        "records",
      ]);
      setRows(list);
      toast.success(t("reports.toast.loaded"), {
        description: t("reports.toast.rows", { count: list.length }),
      });
    } catch (e) {
      toast.error(t("reports.toast.error"), {
        description: e instanceof Error ? e.message : t("common.requestFailed"),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("reports.title")}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t("reports.subtitle")}</p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("reports.rangeStart")}
            <input
              type="datetime-local"
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              dir="ltr"
            />
          </label>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("reports.rangeEnd")}
            <input
              type="datetime-local"
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              dir="ltr"
            />
          </label>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("reports.status")}
            <select
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value as TransactionState)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {t(`status.${s}` as MessageKey)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void fetchReports()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {loading ? t("reports.loading") : t("reports.loadReport")}
          </button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          {rows.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">{t("reports.empty")}</p>
          ) : (
            <table className="min-w-full text-start text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3">{t("table.colId")}</th>
                  <th className="px-4 py-3">{t("table.colWhen")}</th>
                  <th className="px-4 py-3">{t("table.colCard")}</th>
                  <th className="px-4 py-3">{t("table.colAmount")}</th>
                  <th className="px-4 py-3">{t("table.colStatus")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {rows.map((tx, i) => (
                  <tr key={`${cellId(tx)}-${i}`} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                      {cellId(tx)}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">{cellWhen(tx)}</td>
                    <td className="px-4 py-2.5 font-mono text-xs" dir="ltr">
                      {cellCard(tx)}
                    </td>
                    <td className="px-4 py-2.5" dir="ltr">
                      {cellAmount(tx)}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={tx.state ?? tx.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
