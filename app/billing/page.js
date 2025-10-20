// ============================================
// app/billing/page.js (CONTINUED)
// ============================================

"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  Crown,
  ArrowRight,
  Receipt,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function BillingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [billingData, setBillingData] = useState({
    currentPlan: "free",
    billingCycle: "monthly",
    nextBillingDate: null,
    paymentMethod: null,
    invoices: [],
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    loadBillingData();
  }, [user, router]);

  const loadBillingData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setBillingData({
          currentPlan: userData.plan || "free",
          billingCycle: userData.billingCycle || "monthly",
          nextBillingDate: userData.nextBillingDate || null,
          paymentMethod: userData.paymentMethod || null,
          invoices: userData.invoices || [],
        });
      }
    } catch (error) {
      console.error("Error loading billing data:", error);
      toast.error("Failed to load billing information");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan) => {
    toast.success(`Upgrade to ${plan} plan coming soon!`);
    // Here you would integrate with Stripe/PayPal
  };

  const handleCancelSubscription = async () => {
    if (confirm("Are you sure you want to cancel your subscription?")) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          plan: "free",
          cancelledAt: new Date(),
        });
        toast.success("Subscription cancelled successfully");
        loadBillingData();
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        toast.error("Failed to cancel subscription");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Billing & Subscription
          </h1>
          <p className="text-gray-400">
            Manage your subscription and billing information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Current Plan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan Card */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Current Plan
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-white capitalize">
                      {billingData.currentPlan}
                    </span>
                    {billingData.currentPlan !== "free" && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                {billingData.currentPlan === "free" ? (
                  <button
                    onClick={() => router.push("/pricing")}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Upgrade
                  </button>
                ) : (
                  <button
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/30 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {billingData.currentPlan !== "free" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Billing Cycle</p>
                    <p className="text-white font-medium capitalize">
                      {billingData.billingCycle}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">
                      Next Billing Date
                    </p>
                    <p className="text-white font-medium">
                      {billingData.nextBillingDate
                        ? new Date(
                            billingData.nextBillingDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {billingData.currentPlan === "free" && (
                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-purple-300 text-sm">
                    Upgrade to unlock unlimited forms, advanced analytics, and
                    priority support!
                  </p>
                </div>
              )}
            </div>

            {/* Available Plans */}
            {billingData.currentPlan === "free" && (
              <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Available Plans
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-purple-500/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Pro</h3>
                          <p className="text-gray-400 text-sm">
                            For professionals
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-white">$19</p>
                        <p className="text-gray-400 text-sm">/month</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Unlimited forms
                      </li>
                      <li className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        10,000 responses/month
                      </li>
                      <li className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Advanced analytics
                      </li>
                    </ul>
                    <button
                      onClick={() => handleUpgrade("Pro")}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Upgrade to Pro
                    </button>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-purple-500/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                          <Crown className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            Enterprise
                          </h3>
                          <p className="text-gray-400 text-sm">
                            For organizations
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-white">$99</p>
                        <p className="text-gray-400 text-sm">/month</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Unlimited everything
                      </li>
                      <li className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        White-label solution
                      </li>
                      <li className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        24/7 priority support
                      </li>
                    </ul>
                    <button
                      onClick={() =>
                        (window.location.href = "mailto:sales@formcraft.com")
                      }
                      className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice History */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Invoice History
              </h2>
              {billingData.invoices.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No invoices yet</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Your invoice history will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {billingData.invoices.map((invoice, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {invoice.description}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {invoice.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-semibold">
                          ${invoice.amount}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Payment Method & Usage */}
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Payment Method
              </h2>
              {billingData.paymentMethod ? (
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-6 h-6 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">
                        •••• •••• •••• {billingData.paymentMethod.last4}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Expires {billingData.paymentMethod.expiry}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-lg p-4 mb-4 text-center">
                  <CreditCard className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    No payment method added
                  </p>
                </div>
              )}
              <button className="w-full py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
                {billingData.paymentMethod ? "Update" : "Add"} Payment Method
              </button>
            </div>

            {/* Usage Stats */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Current Usage
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Forms</span>
                    <span className="text-white font-medium">
                      2 / {billingData.currentPlan === "free" ? "3" : "∞"}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: "66%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Responses</span>
                    <span className="text-white font-medium">45 / 100</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Storage</span>
                    <span className="text-white font-medium">
                      1.2 GB / 5 GB
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: "24%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {billingData.currentPlan === "free" && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-300 text-sm">
                      You're close to your limit. Upgrade to get unlimited
                      access!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/pricing")}
                  className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left"
                >
                  <span className="text-white">View All Plans</span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left">
                  <span className="text-white">Download Invoices</span>
                  <Download className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left">
                  <span className="text-white">Billing Settings</span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
