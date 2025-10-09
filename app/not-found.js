"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-center px-4">
      <h1 className="text-7xl font-extrabold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-100 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-300 mb-8 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-2 rounded-full bg-purple-600 text-white hover:bg-blue-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Home
      </Link>
    </div>
  );
}
