import React, { useState } from 'react';

export default function CreateLiveExam() {
  const [isDeployed, setIsDeployed] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDeployed(true);
    setTimeout(() => setIsDeployed(false), 4000);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-5 mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <span className="text-amber-500">🚀</span>
          <span>Create Live Mock Examination</span>
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Deploy a timed evaluation node framework. Set up active durations, mark evaluation layers, and live calendar configurations.
        </p>
      </div>

      {isDeployed && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3">
          <span>🎉</span>
          <span>Live mock test node successfully scheduled and broadcasted to candidate calendars!</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* Row 1: Title & Code */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Official Examination Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
              placeholder="e.g., UPSC Prelims 2026 Full Length Mock 1"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Unique Course Code ID
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm font-mono"
              placeholder="e.g., UPSC-26-M1"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Row 2: Duration, Marks, Negative Marking */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Duration Time (Minutes)
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
                defaultValue="120"
                min="1"
                required
              />
              <span className="absolute right-3.5 top-3 text-xs text-slate-400">mins</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Correct Mark Allotment
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
                defaultValue="2"
                step="0.5"
                required
              />
              <span className="absolute right-3.5 top-3 text-xs text-emerald-400 font-semibold">+pts</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Negative Marks Penalty
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
                defaultValue="0.66"
                step="0.01"
                required
              />
              <span className="absolute right-3.5 top-3 text-xs text-rose-400 font-semibold">-pts</span>
            </div>
          </div>
        </div>

        {/* Row 3: Live Scheduling Timestamps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Live Window Start Time
            </label>
            <input
              type="datetime-local"
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Automatic Test Lock/End Time
            </label>
            <input
              type="datetime-local"
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
              required
            />
          </div>
        </div>

        {/* Row 4: Access Tier Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Access Restriction Matrix
            </label>
            <select className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm cursor-pointer">
              <option value="free">Free Tier General Access (Open)</option>
              <option value="premium">Premium Subscribed Accounts Only (Restricted)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Total Selected Questions Pool Count
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
              defaultValue="100"
              min="1"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 active:scale-[0.99] transition duration-200 text-sm tracking-wide flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            <span>Deploy Active Live Test Node</span>
          </button>
        </div>
      </form>
    </div>
  );
}
