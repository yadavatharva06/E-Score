import React, { useState, useEffect } from "react";
import adminicon from '../../../assects/icons/admin-big.png';
import { auth, db } from "../../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function AdminProfile() {
  const [adminFullName, setAdminFullName] = useState("");
  const [lastLoginAt, setLastLoginAt] = useState("Not available");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  const currentUser = auth.currentUser;
  const adminId = currentUser?.email;

  useEffect(() => {
    async function fetchAdminName() {
      // Prevent fetching if no user session is found
      if (!adminId) {
        setError("No authenticated administrative session detected.");
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "admin", adminId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const adminData = docSnap.data();
          setAdminFullName(adminData.Name || "System Administrator");
          setLastLoginAt(
            adminData.lastLoginAt?.toDate
              ? adminData.lastLoginAt.toDate().toLocaleString()
              : "Not available"
          );
        } else {
          setError("Admin document record not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile info.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminName();
  }, [adminId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!adminId) return;

    setIsSaving(true);
    setError("");

    try {
      const docRef = doc(db, "admin", adminId);
      await updateDoc(docRef, {
        Name: adminFullName,
        lastModifiedAt: new Date()
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to synchronize alterations. Check Firestore rules.");
    } finally {
      setIsSaving(false);
    }
  };

  // ... keep the rest of your JSX rendering elements exactly the same

  if (isLoading) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        Loading administrative credentials...
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-5 mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <span className="text-amber-500">👤</span>
          <span>Master Administrative Profile</span>
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Review core credential parameters, update root identity attributes, and inspect operational session timestamps.
        </p>
      </div>

      {/* Success Notification Alert banner */}
      {isSaved && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 animate-fade-in">
          <span>✅</span>
          <span>Profile configurations updated and synchronized successfully!</span>
        </div>
      )}

      {/* Error Notification Alert banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Avatar Column */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
          <div className="relative mb-4 group">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-amber-500 to-orange-400 shadow-xl shadow-amber-500/20">
              <img
                src={adminicon}
                alt="Admin Icon Profile"
                className="w-full h-full object-cover rounded-full bg-slate-950 p-2"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online" />
          </div>

          <h4 className="text-lg font-bold text-white tracking-tight min-h-[28px]">
            {adminFullName}
          </h4>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span>🛡️</span>
            <span>Root Level Account</span>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-slate-800/80 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Security Clearance</span>
              <span className="font-semibold text-slate-200">Level 1 (Highest)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Two-Factor Auth</span>
              <span className="font-semibold text-emerald-400">Enabled</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Account Status</span>
              <span className="font-semibold text-emerald-400">Verified & Active</span>
            </div>
          </div>
        </div>

        {/* Right Side: Identity Specifications Form */}
        <form className="lg:col-span-2 space-y-6 bg-slate-800/20 border border-slate-800/60 rounded-2xl p-6 sm:p-8" onSubmit={handleUpdateProfile}>
          
          {/* Administrator Full Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Administrator Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
              value={adminFullName}
              onChange={(e) => setAdminFullName(e.target.value)}
              required
              disabled={isSaving}
            />
          </div>

          {/* Unchangeable Registered Office Email Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Registered Office Email
              </label>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                🔒 Immutable
              </span>
            </div>
            <input
              type="email"
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed text-sm"
              value={currentUser.email}
              disabled
            />
          </div>

          {/* Last Login Date & Time Operational Tracking Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Last Login Date & Time
              </label>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                🕒 Audited
              </span>
            </div>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed text-sm"
              value={lastLoginAt}
              disabled
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.99] transition duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>💾</span>
              <span>{isSaving ? "Synchronizing Name..." : "Save Profile Alterations"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
