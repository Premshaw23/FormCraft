"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { sendEmailVerification } from "firebase/auth";
import { Mail, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [redirectUrl, setRedirectUrl] = useState("/dashboard");

  useEffect(() => {
    // Get redirect URL from URL
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      if (redirect) {
        setRedirectUrl(decodeURIComponent(redirect));
      }
    }
  }, []);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/auth");
      return;
    }

    // Redirect if already verified
    if (user?.emailVerified) {
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectUrl]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!user || countdown > 0) return;

    setResending(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification email sent! Check your inbox.");
      setCountdown(60); // 60 second cooldown
    } catch (error) {
      console.error("Error sending verification email:", error);
      if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error("Failed to send email. Please try again.");
      }
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;

    setIsVerifying(true);
    try {
      // Reload user to get latest verification status
      await user.reload();

      if (user.emailVerified) {
        toast.success("Email verified successfully!");
        router.push(redirectUrl);
      } else {
        toast.error("Email not verified yet. Please check your inbox.");
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      toast.error("Failed to check verification status.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          {/* Icon */}
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-purple-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Verify Your Email
          </h1>

          {/* Email Display */}
          <p className="text-gray-400 text-center mb-6">
            We sent a verification link to:
            <span className="block text-purple-400 font-medium mt-1">
              {user?.email}
            </span>
          </p>

          {/* Instructions */}
          <div className="bg-slate-900/50 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 text-sm font-semibold">1</span>
              </div>
              <p className="text-gray-300 text-sm">
                Check your email inbox (and spam folder)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 text-sm font-semibold">2</span>
              </div>
              <p className="text-gray-300 text-sm">
                Click the verification link in the email
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 text-sm font-semibold">3</span>
              </div>
              <p className="text-gray-300 text-sm">
                Return here and click "I've Verified"
              </p>
            </div>
          </div>

          {/* Check Verification Button */}
          <button
            onClick={handleCheckVerification}
            disabled={isVerifying}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                I've Verified My Email
              </>
            )}
          </button>

          {/* Resend Email Button */}
          <button
            onClick={handleResendEmail}
            disabled={resending || countdown > 0}
            className="w-full bg-slate-700/50 hover:bg-slate-700 text-gray-300 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              <>
                <RefreshCw className="w-5 h-5" />
                Resend Email ({countdown}s)
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Resend Verification Email
              </>
            )}
          </button>

          {/* Help Text */}
          <p className="text-gray-500 text-sm text-center mt-6">
            Didn't receive the email? Check your spam folder or try resending.
          </p>

          {/* Sign Out Link */}
          <button
            onClick={() => {
              // Add sign out logic here
              router.push("/auth");
            }}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium mt-4 block mx-auto transition-colors"
          >
            Sign out and use a different email
          </button>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-slate-800/30 backdrop-blur-xl rounded-xl border border-slate-700/30 p-4">
          <p className="text-gray-400 text-sm text-center">
            <span className="text-purple-400 font-medium">Why verify?</span>
            <br />
            Email verification helps keep your account secure and enables
            important notifications.
          </p>
        </div>
      </div>
    </div>
  );
}
