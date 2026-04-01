/**
 * Resolves display values from live API payloads whose keys may vary.
 */

function asRecord(tx: unknown): Record<string, unknown> {
  if (tx && typeof tx === "object") {
    return tx as Record<string, unknown>;
  }
  return {};
}

const DATE_KEYS = [
  "creationTime",
  "createdAt",
  "date",
  "timestamp",
  "transactionDate",
  "time",
  "created",
  "insertTime",
  "transactionTime",
  "datetime",
  "eventTime",
] as const;

const CARD_KEYS = [
  "cardNumber",
  "card",
  "maskedCard",
  "cardMask",
  "pan",
  "cardLastFour",
  "lastFourDigits",
  "last4",
  "mask",
  "number",
  "creditCard",
] as const;

const AMOUNT_KEYS = [
  "amount",
  "totalAmount",
  "sum",
  "total",
  "value",
  "paymentAmount",
  "transactionAmount",
  "price",
  "chargedAmount",
  "money",
] as const;

const ID_KEYS = ["id", "_id", "transactionId", "guid", "transactionGuid", "reference"] as const;

function parseToDate(raw: unknown): Date | null {
  if (raw == null) {
    return null;
  }
  if (raw instanceof Date) {
    return Number.isNaN(raw.getTime()) ? null : raw;
  }
  if (typeof raw === "number") {
    const ms = raw < 1e12 ? raw * 1000 : raw;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof raw === "string") {
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function firstRawDate(o: Record<string, unknown>): unknown {
  for (const k of DATE_KEYS) {
    if (k in o && o[k] != null) {
      return o[k];
    }
  }
  return null;
}

/** DD/MM/YYYY HH:mm in Asia/Jerusalem */
export function formatTransactionWhenIsrael(tx: unknown): string {
  const o = asRecord(tx);
  const raw = firstRawDate(o);
  const d = parseToDate(raw);
  if (!d) {
    return raw != null ? String(raw) : "—";
  }
  const s = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return s.replace(",", "").replace(/\s+/g, " ").trim();
}

export function resolveTransactionCard(tx: unknown): string {
  const o = asRecord(tx);
  for (const k of CARD_KEYS) {
    const v = o[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v);
    }
  }
  return "";
}

export function resolveTransactionAmountNumber(tx: unknown): number | null {
  const o = asRecord(tx);
  for (const k of AMOUNT_KEYS) {
    const v = o[k];
    if (typeof v === "number" && !Number.isNaN(v)) {
      return v;
    }
    if (typeof v === "string" && v.trim() !== "") {
      const n = parseFloat(v.replace(/,/g, ""));
      if (!Number.isNaN(n)) {
        return n;
      }
    }
  }
  return null;
}

export function resolveTransactionAmountDisplay(tx: unknown): string {
  const n = resolveTransactionAmountNumber(tx);
  if (n != null) {
    return String(n);
  }
  return "—";
}

export function resolveTransactionId(tx: unknown): string {
  const o = asRecord(tx);
  for (const k of ID_KEYS) {
    const v = o[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v);
    }
  }
  return "—";
}

export function resolveTransactionStatus(tx: unknown): string | undefined {
  const o = asRecord(tx);
  const s = o.state ?? o.status ?? o.transactionState ?? o.phase;
  return s !== undefined && s !== null ? String(s) : undefined;
}

/** Client-side filter: card digits substring + amount match */
export function transactionRowMatchesLocalSearch(
  tx: unknown,
  cardQuery: string,
  amountQuery: string,
): boolean {
  const cq = cardQuery.trim();
  const aq = amountQuery.trim();

  if (cq) {
    const card = resolveTransactionCard(tx).replace(/\s/g, "");
    const digitsOnly = card.replace(/\D/g, "");
    if (!card.includes(cq) && !digitsOnly.includes(cq)) {
      return false;
    }
  }

  if (aq) {
    const num = resolveTransactionAmountNumber(tx);
    const display = resolveTransactionAmountDisplay(tx);
    if (display.includes(aq)) {
      return true;
    }
    if (num != null) {
      const ns = String(num);
      if (ns.includes(aq)) {
        return true;
      }
      const want = parseFloat(aq.replace(/,/g, "."));
      if (!Number.isNaN(want) && Math.abs(num - want) < 1e-6) {
        return true;
      }
    }
    return false;
  }

  return true;
}
