"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
  children,
  requireVerification = true,
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to auth page
      if (!user) {
        router.push(`/auth?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Authenticated but email not verified - redirect to verify page
      // Skip verification check for the verify page itself
      if (
        requireVerification &&
        !user.emailVerified &&
        pathname !== "/verify"
      ) {
        router.push(`/verify?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // If user is authenticated and verified, check if there's a redirect parameter
      // This handles the case when they return after auth/verification
      const redirectTo = searchParams.get("redirect");
      if (redirectTo && redirectTo !== pathname) {
        router.push(redirectTo);
      }
    }
  }, [user, loading, router, pathname, requireVerification, searchParams]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not verified, show nothing (will redirect)
  if (
    !user ||
    (requireVerification && !user.emailVerified && pathname !== "/verify")
  ) {
    return null;
  }

  // User is authenticated and verified (or verification not required), show the protected content
  return <>{children}</>;
}
