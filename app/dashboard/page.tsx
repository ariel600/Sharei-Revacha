"use client";

import { apiClient } from "@/lib/api-client";
import { applyLocalTransactionFilter } from "@/lib/transaction-helpers";
import { buildDatesQueryParam } from "@/lib/dates";
import { normalizeApiArray } from "@/lib/normalize-api-array";
import { TransactionTable } from "@/components/transaction-table";
import type { Branch, Station, Transaction } from "@/types/shaarei";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseDatetimeLocal(s: string): Date {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function branchKey(b: Branch): string {
  return String(b.id ?? b._id ?? b.branchId ?? b.code ?? "");
}

function branchLabel(b: Branch): string {
  return String((b.name ?? b.title ?? b.code ?? branchKey(b)) || "Branch");
}

export default function OverviewPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<string>("");
  const [stations, setStations] = useState<Station[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  const defaultRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return { start, end };
  }, []);

  const [rangeStart, setRangeStart] = useState(() => toDatetimeLocalValue(defaultRange.start));
  const [rangeEnd, setRangeEnd] = useState(() => toDatetimeLocalValue(defaultRange.end));

  const [loadedRows, setLoadedRows] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [deepLoading, setDeepLoading] = useState(false);

  const [cardFilter, setCardFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");

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
        const first = list[0] ? branchKey(list[0]) : "";
        return first;
      });
    } catch (e) {
      toast.error("Could not load branches", {
        description: e instanceof Error ? e.message : "Request failed",
      });
    } finally {
      setLoadingBranches(false);
    }
  }, []);

  useEffect(() => {
    void loadBranches();
  }, [loadBranches]);

  useEffect(() => {
    if (!branchId) {
      setStations([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await apiClient.get<unknown>(`/api/branches/${encodeURIComponent(branchId)}/stations`);
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
      } catch (e) {
        if (!cancelled) {
          toast.error("Could not load stations", {
            description: e instanceof Error ? e.message : "Request failed",
          });
          setStations([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [branchId]);

  const filteredRows = useMemo(
    () => applyLocalTransactionFilter(loadedRows, cardFilter, amountFilter),
    [loadedRows, cardFilter, amountFilter],
  );

  const showDeepSearch =
    filteredRows.length === 0 &&
    (cardFilter.trim().length > 0 || amountFilter.trim().length > 0);

  async function fetchTransactions() {
    setTxLoading(true);
    try {
      const start = parseDatetimeLocal(rangeStart);
      const end = parseDatetimeLocal(rangeEnd);
      const dates = buildDatesQueryParam(start, end);
      const { data } = await apiClient.get<unknown>("/api/transactions", {
        params: { dates },
      });
      const list = normalizeApiArray<Transaction>(data, [
        "data",
        "items",
        "transactions",
        "results",
        "records",
      ]);
      setLoadedRows(list);
      toast.success("Transactions loaded", { description: `${list.length} row(s).` });
    } catch (e) {
      toast.error("Could not load transactions", {
        description: e instanceof Error ? e.message : "Request failed",
      });
    } finally {
      setTxLoading(false);
    }
  }

  async function runDeepSearch() {
    setDeepLoading(true);
    try {
      const params: Record<string, string> = {};
      if (cardFilter.trim()) {
        params.cardNumber = cardFilter.trim();
      }
      if (amountFilter.trim()) {
        params.amount = amountFilter.trim();
      }
      const { data } = await apiClient.get<{ transactions: Transaction[] }>(
        "/api/transactions/search",
        { params },
      );
      const list = data.transactions ?? [];
      setLoadedRows(list);
      toast.message("Deep search complete", { description: `${list.length} match(es) in the last 30 days.` });
    } catch (e) {
      toast.error("Deep search failed", {
        description: e instanceof Error ? e.message : "Request failed",
      });
    } finally {
      setDeepLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Overview
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Select a branch, pick a date range, and load transactions. Refine locally or use deep
          search when needed.
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Branch & stations
        </h2>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end">
          <label className="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Branch
            <select
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              disabled={loadingBranches || branches.length === 0}
            >
              {branches.length === 0 ? (
                <option value="">No branches</option>
              ) : (
                branches.map((b, idx) => {
                  const id = branchKey(b);
                  return (
                    <option key={id || `branch-${idx}`} value={id}>
                      {branchLabel(b)}
                    </option>
                  );
                })
              )}
            </select>
          </label>
          <div className="flex-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Stations</span>
            <p className="mt-1.5 min-h-[2.5rem] rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900/50">
              {stations.length === 0
                ? "No stations loaded."
                : stations
                    .map((s) => String(s.name ?? s.title ?? s.stationId ?? s.id ?? "—"))
                    .join(", ")}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Transactions
        </h2>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Range start
            <input
              type="datetime-local"
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Range end
            <input
              type="datetime-local"
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={() => void fetchTransactions()}
            disabled={txLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {txLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Fetch Data
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Search by Card Number
            <input
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={cardFilter}
              onChange={(e) => setCardFilter(e.target.value)}
              placeholder="Partial or full card number"
            />
          </label>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Search by Amount
            <input
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              placeholder="Exact amount"
              inputMode="decimal"
            />
          </label>
        </div>

        {showDeepSearch ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/40">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Not found locally. Deep Search in Database
            </p>
            <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-200/90">
              Searches the last 30 days on the server using your card and amount filters.
            </p>
            <button
              type="button"
              onClick={() => void runDeepSearch()}
              disabled={deepLoading}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deepLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Run deep search
            </button>
          </div>
        ) : null}

        <div className="mt-8">
          <p className="mb-2 text-xs text-zinc-500">
            Showing {filteredRows.length} of {loadedRows.length} loaded row(s)
            {filteredRows.length !== loadedRows.length ? " (after local filter)" : ""}.
          </p>
          <TransactionTable rows={filteredRows} />
        </div>
      </section>
    </div>
  );
}
