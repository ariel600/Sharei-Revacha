import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { buildDatesQueryParam, lastNDaysRange } from "@/lib/dates";
import { EXTERNAL_API_BASE, EXTERNAL_PATHS } from "@/lib/external-api";
import {
  normalizeTransactionList,
  transactionMatchesFilters,
} from "@/lib/transaction-helpers";
import type { TransactionsSearchResponse } from "@/types/shaarei";

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

export async function GET(req: NextRequest) {
  const bearer = getBearerHeader(req);
  if (!bearer) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 },
    );
  }

  const cardNumber = req.nextUrl.searchParams.get("cardNumber");
  const amount = req.nextUrl.searchParams.get("amount");

  const { start, end } = lastNDaysRange(30);
  const dates = buildDatesQueryParam(start, end);

  const url = new URL(`${EXTERNAL_API_BASE}${EXTERNAL_PATHS.transactions}`);
  url.searchParams.set("dates", dates);
  // Forward any other query params from the client except our filters
  req.nextUrl.searchParams.forEach((value, key) => {
    if (key !== "cardNumber" && key !== "amount") {
      url.searchParams.append(key, value);
    }
  });

  try {
    const res = await axios.get(url.toString(), {
      headers: { Authorization: bearer },
      validateStatus: () => true,
    });

    if (res.status < 200 || res.status >= 300) {
      return NextResponse.json(res.data, { status: res.status });
    }

    const all = normalizeTransactionList(res.data);
    const filtered = all.filter((tx) =>
      transactionMatchesFilters(tx, cardNumber, amount),
    );

    const body: TransactionsSearchResponse = { transactions: filtered };
    return NextResponse.json(body);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
