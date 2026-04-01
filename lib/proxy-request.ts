import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { EXTERNAL_API_BASE } from "@/lib/external-api";

function getBearerHeader(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth) {
    return null;
  }
  const trimmed = auth.trim();
  if (!/^Bearer\s+/i.test(trimmed)) {
    return null;
  }
  return trimmed;
}

/**
 * Proxies GET to the external API, forwarding the query string and Authorization header.
 */
export async function proxyExternalGet(
  req: NextRequest,
  externalPath: string,
): Promise<NextResponse> {
  const bearer = getBearerHeader(req);
  if (!bearer) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 },
    );
  }

  const url = `${EXTERNAL_API_BASE}${externalPath}${req.nextUrl.search}`;

  try {
    const res = await axios.get(url, {
      headers: { Authorization: bearer },
      validateStatus: () => true,
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
