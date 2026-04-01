"use client";

import { useTranslation } from "@/hooks/useTranslation";

export function LoginLoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-full flex-1 items-center justify-center text-sm text-zinc-500">
      {t("common.loading")}
    </div>
  );
}
