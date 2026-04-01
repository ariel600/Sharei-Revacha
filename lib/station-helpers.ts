import type { Station } from "@/types/shaarei";

export function stationKey(s: Station): string {
  return String(s.id ?? s._id ?? s.stationId ?? "");
}

export function stationLabel(s: Station): string {
  const k = stationKey(s);
  return String((s.name ?? s.title ?? s.stationId ?? k) || "—");
}
