// app/(dashboard)/settings/page.js
"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Bell,
  Trash2,
  Save,
  Loader2,
  Camera,
  Shield,
  Monitor,
  MapPin,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  updateProfile,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Active tab
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Email preferences
  const [emailNotifications, setEmailNotifications] = useState({
    responseNotifications: true,
    weeklySummary: true,
    productUpdates: false,
    marketingEmails: false,
  });

  // Security state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Tabs configuration
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Mail },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  // Handle profile update
  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      await updateProfile(user, {
        displayName: displayName,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setChangingPassword(true);

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.code === "auth/wrong-password") {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      await deleteUser(user);
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please sign in again and try.");
    }
  };

  // Render Profile Tab
  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
        <p className="text-gray-400">Manage your public profile information</p>
      </div>

      {/* Avatar Section */}
      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
        <label className="block text-sm font-semibold text-gray-400 mb-4">
          Profile Picture
        </label>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.displayName?.[0]?.toUpperCase() ||
              user?.email?.[0]?.toUpperCase() ||
              "U"}
          </div>
          <div>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all flex items-center gap-2 mb-2">
              <Camera className="w-4 h-4" />
              Change Avatar
            </button>
            <p className="text-xs text-gray-500">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Display Name */}
      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
        <label className="block text-sm font-semibold text-gray-400 mb-2">
          Display Name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </div>

      {/* Email (Read-only) */}
      <div className="bg-slate-800/50 border border-white/10 rounded-xl md:p-6 p-3">
        <label className="block text-sm font-semibold text-gray-400 mb-2">
          Email Address
        </label>
        <div className="flex items-center md:gap-3 gap-1">
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="flex-1 px-3 py-3 bg-slate-900/30 border border-white/5 rounded-lg text-gray-400 cursor-not-allowed"
          />
          <span className="md:px-3 px-1 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
            Verified
          </span>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
        <label className="block text-sm font-semibold text-gray-400 mb-2">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
        />
        <p className="text-xs text-gray-500 mt-2">
          {bio.length}/500 characters
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Render Account Tab
  const renderAccountTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Account Settings</h2>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      {/* Language & Region */}
      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
        <label className="block text-sm font-semibold text-gray-400 mb-2">
          Language
        </label>
        <select className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
          <option>English</option>
          <option>Hindi</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>

      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
        <label className="block text-sm font-semibold text-gray-400 mb-2">
          Timezone
        </label>
        <select className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
          <option>Asia/Kolkata (IST)</option>
          <option>America/New_York (EST)</option>
          <option>Europe/London (GMT)</option>
          <option>Asia/Tokyo (JST)</option>
        </select>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h3>
        <p className="text-gray-400 mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
          >
            Delete Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-300">
              Type <span className="font-bold text-red-400">DELETE</span> to
              confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-2 bg-slate-900/50 border border-red-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE"}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Permanently Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render Security Tab
  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Security Settings
        </h2>
        <p className="text-gray-400">
          Manage your password and security preferences
        </p>
      </div>

      {/* Change Password */}
      <form
        onSubmit={handleChangePassword}
        className="bg-slate-800/50 border border-white/10 rounded-xl p-6 space-y-4"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Change Password
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <button
          type="submit"
          disabled={changingPassword}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {changingPassword ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Changing Password...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Change Password
            </>
          )}
        </button>
      </form>

      {/* Active Sessions */}
      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Active Sessions
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-medium">Current Session</p>
                <p className="text-sm text-gray-400">
                  Chrome on Windows • Tumkūr, Karnataka
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
              Active Now
            </span>
          </div>
        </div>

        <button className="mt-4 w-full px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all">
          Sign Out All Other Sessions
        </button>
      </div>
    </div>
  );

  // Render Notifications Tab
  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Notification Preferences
        </h2>
        <p className="text-gray-400">Choose what updates you want to receive</p>
      </div>

      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 space-y-4">
        {[
          {
            key: "responseNotifications",
            label: "Response Notifications",
            description: "Get notified when someone fills your form",
          },
          {
            key: "weeklySummary",
            label: "Weekly Summary",
            description: "Receive weekly analytics about your forms",
          },
          {
            key: "productUpdates",
            label: "Product Updates",
            description: "Stay updated with new features and improvements",
          },
          {
            key: "marketingEmails",
            label: "Marketing Emails",
            description: "Receive tips, tricks, and best practices",
          },
        ].map((notification) => (
          <div
            key={notification.key}
            className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg"
          >
            <div>
              <p className="text-white font-medium">{notification.label}</p>
              <p className="text-sm text-gray-400">
                {notification.description}
              </p>
            </div>
            <button
              onClick={() =>
                setEmailNotifications((prev) => ({
                  ...prev,
                  [notification.key]: !prev[notification.key],
                }))
              }
              className={`relative w-12 h-6 rounded-full transition-all ${
                emailNotifications[notification.key]
                  ? "bg-purple-500"
                  : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  emailNotifications[notification.key] ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save Preferences
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64">
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? "bg-purple-500/20 text-purple-400 border-l-4 border-purple-500"
                        : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "account" && renderAccountTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
