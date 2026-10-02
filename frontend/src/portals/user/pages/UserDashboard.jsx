import { useState } from 'react';
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import UserProfile from './UserProfile';
import UserSetting from './UserSetting';
import MockTests from './MockTests';
import MockTestAnalysis from './MockTestAnalysis';

const navigation = [
  { label: 'Profile', description: 'View your personal details', path: '/user-dashboard/profile', icon: '👤', component: UserProfile },
  { label: 'Mock Tests', description: 'Scheduled student examinations', path: '/user-dashboard/mock-tests', icon: '📝', component: MockTests },
  { label: 'Mock Test Analysis', description: 'Scores and subject performance', path: '/user-dashboard/analysis', icon: '📊', component: MockTestAnalysis },
  { label: 'Settings', description: 'Update your details', path: '/user-dashboard/settings', icon: '⚙️', component: UserSetting },
];

function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeItem = navigation.find((item) => (
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)
  ));

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      navigate('/user-login', { replace: true });
    } catch {
      window.alert('Unable to sign out. Please try again.');
    }
  };

  if (!activeItem) return <Navigate to="/user-dashboard/profile" replace />;
  const ActiveComponent = activeItem.component;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 md:flex">
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden" />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col justify-between border-r border-slate-800 bg-slate-900/95 backdrop-blur-md transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-xl font-black text-slate-950 shadow-md shadow-amber-500/20">E</div>
              <div>
                <h1 className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-white">
                  E-Score
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">Student</span>
                </h1>
                <p className="text-xs text-slate-400">Personal Learning Workspace</p>
              </div>
            </div>
            <button type="button" aria-label="Close navigation menu" onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden">✕</button>
          </div>
          <nav aria-label="Student navigation" className="space-y-1.5 p-4">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Workspace Navigation</div>
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition-all duration-200 ${isActive ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-orange-500/10 font-semibold text-amber-400 shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'}`}
              >
                <span className="w-6 text-center text-lg" aria-hidden="true">{item.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block leading-tight">{item.label}</span>
                  <span className="mt-1 block text-[11px] font-normal text-slate-500">{item.description}</span>
                </span>
                {activeItem.path === item.path && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="border-t border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-3 flex items-center gap-2.5 px-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-400">Session: Operational</span>
          </div>
          <button type="button" onClick={handleLogOut} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-400 transition duration-200 hover:bg-rose-500/20 hover:text-rose-300">
            <span aria-hidden="true">↪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3.5 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Open Navigation Menu" onClick={() => setMobileMenuOpen(true)} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">{activeItem.label}</h2>
              <p className="hidden text-xs text-slate-400 sm:block">{activeItem.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 sm:flex">
              <span className="h-2 w-2 rounded-full bg-amber-400" />Student Portal
            </div>
            <button type="button" onClick={() => navigate('/user-dashboard/profile')} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm transition hover:border-amber-500" title="View Profile" aria-label="View profile">👤</button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;