import { LoginLoadingFallback } from "@/components/login-loading-fallback";
import { Suspense } from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>{children}</Suspense>
  );
}
