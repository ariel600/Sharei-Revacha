/**
 * External API `dates` query: `YYYY-MM-DDT05_YYYY-MM-DDT05`
 * (date-only in the UI; hour segment fixed to `T05` for each boundary).
 */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** One boundary segment, e.g. `2026-03-22T05` */
export function formatDateSegmentT05(d: Date): string {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}T05`;
}

export function buildDatesQueryParamT05(start: Date, end: Date): string {
  return `${formatDateSegmentT05(start)}_${formatDateSegmentT05(end)}`;
}

/** `YYYY-MM-DD` for `<input type="date" />` (local calendar). */
export function toDateInputValue(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * Parse `YYYY-MM-DD` to a local calendar Date at noon (stable for TZ).
 */
export function parseDateInput(isoDate: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!m) {
    return new Date();
  }
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const day = Number(m[3]);
  return new Date(y, mo, day, 12, 0, 0, 0);
}

/** Last N whole days ending at `end` (local dates). */
export function lastNDaysRange(
  days: number,
  end: Date = new Date(),
): { start: Date; end: Date } {
  const endLocal = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate(),
    12,
    0,
    0,
    0,
  );
  const start = new Date(endLocal);
  start.setDate(start.getDate() - days);
  return { start, end: endLocal };
}
