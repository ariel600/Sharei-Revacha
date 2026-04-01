import type { Station } from "@/types/shaarei";

export function stationKey(s: Station): string {
  return String(s.id ?? s._id ?? s.stationId ?? "");
}

export function stationLabel(s: Station): string {
  const k = stationKey(s);
  return String((s.name ?? s.title ?? s.stationId ?? k) || "—");
}

/** Match station by id / stationId / name (e.g. default `"33"`). */
export function findStationIdByToken(stations: Station[], token: string): string | null {
  const t = token.trim();
  if (!t || stations.length === 0) {
    return null;
  }
  for (const s of stations) {
    const k = stationKey(s);
    if (k === t) {
      return k;
    }
    if (String(s.stationId ?? "") === t) {
      return k || t;
    }
    if (String(s.id ?? "") === t) {
      return k || t;
    }
    if (String(s.name ?? "").trim() === t) {
      return k;
    }
  }
  for (const s of stations) {
    const label = stationLabel(s);
    if (label.includes(t)) {
      return stationKey(s) || null;
    }
  }
  return null;
}

export function pickStationIdOrFirst(stations: Station[], preferred: string): string {
  const hit = findStationIdByToken(stations, preferred);
  if (hit) {
    return hit;
  }
  return stations[0] ? stationKey(stations[0]) : "";
}
