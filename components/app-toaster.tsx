"use client";

import { useLocaleStore } from "@/store/localeStore";
import { Toaster } from "sonner";

export function AppToaster() {
  const locale = useLocaleStore((s) => s.locale);
  return (
    <Toaster
      richColors
      position="top-center"
      dir={locale === "he" ? "rtl" : "ltr"}
    />
  );
}
