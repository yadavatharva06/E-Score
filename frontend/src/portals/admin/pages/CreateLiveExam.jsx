import React, { useEffect, useState } from 'react';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default function CreateLiveExam() {
  const [isDeployed, setIsDeployed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [subjectQuestionCounts, setSubjectQuestionCounts] = useState({});

  useEffect(() => {
    let isMounted = true;

    const loadSubjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'subjects'));
        const loadedSubjects = Array.from(new Map(snapshot.docs
          .map((subjectDocument) => {
            const data = subjectDocument.data();
            const subjectName = data.subjectName || data.name || '';
            const id = subjectName.trim().replaceAll('/', '-');
            return [id, { id, subjectName }];
          })
          .filter(([id, subject]) => id && subject.subjectName)).values());

        if (isMounted) {
          setSubjects(loadedSubjects);
          setSubjectQuestionCounts((currentCounts) => loadedSubjects.reduce((counts, subject) => ({
            ...counts,
            [subject.id]: currentCounts[subject.id] || { easy: 0, moderate: 0, high: 0 },
          }), {}));
        }
      } catch (error) {
        console.error('Failed to load subjects for live exam:', error);
        if (isMounted) setErrorMessage('Unable to load subjects. Check your connection and Firestore permissions.');
      }
    };

    loadSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalQuestionCount = Object.values(subjectQuestionCounts).reduce(
    (total, counts) => total + counts.easy + counts.moderate + counts.high,
    0
  );

  const updateSubjectQuestionCount = (subjectId, difficulty, value) => {
    setSubjectQuestionCounts((currentCounts) => ({
      ...currentCounts,
      [subjectId]: {
        ...currentCounts[subjectId],
        [difficulty]: Number(value),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsProcessing(true);
    setIsDeployed(false);
    setErrorMessage('');

    const formData = new FormData(form);
    const startAt = new Date(formData.get('startAt'));
    const endAt = new Date(formData.get('endAt'));

    if (endAt <= startAt) {
      setErrorMessage('The test end time must be after its start time.');
      setIsProcessing(false);
      return;
    }

    if (totalQuestionCount < 1) {
      setErrorMessage('Allocate at least one question to a subject.');
      setIsProcessing(false);
      return;
    }

    const subjectQuestionAllocations = subjects.map((subject) => {
      const counts = subjectQuestionCounts[subject.id] || { easy: 0, moderate: 0, high: 0 };
      return {
        subjectId: subject.id,
        subjectName: subject.subjectName,
        easy: counts.easy,
        moderate: counts.moderate,
        high: counts.high,
        totalQuestions: counts.easy + counts.moderate + counts.high,
      };
    });

    try {
      await addDoc(collection(db, 'liveExams'), {
        title: examTitle.trim(),
        courseCode: courseCode.trim(),
        durationMinutes: Number(formData.get('durationMinutes')),
        correctMarks: Number(formData.get('correctMarks')),
        negativeMarks: Number(formData.get('negativeMarks')),
        startAt,
        endAt,
        questionCount: totalQuestionCount,
        subjectQuestionAllocations,
        status: 'scheduled',
        createdAt: serverTimestamp(),
      });
      setIsDeployed(true);
      setExamTitle('');
      setCourseCode('');
      setSubjectQuestionCounts(subjects.reduce((counts, subject) => ({
        ...counts,
        [subject.id]: { easy: 0, moderate: 0, high: 0 },
      }), {}));
      form.reset();
    } catch (error) {
      console.error('Failed to save live exam:', error);
      setErrorMessage('Unable to save the live exam. Check your connection and Firestore permissions.');
    } finally {
      setIsProcessing(false);
    }
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
        <div role="status" className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3">
          <span>🎉</span>
          <span>Live mock exam saved and scheduled successfully.</span>
        </div>
      )}
      {errorMessage && (
        <div role="alert" className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {errorMessage}
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
              name="title"
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
              name="courseCode"
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
                name="durationMinutes"
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
                name="correctMarks"
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
                name="negativeMarks"
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
              name="startAt"
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
              name="endAt"
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-semibold text-white">Question Allocation by Subject</h4>
              <p className="text-xs text-slate-400 mt-1">Set the number of questions at each difficulty for every subject.</p>
            </div>
            <p className="text-sm font-semibold text-amber-400" aria-live="polite">
              Exam total: {totalQuestionCount} questions
            </p>
          </div>

          {subjects.length === 0 ? (
            <p className="rounded-xl border border-slate-800 bg-slate-800/30 px-4 py-5 text-sm text-slate-400">
              No subjects found. Add subjects in the question bank before creating a live exam.
            </p>
          ) : (
            <div className="divide-y divide-slate-800 rounded-xl border border-slate-800">
              <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_110px_110px_110px_100px] gap-3 bg-slate-800/50 px-4 py-3 text-xs font-semibold uppercase text-slate-400">
                <span>Subject</span>
                <span>Easy</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Total</span>
              </div>
              {subjects.map((subject) => {
                const counts = subjectQuestionCounts[subject.id] || { easy: 0, moderate: 0, high: 0 };
                const subjectTotal = counts.easy + counts.moderate + counts.high;

                return (
                  <div key={subject.id} className="grid grid-cols-2 sm:grid-cols-[minmax(0,1fr)_110px_110px_110px_100px] gap-3 items-center px-4 py-4">
                    <span className="col-span-2 sm:col-span-1 font-medium text-white">{subject.subjectName}</span>
                    {[
                      { id: 'easy', label: 'Easy' },
                      { id: 'moderate', label: 'Moderate' },
                      { id: 'high', label: 'High' },
                    ].map((difficulty) => (
                      <label key={difficulty.id} className="text-xs text-slate-400">
                        <span className="mb-1 block sm:hidden">{difficulty.label}</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={counts[difficulty.id]}
                          onChange={(e) => updateSubjectQuestionCount(subject.id, difficulty.id, e.target.value)}
                          aria-label={`${subject.subjectName} ${difficulty.label.toLowerCase()} question count`}
                          className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </label>
                    ))}
                    <span className="text-sm font-semibold text-amber-400">
                      <span className="mr-2 text-xs font-normal text-slate-400 sm:hidden">Total</span>
                      {subjectTotal}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isProcessing || !subjects.length}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 text-sm tracking-wide flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            <span>{isProcessing ? 'Saving...' : 'Deploy Active Live Test Node'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
