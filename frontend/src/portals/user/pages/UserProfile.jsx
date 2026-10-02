import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';

const formatCreatedAt = (value) => {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString([], { dateStyle: 'medium' })
    : 'Not provided';
};

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    let isActive = true;
    if (!user?.email) {
      setError('Sign in again to view your profile.');
      setIsLoading(false);
      return undefined;
    }
    getDoc(doc(db, 'users', user.email))
      .then((snapshot) => {
        if (!isActive) return;
        if (snapshot.exists()) setProfile(snapshot.data());
      })
      .catch(() => {
        if (isActive) setError('Unable to load your profile. Check your connection and try again.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => { isActive = false; };
  }, [user]);

  const details = [
    { label: 'Full name', value: profile?.Name || profile?.name || user?.displayName || 'Not provided' },
    { label: 'Email address', value: profile?.Email || profile?.email || user?.email || 'Not provided' },
    { label: 'Date of birth', value: profile?.dateOfBirth || 'Not provided' },
    { label: 'Preparation target', value: profile?.preparationTarget || profile?.target || profile?.Target || 'Not provided' },
    { label: 'Registration ID', value: profile?.registration_ID ?? 'Not provided' },
    { label: 'Account status', value: profile?.status || 'Not provided' },
    { label: 'Member since', value: formatCreatedAt(profile?.createdAt) },
  ];

  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="mb-7 border-b border-slate-800 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Account details</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Your profile</h2>
        <p className="mt-2 text-sm text-slate-400">Your student account information.</p>
      </div>
      {isLoading ? <p role="status" className="text-sm text-slate-400">Loading profile...</p> : error ? (
        <p role="alert" className="border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>
      ) : (
        <div className="border border-slate-800 bg-slate-900 p-5 sm:p-7">
          <dl className="divide-y divide-slate-800">
            {details.map((detail) => (
              <div key={detail.label} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] sm:gap-6">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{detail.label}</dt>
                <dd className="break-words text-sm text-slate-200">{detail.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 border-t border-slate-800 pt-5">
            <Link to="/user-dashboard/settings" className="inline-flex rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300">
              Edit profile details
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}