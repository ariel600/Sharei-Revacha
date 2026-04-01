export const EXTERNAL_API_BASE = "https://api.shaarei-revacha.com";

export const EXTERNAL_PATHS = {
  login: "/auth/v1/login",
  branches: "/admin/v1/branches",
  branchStations: (branchId: string) =>
    `/admin/v1/branches/${encodeURIComponent(branchId)}/stations`,
  transactions: "/common/v1/transactions",
} as const;
