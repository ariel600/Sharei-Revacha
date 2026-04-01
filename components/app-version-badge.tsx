import { APP_VERSION } from "@/lib/version";

/** Small build version, fixed physical bottom-left (readable in RTL too). */
export function AppVersionBadge() {
  return (
    <div
      className="pointer-events-none fixed bottom-3 left-3 z-30 select-none font-mono text-[10px] tabular-nums text-zinc-400 print:hidden dark:text-zinc-600"
      dir="ltr"
      aria-hidden
    >
      v{APP_VERSION}
    </div>
  );
}
