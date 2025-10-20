// components/layout/TopNavigation.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  User,
  Settings,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronDown,
  Clock,
  FileText,
  X,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForms } from "@/lib/hooks/useForms";
import { format } from "date-fns";

export default function TopNavigation({ onMenuClick }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { forms, loading: formsLoading } = useForms(user?.uid);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search forms in real-time
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = forms.filter(
      (form) =>
        form.title?.toLowerCase().includes(query) ||
        form.description?.toLowerCase().includes(query)
    );

    setSearchResults(filtered);
    setSearchOpen(true);
  }, [searchQuery, forms]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        const desktopSearch = document.getElementById("global-search");
        const mobileSearch = document.getElementById("mobile-search");
        if (window.innerWidth < 768) {
          setMobileSearchOpen(true);
          setTimeout(() => mobileSearch?.focus(), 100);
        } else {
          desktopSearch?.focus();
        }
      }

      // Escape to close search
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
        setMobileSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearchResultClick = (formId) => {
    setSearchOpen(false);
    setSearchQuery("");
    setMobileSearchOpen(false);
    router.push(`/forms/${formId}/edit`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchOpen(false);
  };

  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
          {/* LEFT SECTION - Logo + Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                FormCraft
              </span>
            </Link>
          </div>

          {/* MIDDLE SECTION - Active Search Bar (Desktop Only) */}
          <div
            className="flex-1 max-w-2xl mx-4 hidden md:block"
            ref={searchRef}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <input
                id="global-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setSearchOpen(true)}
                placeholder="Search forms... (Ctrl+K)"
                className="w-full pl-11 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />

              {/* Clear Button */}
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {searchOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                    style={{ top: "64px" }}
                    onClick={() => setSearchOpen(false)}
                  />

                  {/* Results Container */}
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl max-h-[500px] overflow-y-auto z-50">
                    {/* Loading State */}
                    {formsLoading && (
                      <div className="p-8 text-center">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Searching...</p>
                      </div>
                    )}

                    {/* No Results */}
                    {!formsLoading &&
                      searchResults.length === 0 &&
                      searchQuery && (
                        <div className="p-8 text-center">
                          <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Search className="w-8 h-8 text-gray-500" />
                          </div>
                          <p className="text-white font-medium mb-1">
                            No forms found
                          </p>
                          <p className="text-gray-400 text-sm">
                            Try searching with different keywords
                          </p>
                        </div>
                      )}

                    {/* Results List */}
                    {!formsLoading && searchResults.length > 0 && (
                      <div className="p-2">
                        <div className="text-xs text-gray-400 px-3 py-2 font-medium">
                          Found {searchResults.length} form
                          {searchResults.length !== 1 ? "s" : ""}
                        </div>
                        <div className="space-y-1">
                          {searchResults.map((form) => (
                            <button
                              key={form.id}
                              onClick={() => handleSearchResultClick(form.id)}
                              className="w-full text-left px-3 py-3 rounded-lg hover:bg-white/10 transition-colors group"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                    <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors truncate">
                                      {form.title}
                                    </h4>
                                  </div>
                                  {form.description && (
                                    <p className="text-gray-400 text-sm line-clamp-1 ml-6">
                                      {form.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 mt-2 ml-6 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>
                                        {form.updatedAt
                                          ? format(
                                              typeof form.updatedAt === "string"
                                                ? new Date(form.updatedAt)
                                                : form.updatedAt.toDate(),
                                              "MMM d, yyyy"
                                            )
                                          : "recently"}
                                      </span>
                                    </div>
                                    <span>•</span>
                                    <span>
                                      {form.fields?.length || 0} fields
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {form.responseCount || 0} responses
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                                    form.status
                                  )} flex-shrink-0`}
                                >
                                  {form.status}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Hint */}
                    {searchResults.length > 0 && (
                      <div className="border-t border-white/10 px-3 py-2 text-xs text-gray-500 flex items-center justify-between">
                        <span>Press Enter to open first result</span>
                        <span>ESC to close</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SECTION - Mobile Search + Notifications + User */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications Button */}
            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {/* Notification Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 lg:space-x-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.displayName?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </span>
                </div>

                {/* User Name (Hidden on mobile) */}
                <span className="hidden lg:block text-white text-sm font-medium max-w-32 truncate">
                  {user?.displayName || user?.email?.split("@")[0] || "User"}
                </span>

                <ChevronDown
                  className={`hidden lg:block w-4 h-4 text-gray-400 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  <div className="px-4 py-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {user?.displayName?.charAt(0)?.toUpperCase() ||
                            user?.email?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    {user?.emailVerified && (
                      <div className="flex items-center space-x-1 text-xs text-green-400">
                        <Shield className="w-3 h-3" />
                        <span>Verified Account</span>
                      </div>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                    >
                      <User className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                    >
                      <Settings className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                      <span>Settings</span>
                    </Link>

                    <Link
                      href="/billing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                    >
                      <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                      <span>Billing</span>
                    </Link>

                    <Link
                      href="/help"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                    >
                      <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                      <span>Help & Support</span>
                    </Link>
                  </div>

                  <div className="border-t border-white/10"></div>

                  {/* Sign Out */}
                  <div className="py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Popup */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeMobileSearch}
          />

          {/* Search Panel */}
          <div className="absolute top-0 left-0 right-0 bg-slate-900 border-b border-white/10 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="p-4">
              {/* Search Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    id="mobile-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search forms..."
                    autoFocus
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={closeMobileSearch}
                  className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
                {/* Loading State */}
                {formsLoading && searchQuery && (
                  <div className="py-12 text-center">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Searching...</p>
                  </div>
                )}

                {/* No Results */}
                {!formsLoading && searchResults.length === 0 && searchQuery && (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-white font-medium mb-1">
                      No forms found
                    </p>
                    <p className="text-gray-400 text-sm">
                      Try different keywords
                    </p>
                  </div>
                )}

                {/* Empty State */}
                {!searchQuery && (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className="text-white font-medium mb-1">Search Forms</p>
                    <p className="text-gray-400 text-sm">
                      Type to search your forms
                    </p>
                  </div>
                )}

                {/* Results List */}
                {!formsLoading && searchResults.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 px-2 py-2 font-medium">
                      {searchResults.length} result
                      {searchResults.length !== 1 ? "s" : ""}
                    </div>
                    <div className="space-y-2">
                      {searchResults.map((form) => (
                        <button
                          key={form.id}
                          onClick={() => handleSearchResultClick(form.id)}
                          className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium truncate mb-1">
                                {form.title}
                              </h4>
                              {form.description && (
                                <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                                  {form.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 flex-wrap">
                                <div
                                  className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                                    form.status
                                  )}`}
                                >
                                  {form.status}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {form.fields?.length || 0} fields
                                </span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">
                                  {form.responseCount || 0} responses
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
