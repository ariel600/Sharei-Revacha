import type { Metadata } from "next";
import { Geist, Geist_Mono, Heebo } from "next/font/google";
import { AppToaster } from "@/components/app-toaster";
import { AppVersionBadge } from "@/components/app-version-badge";
import { DocumentLang } from "@/components/document-lang";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "שערי רווחה",
  description: "לוח בקרה לפעילות שערי רווחה",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      suppressHydrationWarning
      className={`${heebo.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <DocumentLang />
        {children}
        <AppVersionBadge />
        <AppToaster />
      </body>
    </html>
  );
}
