"use client";

import { apiClient } from "@/lib/api-client";
import { branchKey, findYermiyahuBranchId } from "@/lib/branch-helpers";
import {
  buildDatesQueryParamT05,
  parseDateInput,
  toDateInputValue,
} from "@/lib/dates";
import type { MessageKey } from "@/lib/i18n/dictionaries";
import { normalizeApiArray } from "@/lib/normalize-api-array";
import { pickStationIdOrFirst, stationKey, stationLabel } from "@/lib/station-helpers";
import {
  formatTransactionWhenIsrael,
  resolveTransactionAmountDisplay,
  resolveTransactionCard,
  resolveTransactionId,
  resolveTransactionStatus,
  transactionRowMatchesLocalSearch,
} from "@/lib/transaction-display";
import { StatusBadge } from "@/components/status-badge";
import type { Branch, Station, Transaction, TransactionState } from "@/types/shaarei";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS: TransactionState[] = [
  "completed",
  "error",
  "canceled",
  "payment",
  "started",
  "created",
];

const DEFAULT_STATION_TOKEN = "33";

function branchOptionLabel(b: Branch, fallback: string): string {
  return String((b.name ?? b.title ?? b.code ?? branchKey(b)) || fallback);
}

export default function StatusReportsPage() {
  const { t } = useTranslation();

  const today = useMemo(() => toDateInputValue(new Date()), []);

  const [rangeStart, setRangeStart] = useState(today);
  const [rangeEnd, setRangeEnd] = useState(today);
  /** Empty string = all statuses (do not send `state` to API). */
  const [stateFilter, setStateFilter] = useState("");

  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [stationId, setStationId] = useState("");
  const [loadingBranches, setLoadingBranches] = useState(true);

  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [cardSearch, setCardSearch] = useState("");
  const [amountSearch, setAmountSearch] = useState("");

  const loadBranches = useCallback(async () => {
    setLoadingBranches(true);
    try {
      const { data } = await apiClient.get<unknown>("/api/branches");
      const list = normalizeApiArray<Branch>(data, [
        "data",
        "items",
        "branches",
        "results",
        "records",
      ]);
      setBranches(list);
      setBranchId((current) => {
        if (current) {
          return current;
        }
        const y = findYermiyahuBranchId(list);
        if (y) {
          return y;
        }
        return list[0] ? branchKey(list[0]) : "";
      });
    } catch (e) {
      toast.error(t("overview.toast.branchesError"), {
        description: e instanceof Error ? e.message : t("common.requestFailed"),
      });
    } finally {
      setLoadingBranches(false);
    }
  }, [t]);

  useEffect(() => {
    void loadBranches();
  }, [loadBranches]);

  useEffect(() => {
    setStationId("");
    if (!branchId) {
      setStations([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await apiClient.get<unknown>(
          `/api/branches/${encodeURIComponent(branchId)}/stations`,
        );
        if (cancelled) {
          return;
        }
        const list = normalizeApiArray<Station>(data, [
          "data",
          "items",
          "stations",
          "results",
          "records",
        ]);
        setStations(list);
        const preferred = pickStationIdOrFirst(list, DEFAULT_STATION_TOKEN);
        setStationId(preferred);
      } catch (e) {
        if (!cancelled) {
          toast.error(t("overview.toast.stationsError"), {
            description: e instanceof Error ? e.message : t("common.requestFailed"),
          });
          setStations([]);
          setStationId("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [branchId, t]);

  const displayRows = useMemo(() => {
    return rows.filter((tx) =>
      transactionRowMatchesLocalSearch(tx, cardSearch, amountSearch),
    );
  }, [rows, cardSearch, amountSearch]);

  async function fetchReports() {
    setLoading(true);
    try {
      const start = parseDateInput(rangeStart);
      const end = parseDateInput(rangeEnd);
      const dates = buildDatesQueryParamT05(start, end);
      const params: Record<string, string> = { dates };
      if (stateFilter) {
        params.state = stateFilter;
      }
      if (branchId) {
        params.branch = branchId;
      }
      if (stationId) {
        params.station = stationId;
      }
      const { data } = await apiClient.get<unknown>("/api/transactions", { params });

      console.log("API Response:", data);

      const list = normalizeApiArray<Transaction>(data, [
        "data",
        "items",
        "transactions",
        "results",
        "records",
      ]);
      if (list.length > 0) {
        console.log("FIRST TRANSACTION ROW:", list[0]);
      }
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

  const fb = t("overview.branchFallback");
  const showFilterHint = rows.length > 0 && (cardSearch.trim() !== "" || amountSearch.trim() !== "");

  return (
    <div dir="rtl" className="w-full min-w-0 space-y-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("reports.title")}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t("reports.subtitle")}</p>
      </div>

      <section className="w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("reports.branch")}
            <select
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              disabled={loadingBranches || branches.length === 0}
            >
              {branches.length === 0 ? (
                <option value="">{t("reports.noBranches")}</option>
              ) : (
                branches.map((b, idx) => {
                  const id = branchKey(b);
                  return (
                    <option key={id || `b-${idx}`} value={id}>
                      {branchOptionLabel(b, fb)}
                    </option>
                  );
                })
              )}
            </select>
          </label>

          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("reports.station")}
            <select
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
              disabled={!branchId || stations.length === 0}
            >
              <option value="">{t("reports.stationPlaceholder")}</option>
              {stations.map((s, idx) => {
                const id = stationKey(s);
                return (
                  <option key={id || `s-${idx}`} value={id}>
                    {stationLabel(s)}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("reports.dateStart")}
            <input
              type="date"
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              dir="ltr"
            />
          </label>

          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("reports.dateEnd")}
            <input
              type="date"
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
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="">{t("reports.statusAll")}</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {t(`status.${s}` as MessageKey)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col justify-end sm:col-span-2 lg:col-span-1">
            <button
              type="button"
              onClick={() => void fetchReports()}
              disabled={loading}
              className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {loading ? t("reports.loading") : t("reports.loadReport")}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-zinc-100 pt-6 dark:border-zinc-800 md:grid-cols-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("reports.searchCardLocal")}
            <input
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={cardSearch}
              onChange={(e) => setCardSearch(e.target.value)}
              placeholder="566"
              dir="ltr"
              inputMode="numeric"
              autoComplete="off"
            />
          </label>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("reports.searchAmountLocal")}
            <input
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={amountSearch}
              onChange={(e) => setAmountSearch(e.target.value)}
              placeholder="100"
              dir="ltr"
              inputMode="decimal"
              autoComplete="off"
            />
          </label>
        </div>

        {showFilterHint ? (
          <p className="mt-3 text-xs text-zinc-500">
            {t("reports.filteredHint", { filtered: displayRows.length, total: rows.length })}
          </p>
        ) : null}

        <div className="mt-6 w-full overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          {rows.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">{t("reports.empty")}</p>
          ) : displayRows.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">{t("reports.emptyFilter")}</p>
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
                {displayRows.map((tx, i) => {
                  const id = resolveTransactionId(tx);
                  return (
                    <tr key={`${id}-${i}`} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
                      <td className="px-4 py-2.5 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                        {id}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-zinc-600 dark:text-zinc-400" dir="ltr">
                        {formatTransactionWhenIsrael(tx)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs" dir="ltr">
                        {resolveTransactionCard(tx) || "—"}
                      </td>
                      <td className="px-4 py-2.5" dir="ltr">
                        {resolveTransactionAmountDisplay(tx)}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={resolveTransactionStatus(tx) as TransactionState} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
