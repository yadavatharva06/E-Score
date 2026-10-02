import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';

const inputClass = 'mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400';

export default function UserSetting() {
  const [form, setForm] = useState({ name: '', dateOfBirth: '', preparationTarget: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    let isActive = true;
    if (!user?.email) {
      setError('Sign in again to load your settings.');
      setIsLoading(false);
      return undefined;
    }

    getDoc(doc(db, 'users', user.email))
      .then((snapshot) => {
        if (!isActive) return;
        const data = snapshot.exists() ? snapshot.data() : {};
        setForm({
          name: data.Name || data.name || user.displayName || '',
          dateOfBirth: data.dateOfBirth || '',
          preparationTarget: data.preparationTarget || data.target || data.Target || '',
        });
      })
      .catch(() => {
        if (isActive) setError('Unable to load your settings. Check your connection and try again.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => { isActive = false; };
  }, [user]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?.email) {
      setError('Sign in again to update your details.');
      return;
    }

    setIsSaving(true);
    setError('');
    setMessage('');
    try {
      await setDoc(doc(db, 'users', user.email), {
        Name: form.name.trim(),
        Email: user.email,
        dateOfBirth: form.dateOfBirth,
        preparationTarget: form.preparationTarget.trim(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setMessage('Your details have been updated.');
    } catch {
      setError('Unable to save your details. Check your connection and Firestore permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="mb-7 border-b border-slate-800 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Account settings</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Update your details</h2>
        <p className="mt-2 text-sm text-slate-400">Edit the personal information saved to your student account.</p>
      </div>
      {isLoading ? <p role="status" className="text-sm text-slate-400">Loading settings...</p> : (
        <form onSubmit={handleSubmit} className="space-y-6 border border-slate-800 bg-slate-900 p-5 sm:p-7">
          {message && <p role="status" className="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</p>}
          {error && <p role="alert" className="border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
          <div className="space-y-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Full name
              <input className={inputClass} name="name" value={form.name} onChange={handleChange} autoComplete="name" required maxLength={100} />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email address
              <input className={`${inputClass} cursor-not-allowed text-slate-500`} type="email" value={user?.email || ''} readOnly />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Date of birth
              <input className={inputClass} type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} max={new Date().toISOString().slice(0, 10)} />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Preparation target
              <input className={inputClass} name="preparationTarget" value={form.preparationTarget} onChange={handleChange} placeholder="e.g. Civil Services 2027" maxLength={120} />
            </label>
          </div>
          <div className="border-t border-slate-800 pt-5">
            <button type="submit" disabled={isSaving} className="rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60">
              {isSaving ? 'Updating...' : 'Update details'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}