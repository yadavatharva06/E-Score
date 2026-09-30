import React, { useState } from 'react';
import { auth } from '../../../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AdminSetting from './AdminSetting';
import FeedExamDetail from './FeedExamDetail';
import CreateLiveExam from './CreateLiveExam';
import ManageUsers from './ManageUsers';
import AdminProfile from './AdminProfile';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('adminProfile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminLogOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        navigate('/admin-login', { replace: true });
      })
      .catch((error) => {
        alert(`Admin Logout Error: ${error.code}`);
      });
  };

  const navItems = [
    { id: 'adminProfile', label: 'Admin Profile', icon: '👤', description: 'Account settings & details' },
    { id: 'FeedExamDetail', label: 'Feed Exam Detail', icon: '📊', description: 'Question bank & categories' },
    { id: 'createLiveExam', label: 'Create Live Exam', icon: '📝', description: 'Deploy live mock tests' },
    { id: 'manageUsers', label: 'User Control', icon: '🧑‍🎓', description: 'Manage student rosters' },
    { id: 'setting', label: 'System Settings', icon: '⚙️', description: 'Security & admin credentials' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } h-screen`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/20">
                E
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  E-Score
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Admin
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Master Control Matrix</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Workspace Navigation
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/40 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <div className="leading-tight">{item.label}</div>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="mb-3 px-2 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">Session: Operational</span>
          </div>
          <button
            onClick={handleAdminLogOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 rounded-xl transition duration-200"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Open Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {navItems.find((item) => item.id === activeTab)?.label || 'Administrator Panel'}
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">
                {navItems.find((item) => item.id === activeTab)?.description || 'Centralized administrative controls'}
              </p>
            </div>
          </div>

          {/* Quick Info Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Admin Root</span>
            </div>
            <button
              onClick={() => setActiveTab('adminProfile')}
              className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm hover:border-amber-500 transition"
              title="View Profile"
            >
              👤
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'adminProfile' && <AdminProfile />}
          {activeTab === 'FeedExamDetail' && <FeedExamDetail />}
          {activeTab === 'createLiveExam' && <CreateLiveExam />}
          {activeTab === 'manageUsers' && <ManageUsers />}
          {activeTab === 'setting' && <AdminSetting />}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
