// components/form-fill/SuccessScreen.jsx
"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, Sparkles, Home } from "lucide-react";
import { useRouter } from "next/navigation";

const SuccessScreen = ({
  message = "Thank you for your response!",
  redirectUrl = null,
  allowMultiple = false,
  onSubmitAnother,
}) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const confettiTimer = setTimeout(() => setConfetti(false), 3000);

    // Auto-redirect if URL provided
    if (redirectUrl && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      if (countdown === 1) {
        window.location.href = redirectUrl;
      }

      return () => clearTimeout(timer);
    }

    return () => clearTimeout(confettiTimer);
  }, [countdown, redirectUrl]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 
                    flex items-center justify-center p-6 relative overflow-hidden"
      role="status"
      aria-live="polite"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Confetti Effect */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          ))}
        </div>
      )}

      {/* Success Card */}
      <div
        className="relative max-w-md w-full bg-slate-800/60 backdrop-blur-xl border border-white/10 
                      rounded-2xl shadow-2xl p-8 text-center animate-scale-in"
        role="dialog"
        aria-label="Success"
      >
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce-in">
          <CheckCircle className="w-12 h-12 text-white" aria-hidden="true" />
        </div>

        {/* Success Message */}
  <h2 className="text-3xl font-bold text-white mb-3">Form Submitted!</h2>
  <p className="text-lg text-gray-300 mb-6">{message}</p>

        {/* Redirect Countdown */}
        {redirectUrl && countdown > 0 && (
          <p className="text-sm text-gray-400 mb-6">
            Redirecting in{" "}
            <span className="text-purple-400 font-bold">{countdown}</span>{" "}
            seconds...
          </p>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {allowMultiple && onSubmitAnother && (
            <button
              onClick={onSubmitAnother}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-95 transition-all shadow-lg"
              aria-label="Submit another response"
            >
              Submit Another Response
            </button>
          )}

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full px-6 py-3 bg-white/6 border border-white/10 text-gray-200 font-semibold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            aria-label="Go to dashboard"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go to Dashboard
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
};

export default SuccessScreen;
