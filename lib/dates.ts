/**
 * Format required by the external API: `YYYY-MM-DDTHH_YYYY-MM-DDTHH`
 * (start and end datetime segments joined by `_`).
 */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatDateSegment(d: Date): string {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  const h = pad2(d.getHours());
  return `${y}-${m}-${day}T${h}`;
}

export function buildDatesQueryParam(start: Date, end: Date): string {
  return `${formatDateSegment(start)}_${formatDateSegment(end)}`;
}

/** Last N days from now (inclusive window ending at `end`). */
export function lastNDaysRange(days: number, end: Date = new Date()): {
  start: Date;
  end: Date;
} {
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return { start, end };
}
