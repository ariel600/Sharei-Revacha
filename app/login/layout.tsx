import { Suspense } from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-1 items-center justify-center text-sm text-zinc-500">
          Loading…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
