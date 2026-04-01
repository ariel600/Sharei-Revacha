/** Best-effort extraction of a JWT / bearer token from external login JSON. */
export function extractLoginToken(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }
  const d = data as Record<string, unknown>;
  const direct =
    d.token ?? d.accessToken ?? d.jwt ?? d.access_token ?? d.bearerToken;
  if (typeof direct === "string" && direct.length > 0) {
    return direct;
  }
  if (d.data && typeof d.data === "object") {
    const inner = d.data as Record<string, unknown>;
    const innerTok =
      inner.token ?? inner.accessToken ?? inner.jwt ?? inner.access_token;
    if (typeof innerTok === "string" && innerTok.length > 0) {
      return innerTok;
    }
  }
  return null;
}
