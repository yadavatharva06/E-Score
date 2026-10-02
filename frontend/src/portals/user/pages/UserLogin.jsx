import { useState } from "react";
import icon from '../../../assects/icons/google-small.png';
import { auth, db } from '../../../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { deleteField, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { RegistrationIdGenerator } from '../../../components/private/RegistrationIdGenerator';

function UserLogin() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const ensureUserIsActive = async (user) => {
    const profileRef = doc(db, 'users', user.email);
    const profileSnapshot = await getDoc(profileRef);

    if (!profileSnapshot.exists() || profileSnapshot.data().status === 'Suspended') {
      await signOut(auth);
      throw new Error(profileSnapshot.exists()
        ? 'Your account has been suspended. Contact an administrator.'
        : 'Your user profile could not be found.');
    }

    if (Object.prototype.hasOwnProperty.call(profileSnapshot.data(), 'Password')) {
      try {
        await updateDoc(profileRef, { Password: deleteField() });
      } catch (error) {
        console.warn('Could not remove a legacy plaintext password from the user profile:', error);
      }
    }
  };

  // Save new user data in Firestore after registration
  const saveUserData = async (uName, uEmail, uid) => {
    try {
      const userDocRef = doc(db, 'users', uEmail);
      const existingDoc = await getDoc(userDocRef);
      // Only create a new document if one doesn't already exist (handles Google re-login)
      if (!existingDoc.exists()) {
        const RID = RegistrationIdGenerator();
        const numRID = parseInt(RID, 10);
        await setDoc(userDocRef, {
          Name: uName,
          Email: uEmail,
          registration_ID: numRID,
          UID: uid,
          Role: 'student',
          status: 'Active',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Firestore save error:', error);
      throw error;
    }
  };

  // New user register
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await saveUserData(name, user.email, user.uid);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'student');
      navigate('/user-dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(`Registration Error: ${error.code || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign-in or sign-up
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      await saveUserData(user.displayName, user.email, user.uid);
      await ensureUserIsActive(user);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'student');
      navigate('/user-dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(`Google Auth Error: ${error.code || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Login existing user
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await ensureUserIsActive(userCredential.user);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'student');
      navigate('/user-dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(`Login Error: ${error.code || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = (isSignupView) => {
    setIsSignup(isSignupView);
    setEmail('');
    setPassword('');
    setName('');
    setErrorMessage('');
  };

  const inputClass =
    'w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm';
  const labelClass =
    'block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 text-2xl font-black shadow-lg shadow-amber-500/20 mb-4">
            ⚡
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isSignup ? 'Create Account' : 'Student Portal'}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {isSignup
              ? 'Register to begin your mock exam journey'
              : 'Sign in to access your E-Score dashboard'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => toggleAuthMode(false)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              !isSignup
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => toggleAuthMode(true)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              isSignup
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
            <span className="text-base leading-none">⚠️</span>
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={isSignup ? handleRegister : handleLogin} className="space-y-5">
          {isSignup && (
            <div>
              <label htmlFor="name" className={labelClass}>Full Name</label>
              <input
                type="text"
                id="name"
                className={inputClass}
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="user-email" className={labelClass}>Email Address</label>
            <input
              type="email"
              id="user-email"
              className={inputClass}
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label htmlFor="user-password" className={labelClass}>Password</label>
            <input
              type="password"
              id="user-password"
              className={inputClass}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-xs text-slate-500 uppercase tracking-wider">or continue with</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-xl text-slate-200 text-sm font-semibold flex items-center justify-center gap-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <img src={icon} alt="Google icon" className="w-5 h-5" />
          <span>{isSignup ? 'Sign Up' : 'Sign In'} with Google</span>
        </button>

        {/* Back to Home */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-amber-400 transition"
          >
            <span>←</span> Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
