import { NextRequest } from "next/server";
import { proxyExternalGet } from "@/lib/proxy-request";
import { EXTERNAL_PATHS } from "@/lib/external-api";

export async function GET(req: NextRequest) {
  return proxyExternalGet(req, EXTERNAL_PATHS.transactions);
}
