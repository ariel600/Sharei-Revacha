"use client";

import { translate, type MessageKey } from "@/lib/i18n/dictionaries";
import { useLocaleStore, type Locale } from "@/store/localeStore";
import { useCallback } from "react";

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const toggleLocale = useLocaleStore((s) => s.toggleLocale);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale],
  );

  return { t, locale, setLocale, toggleLocale } as const;
}

export type { Locale };
