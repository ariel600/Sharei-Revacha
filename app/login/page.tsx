"use client";

import axios from "axios";
import { Building2, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setJwtToken = useAuthStore((s) => s.setJwtToken);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post<{ token: string }>("/api/auth/login", {
        username,
        password,
      });
      if (!data?.token) {
        toast.error("Login failed", { description: "No token returned." });
        return;
      }
      setJwtToken(data.token);
      const next = searchParams.get("next") || "/dashboard";
      router.replace(next);
      toast.success("Signed in");
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data && typeof err.response.data === "object"
          ? String((err.response.data as { error?: string }).error ?? "Request failed")
          : "Could not sign in.";
      toast.error("Login failed", { description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 px-4 py-16 dark:from-zinc-950 dark:to-black">
      <div className="mb-8 flex items-center gap-3 text-zinc-800 dark:text-zinc-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          <Building2 className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Shaarei Revacha</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Operations dashboard</p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Sign in</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Use your Shaarei Revacha credentials.
        </p>

        <label className="mt-6 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Username
          <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
            <User className="h-4 w-4 text-zinc-400" aria-hidden />
            <input
              className="w-full bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
            />
          </span>
        </label>

        <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
          <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
            <Lock className="h-4 w-4 text-zinc-400" aria-hidden />
            <input
              className="w-full bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {submitting ? "Signing in…" : "Continue"}
        </button>

        <p className="mt-6 text-center text-xs text-zinc-500">
          By continuing you agree to your organization&apos;s access policies.
        </p>
      </form>

      <p className="mt-8 text-center text-xs text-zinc-500">
        <Link href="/" className="underline-offset-4 hover:underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
