"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-100 px-6 py-24 dark:bg-zinc-950">
      <div className="absolute end-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("home.title")}
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("home.subtitle")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {t("home.signIn")}
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            {t("home.dashboard")}
          </Link>
        </div>
      </div>
    </div>
  );
}
