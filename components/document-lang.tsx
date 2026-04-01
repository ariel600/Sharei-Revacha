"use client";

import { useLocaleStore } from "@/store/localeStore";
import { useEffect } from "react";

/** Syncs <html lang> and dir with the persisted locale (Hebrew = RTL). */
export function DocumentLang() {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale === "he" ? "he" : "en";
    document.documentElement.dir = locale === "he" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
