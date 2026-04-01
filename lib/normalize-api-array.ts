/** Unwraps common REST envelope shapes into a plain array. */
export function normalizeApiArray<T>(
  data: unknown,
  arrayKeys: string[] = ["data", "items", "results", "records"],
): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of arrayKeys) {
      const v = o[k];
      if (Array.isArray(v)) {
        return v as T[];
      }
    }
  }
  return [];
}
