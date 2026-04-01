"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

type Props = {
  className?: string;
  variant?: "default" | "ghost";
};

export function LanguageSwitcher({ className = "", variant = "default" }: Props) {
  const { locale, toggleLocale, t } = useTranslation();
  const isHe = locale === "he";
  const label = isHe ? t("language.switchToEnglish") : t("language.switchToHebrew");

  const base =
    variant === "ghost"
      ? "rounded-lg px-2 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      : "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={`${base} ${className}`}
      aria-label={t("language.aria")}
      title={label}
    >
      <Languages className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      <span className="tabular-nums">{label}</span>
    </button>
  );
}
