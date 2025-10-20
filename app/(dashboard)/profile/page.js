// app/(dashboard)/profile/page.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
// At the top of ProfilePage
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore"; // Add setDoc
import {
  User,
  Mail,
  Calendar,
  Shield,
  Camera,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { updateProfile } from "firebase/auth";
// At the top of AuthPage
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    bio: "",
    phone: "",
    company: "",
    location: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // In ProfilePage - loadProfile function
    const loadProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        // If document doesn't exist, create it
        if (!userDoc.exists()) {
          const initialData = {
            email: user.email || "",
            displayName: user.displayName || "",
            createdAt: new Date(),
            updatedAt: new Date(),
            bio: "",
            phone: "",
            company: "",
            location: "",
          };

          await setDoc(userRef, initialData);

          setProfileData({
            displayName: user.displayName || "",
            email: user.email || "",
            bio: "",
            phone: "",
            company: "",
            location: "",
          });
        } else {
          const userData = userDoc.data();
          setProfileData({
            displayName: user.displayName || userData.displayName || "",
            email: user.email || "",
            bio: userData.bio || "",
            phone: userData.phone || "",
            company: userData.company || "",
            location: userData.location || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, router]);

  // In ProfilePage - handleSave function
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update Firebase Auth profile
      if (profileData.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: profileData.displayName,
        });
      }

      // Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: profileData.displayName, // ADD THIS LINE
        bio: profileData.bio,
        phone: profileData.phone,
        company: profileData.company,
        location: profileData.location,
        updatedAt: new Date(),
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              {/* Avatar */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">
                    {profileData.displayName?.charAt(0)?.toUpperCase() ||
                      profileData.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 rounded-full border-4 border-slate-800 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {profileData.displayName || "User"}
                </h3>
                <p className="text-gray-400 text-sm">{profileData.email}</p>
              </div>

              {/* Stats */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Account Type</span>
                  <span className="text-white font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white font-medium">
                    {user?.metadata?.creationTime
                      ? format(new Date(user.metadata.creationTime), "MMM yyyy")
                      : "Recently"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Email Verified</span>
                  {user?.emailVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Profile Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  Personal Information
                </h2>

                <div className="space-y-4">
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profileData.displayName}
                      onChange={(e) =>
                        handleChange("displayName", e.target.value)
                      }
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Additional Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="Your company"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Location */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="City, Country"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
