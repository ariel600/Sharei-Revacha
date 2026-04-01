import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata: Metadata = {
  title: "לוח בקרה | שערי רווחה",
  description: "לוח בקרה לפעילות שערי רווחה",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
