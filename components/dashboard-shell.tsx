"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/hooks/useTranslation";
import { LayoutDashboard, LogOut, Menu, FileBarChart } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/dashboard", label: t("dashboard.nav.overview"), icon: LayoutDashboard },
    { href: "/dashboard/reports", label: t("dashboard.nav.reports"), icon: FileBarChart },
  ];

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen w-full flex-1 bg-zinc-100 dark:bg-zinc-950">
      <aside
        className={`print:hidden fixed inset-y-0 start-0 z-40 flex w-64 flex-col border-e border-zinc-200 bg-white shadow-sm transition-transform dark:border-zinc-800 dark:bg-zinc-900 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
          <span className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("meta.title")}
          </span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 space-y-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
          <LanguageSwitcher className="w-full justify-center" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {t("dashboard.logout")}
          </button>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="print:hidden fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label={t("dashboard.closeMenu")}
          onClick={() => setOpen(false)}
        />
      ) : null}

      <button
        type="button"
        className="print:hidden fixed bottom-4 end-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg md:hidden dark:bg-zinc-100 dark:text-zinc-900"
        onClick={() => setOpen(true)}
        aria-label={t("dashboard.openMenu")}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col md:ps-0">
        <main className="min-h-screen w-full min-w-0 flex-1 p-0">{children}</main>
      </div>
    </div>
  );
}
