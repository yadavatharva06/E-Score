import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStudentLogin = () => {
    navigate('/user-login');
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* 🧭 Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
                ⚡
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                E-<span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Score</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
              <a href="#features" className="hover:text-amber-400 transition-colors">
                Features
              </a>
              <a href="#advantages" className="hover:text-amber-400 transition-colors">
                Advantages
              </a>
              <a href="#interface" className="hover:text-amber-400 transition-colors">
                Exam Interface
              </a>
            </div>

            {/* Desktop Auth CTAs */}
            <div className="hidden md:flex items-center gap-3.5">
              <button
                onClick={handleAdminLogin}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition"
              >
                Admin Console
              </button>
              <button
                onClick={handleStudentLogin}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-md shadow-amber-500/25 active:scale-95 transition"
              >
                Student Login
              </button>
            </div>

            {/* Mobile Hamburger Toggle when screen size decrese*/}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <span className="text-xl font-bold">✕</span>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800/60 rounded-lg"
            >
              Features
            </a>
            <a
              href="#advantages"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800/60 rounded-lg"
            >
              Advantages
            </a>
            <a
              href="#interface"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800/60 rounded-lg"
            >
              Exam Interface
            </a>
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3">
              <button
                onClick={() => { setMobileMenuOpen(false); handleAdminLogin(); }}
                className="w-full py-2.5 text-center text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl border border-slate-700"
              >
                Admin
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); handleStudentLogin(); }}
                className="w-full py-2.5 text-center text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-xl shadow-md"
              >
                Student Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 🚀 Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Ambient radial glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-amber-400 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Official Pattern Simulator for 2026 Aspirants</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight sm:leading-tight md:leading-tight">
            Master Your Competitive Exams with{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              E-Score
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience the closest digital simulation to real test centres. Practice with high-precision mock tests, benchmark your percentile, and conquer exam anxiety.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStudentLogin}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-2xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all duration-200 text-base flex items-center justify-center gap-2.5"
            >
              <span>Explore Mock Tests</span>
              <span>→</span>
            </button>
            <a
              href="#interface"
              className="w-full sm:w-auto px-7 py-4 bg-slate-900 hover:bg-slate-800/90 text-slate-200 hover:text-white font-semibold rounded-2xl border border-slate-800 hover:border-slate-700 transition duration-200 text-base flex items-center justify-center gap-2"
            >
              <span>Preview Exam Interface</span>
            </a>
          </div>

          {/* Live Stat Badges */}
          <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">50K+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Active Aspirants</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">99.8%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Exam Simulation Accuracy</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Zero-Lag Latency</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">20+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">National Exam Streams</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 Features Section */}
      <section id="features" className="py-20 md:py-28 bg-slate-900/40 border-y border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Engineered For Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              About E-Score Framework
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
              E-Score is engineered specifically for aspirants of major competitive examinations (UPSC, MPSC, SSC, Defence). We replicate the exact constraints, layouts, and timings to eliminate exam hall stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-7 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 text-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                🖥️
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                Authentic Exam Layout
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Identical question palettes, question status colors, negative marking rules, and sectional countdown timers matching official test bodies.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-7 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 text-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                Instant AI Analytics
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive instant breakdowns of your accuracy, subject-wise strengths, pacing per question, and comparative national percentile benchmarks.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-7 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 text-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                📚
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                Curated Question Banks
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Thousands of syllabus-mapped high-yield questions authored by experienced educators, complete with step-by-step explanatory rationales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 Advantages Section */}
      <section id="advantages" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              The Winning Edge
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Why Choose E-Score?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
              Designed from the ground up to give candidates measurable score improvements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Advantage 1 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center hover:bg-slate-900/90 transition">
              <div className="text-4xl mb-4 p-3 rounded-2xl bg-amber-500/10">🎯</div>
              <h4 className="text-lg font-bold text-white mb-2">Precision Benchmarking</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Compare your scores against aspirants across the state and country to understand your true percentile ranking before exam day.
              </p>
            </div>

            {/* Advantage 2 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center hover:bg-slate-900/90 transition">
              <div className="text-4xl mb-4 p-3 rounded-2xl bg-orange-500/10">⚡</div>
              <h4 className="text-lg font-bold text-white mb-2">Zero-Lag Simulation</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Low-latency cloud architecture guarantees zero stutter or test halts even during synchronized national mock events.
              </p>
            </div>

            {/* Advantage 3 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center hover:bg-slate-900/90 transition">
              <div className="text-4xl mb-4 p-3 rounded-2xl bg-amber-500/10">🛡️</div>
              <h4 className="text-lg font-bold text-white mb-2">Anti-Cheat System</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Leverages full-screen lockdown and tab-switch monitoring to ensure fair percentiles and realistic test integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🖥️ Exam Interface Preview Showcase */}
      <section id="interface" className="py-16 md:py-24 bg-slate-900/50 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Live Mock Simulation
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3">
              Official Examination UI Mockup
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Preview our authentic candidate testing environment before you begin.
            </p>
          </div>

          {/* Mock Exam Window Frame */}
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
            {/* Top Bar of Mock Test */}
            <div className="bg-slate-800 px-5 py-3 border-b border-slate-700 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 text-slate-300 font-mono">UPSC_CSE_PRELIMS_MOCK_01.exam</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Time Left:</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-400 font-mono font-bold">
                  01:42:18
                </span>
              </div>
            </div>

            {/* Test Content Simulation */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Question Area */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Question 14 of 100</span>
                  <span className="text-xs text-slate-400 font-medium">Marks: +2.0 / -0.66</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                  With reference to the Indian Constitution, consider the following statements regarding the powers of the Election Commission:
                </p>
                <div className="space-y-2.5 pt-2">
                  {[
                    "1. It advises the President or Governor on disqualification of sitting members.",
                    "2. It has the power to recognize political parties and allot symbols to them.",
                    "3. Its decisions regarding election disputes are final and not subject to judicial review.",
                  ].map((statement, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs sm:text-sm text-slate-300">
                      {statement}
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Palette Sidebar */}
              <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Question Palette
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => {
                    const isAnswered = [1, 2, 3, 5, 8, 9, 12].includes(num);
                    const isCurrent = num === 14;
                    const isReview = [4, 7].includes(num);
                    return (
                      <div
                        key={num}
                        className={`h-8 rounded-lg text-xs font-bold flex items-center justify-center transition ${
                          isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                            : isAnswered
                              ? 'bg-emerald-600 text-white'
                              : isReview
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                    <span>Answered (7)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-purple-600" />
                    <span>Marked for Review (2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700" />
                    <span>Not Visited (15)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 Call to Action Banner */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 border border-amber-500/30 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Accelerate Your Preparation?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Register now and begin solving test-series formulated according to the latest official standards.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleStudentLogin}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition"
              >
                Start Free Mock Test Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ⚓ Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="text-amber-400 text-base">⚡</span>
            <span>E-Score Examination Portal</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-amber-400 transition">Features</a>
            <a href="#advantages" className="hover:text-amber-400 transition">Advantages</a>
            <a href="#interface" className="hover:text-amber-400 transition">Interface</a>
            <button onClick={handleAdminLogin} className="hover:text-amber-400 transition">Admin</button>
          </div>
          <p>© 2026 E-Score. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;


