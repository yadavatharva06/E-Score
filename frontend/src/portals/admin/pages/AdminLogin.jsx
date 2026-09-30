import React, { useState } from "react";
import { auth, db } from '../../../config/firebase';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // admin login handle
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, 'admin', userCredential.user.email);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists() || docSnap.data().Role !== 'admin') {
        await signOut(auth);
        setErrorMessage(
          docSnap.exists()
            ? 'Access denied: this account is not authorized as an administrator.'
            : 'Admin record not found. Contact an administrator.'
        );
        return;
      }

      await updateDoc(docRef, { lastLoginAt: serverTimestamp() });

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      navigate('/admin-dashboard', { replace: true });
    } catch (error) {
      if (auth.currentUser) {
        await signOut(auth).catch(() => {});
      }
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      setErrorMessage(`Login Error: ${error.code || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background glow decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 text-2xl font-black shadow-lg shadow-amber-500/20 mb-4">
            ⚡
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Admin Console
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Secure authorization checkpoint for E-Score administrators
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
            <span className="text-base leading-none">⚠️</span>
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label 
              htmlFor="admin-email" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
            >
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@escore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="admin-email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label 
                htmlFor="admin-password" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="admin-password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-sm tracking-wide flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-amber-400 transition"
          >
            <span>←</span> Back to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
