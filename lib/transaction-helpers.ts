import type { Transaction } from "@/types/shaarei";

function getCardString(tx: Transaction): string {
  const keys = ["cardNumber", "card", "pan", "maskedCard", "cardLastFour"] as const;
  for (const k of keys) {
    const v = tx[k];
    if (v !== undefined && v !== null) {
      return String(v);
    }
  }
  return "";
}

function getAmount(tx: Transaction): number | undefined {
  const keys = ["amount", "total", "value"] as const;
  for (const k of keys) {
    const v = tx[k];
    if (typeof v === "number" && !Number.isNaN(v)) {
      return v;
    }
  }
  return undefined;
}

export function normalizeTransactionList(data: unknown): Transaction[] {
  if (Array.isArray(data)) {
    return data as Transaction[];
  }
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.data)) {
      return o.data as Transaction[];
    }
    if (Array.isArray(o.items)) {
      return o.items as Transaction[];
    }
    if (Array.isArray(o.transactions)) {
      return o.transactions as Transaction[];
    }
  }
  return [];
}

/**
 * Match card (partial, case-insensitive) OR amount (exact numeric match).
 * Empty / omitted params are ignored for that dimension.
 */
export function transactionMatchesFilters(
  tx: Transaction,
  cardNumber?: string | null,
  amountRaw?: string | null,
): boolean {
  const cardQ = cardNumber?.trim();
  const amountQ = amountRaw?.trim();

  let cardOk = false;
  let amountOk = false;

  if (cardQ) {
    const hay = getCardString(tx).toLowerCase();
    cardOk = hay.includes(cardQ.toLowerCase());
  }

  if (amountQ !== undefined && amountQ !== null && amountQ.length > 0) {
    const target = Number(amountQ);
    if (!Number.isNaN(target)) {
      const amt = getAmount(tx);
      amountOk = amt !== undefined && amt === target;
    }
  }

  if (cardQ && amountQ) {
    return cardOk || amountOk;
  }
  if (cardQ) {
    return cardOk;
  }
  if (amountQ) {
    return amountOk;
  }
  return false;
}

/** Client-side: when both filters are empty, returns all rows. */
export function applyLocalTransactionFilter(
  rows: Transaction[],
  cardNumber?: string | null,
  amountRaw?: string | null,
): Transaction[] {
  const cardQ = cardNumber?.trim();
  const amountQ = amountRaw?.trim();
  if (!cardQ && !amountQ) {
    return rows;
  }
  return rows.filter((tx) => transactionMatchesFilters(tx, cardNumber, amountRaw));
}
