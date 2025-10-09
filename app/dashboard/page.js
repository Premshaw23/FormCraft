"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import OverviewContent from "@/components/dashboard/OverviewContent";
import CreateFormContent from "@/components/dashboard/CreateFormContent";
import UpdateFormContent from "@/components/dashboard/UpdateFormContent";
import ListFormContent from "@/components/dashboard/ListFormContent";
import CheckResponsesContent from "@/components/dashboard/CheckResponsesContent";
import SignOutModal from "@/components/SignOutModal";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("overview");
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOut = () => {
    setShowSignOutModal(true);
  };

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <OverviewContent user={user} />;
      case "create":
        return <CreateFormContent />;
      case "update":
        return <UpdateFormContent />;
      case "list":
        return <ListFormContent />;
      case "check":
        return <CheckResponsesContent />;
      default:
        return <OverviewContent user={user} />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navbar */}
        <DashboardNavbar onSignOut={handleSignOut} />

        {/* Main Layout */}
        <div className="flex">
          {/* Sidebar */}
          <DashboardSidebar
            activeView={activeView}
            onViewChange={setActiveView}
          />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto h-[calc(100vh-73px)]">
            {renderContent()}
          </main>
        </div>

        {/* Sign Out Modal */}
        <SignOutModal
          isOpen={showSignOutModal}
          onClose={() => setShowSignOutModal(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
