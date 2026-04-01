import { NextRequest } from "next/server";
import { proxyExternalGet } from "@/lib/proxy-request";
import { EXTERNAL_PATHS } from "@/lib/external-api";

type RouteContext = { params: Promise<{ branchId: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const { branchId } = await context.params;
  return proxyExternalGet(req, EXTERNAL_PATHS.branchStations(branchId));
}
