import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../config/firebase';

const toDate = (value) => {
  if (value?.toDate) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const formatDate = (value) => toDate(value)?.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) || 'Schedule not set';
const CLOSED_EXAM_RETENTION_MS = 60 * 60 * 1000;

export default function MockTests() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [activeAttempt, setActiveAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const autoSubmitStarted = useRef(false);

  useEffect(() => {
    let isActive = true;
    getDocs(collection(db, 'liveExams'))
      .then((snapshot) => {
        if (isActive) {
          setExams(snapshot.docs.map((examDoc) => ({ id: examDoc.id, ...examDoc.data() }))
            .sort((first, second) => (toDate(first.startAt)?.getTime() || 0) - (toDate(second.startAt)?.getTime() || 0)));
        }
      })
      .catch(() => {
        if (isActive) setLoadError('Unable to load live exams. Check your connection and Firestore permissions.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => { isActive = false; };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!activeAttempt || !remainingSeconds || isSubmitting) return undefined;
    const intervalId = window.setInterval(() => {
      setRemainingSeconds(Math.max(0, Math.ceil((activeAttempt.deadline - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [activeAttempt, remainingSeconds, isSubmitting]);

  useEffect(() => {
    if (activeAttempt && remainingSeconds === 0 && !isSubmitting && !autoSubmitStarted.current) {
      autoSubmitStarted.current = true;
      handleSubmitAttempt();
    }
  });

  const startExam = async (exam) => {
    setActionError('');
    if (!document.fullscreenElement) {
      if (!document.documentElement.requestFullscreen) {
        setActionError('This browser does not support fullscreen exams.');
        return;
      }
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        setActionError('Fullscreen permission is required to start this exam.');
        return;
      }
    }
    const attemptId = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    navigate(`/user-dashboard/exam/${exam.id}?attempt=${encodeURIComponent(attemptId)}`);
  };

  async function handleSubmitAttempt() {
    if (!activeAttempt || isSubmitting) return;
    const user = auth.currentUser;
    if (!user?.email) {
      setActionError('Your student session expired. Sign in again before submitting.');
      return;
    }
    setIsSubmitting(true);
    setActionError('');
    const { exam, questions, startedAt } = activeAttempt;
    const reviewedAnswers = questions.map((question) => ({
      questionId: question.id,
      questionText: question.questionText,
      subjectId: question.subjectId,
      subjectName: question.subjectName,
      difficulty: question.difficulty,
      options: question.options,
      selectedOption: answers[question.id] || '',
      correctOption: question.correctOption,
      explanation: question.explanation,
      isCorrect: Boolean(answers[question.id]) && answers[question.id] === question.correctOption,
    }));
    const correct = reviewedAnswers.filter((answer) => answer.isCorrect).length;
    const attempted = reviewedAnswers.filter((answer) => answer.selectedOption).length;
    const incorrect = attempted - correct;
    const correctMarks = Number(exam.correctMarks) || 0;
    const negativeMarks = Number(exam.negativeMarks) || 0;
    const subjectBreakdown = Object.values(reviewedAnswers.reduce((groups, answer) => {
      const group = groups[answer.subjectId] || { subjectId: answer.subjectId, subjectName: answer.subjectName, total: 0, attempted: 0, correct: 0 };
      group.total += 1;
      group.attempted += Number(Boolean(answer.selectedOption));
      group.correct += Number(answer.isCorrect);
      groups[answer.subjectId] = group;
      return groups;
    }, {})).map((group) => ({ ...group, accuracy: group.attempted ? Math.round(group.correct / group.attempted * 100) : 0 }));
    const score = correct * correctMarks - incorrect * negativeMarks;
    const maxScore = questions.length * correctMarks;
    const attemptData = {
      examId: exam.id,
      examTitle: exam.title || 'Mock test',
      courseCode: exam.courseCode || '',
      userEmail: user.email,
      userId: user.uid,
      totalQuestions: questions.length,
      attempted,
      correct,
      incorrect,
      unanswered: questions.length - attempted,
      score,
      maxScore,
      accuracy: attempted ? Math.round(correct / attempted * 100) : 0,
      timeTakenSeconds: Math.min(Math.floor((Date.now() - startedAt) / 1000), Math.floor((activeAttempt.deadline - startedAt) / 1000)),
      subjectBreakdown,
      answers: reviewedAnswers,
      completedAt: serverTimestamp(),
    };
    try {
      const attemptRef = await addDoc(collection(db, 'users', user.email, 'mockTestAttempts'), attemptData);
      setResult({ id: attemptRef.id, ...attemptData, completedAt: new Date() });
      setActiveAttempt(null);
      setRemainingSeconds(0);
    } catch {
      setActionError('Unable to save your result. Your answers are still on screen; try submitting again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const seconds = String(remainingSeconds % 60).padStart(2, '0');

  if (activeAttempt) {
    const currentAnswerCount = Object.values(answers).filter(Boolean).length;
    return (
      <section className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Live attempt</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{activeAttempt.exam.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{currentAnswerCount} of {activeAttempt.questions.length} answered</p>
          </div>
          <div role="timer" aria-live="off" className={`font-mono text-2xl font-bold ${remainingSeconds < 60 ? 'text-rose-300' : 'text-amber-300'}`}>
            {minutes}:{seconds}
          </div>
        </div>
        {actionError && <p role="alert" className="mb-5 border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{actionError}</p>}
        <div className="space-y-4">
          {activeAttempt.questions.map((question, index) => (
            <fieldset key={question.id} className="border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <legend className="sr-only">Question {index + 1}</legend>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-amber-400">QUESTION {String(index + 1).padStart(2, '0')}</span>
                <span className="text-xs text-slate-500">{question.subjectName} · {question.difficulty}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-white">{question.questionText}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {Object.entries(question.options).map(([option, text]) => (
                  <label key={option} className={`flex cursor-pointer items-start gap-3 border px-3 py-3 text-sm transition ${answers[question.id] === option ? 'border-amber-400 bg-amber-400/10 text-white' : 'border-slate-800 text-slate-300 hover:border-slate-600'}`}>
                    <input type="radio" name={`question-${question.id}`} value={option} checked={answers[question.id] === option} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))} className="mt-0.5 accent-amber-400" />
                    <span><span className="mr-2 font-semibold text-amber-300">{option}.</span>{text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <div className="sticky bottom-4 mt-6 flex flex-wrap items-center justify-between gap-3 border border-slate-700 bg-slate-950/95 p-4 backdrop-blur">
          <p className="text-sm text-slate-400">Unanswered questions are submitted as blank.</p>
          <button type="button" onClick={handleSubmitAttempt} disabled={isSubmitting} className="rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-60">
            {isSubmitting ? 'Saving result...' : 'Submit test'}
          </button>
        </div>
      </section>
    );
  }

  if (result) {
    return (
      <section className="max-w-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Attempt saved</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{result.examTitle}</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Score', `${result.score} / ${result.maxScore}`],
            ['Accuracy', `${result.accuracy}%`],
            ['Correct', `${result.correct} / ${result.totalQuestions}`],
            ['Attempted', `${result.attempted} / ${result.totalQuestions}`],
          ].map(([label, value]) => <div key={label} className="border border-slate-800 bg-slate-950 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-lg font-semibold text-white">{value}</p></div>)}
        </div>
        <p className="mt-5 text-sm text-slate-400">Your result and answer review are saved in Mock Test Analysis.</p>
        <button type="button" onClick={() => setResult(null)} className="mt-6 border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-amber-400/60">Back to exams</button>
      </section>
    );
  }

  const visibleExams = exams.filter((exam) => {
    const endAt = toDate(exam.endAt);
    return !endAt || currentTime < endAt.getTime() + CLOSED_EXAM_RETENTION_MS;
  });

  return (
    <section>
      <div className="mb-7 border-b border-slate-800 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Exam schedule</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Live mock tests</h2>
        <p className="mt-2 text-sm text-slate-400">Tests published by your administrator appear here.</p>
      </div>
      {actionError && <p role="alert" className="mb-5 border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{actionError}</p>}
      {result && <p role="status" className="mb-5 border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">Your result is saved. Open Mock Test Analysis to review it.</p>}
      {isLoading ? <p role="status" className="py-8 text-sm text-slate-400">Loading live tests...</p> : loadError ? <p role="alert" className="py-8 text-sm text-rose-300">{loadError}</p> : visibleExams.length === 0 ? (
        <div className="border border-dashed border-slate-700 px-6 py-12 text-center">
          <p className="text-base font-semibold text-white">No tests have been scheduled</p>
          <p className="mt-2 text-sm text-slate-400">New mock tests published by your administrator will appear here.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800 border-y border-slate-800">
          {visibleExams.map((exam) => {
            const startAt = toDate(exam.startAt);
            const endAt = toDate(exam.endAt);
            const isLive = exam.status !== 'cancelled' && startAt && endAt && currentTime >= startAt.getTime() && currentTime <= endAt.getTime();
            const status = exam.status === 'cancelled' ? 'Cancelled' : isLive ? 'Live now' : startAt && currentTime < startAt.getTime() ? 'Upcoming' : 'Closed';
            return (
              <article key={exam.id} className="grid gap-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{exam.title || 'Untitled mock test'}</h3>
                    <span className={`border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${isLive ? 'border-emerald-500/40 text-emerald-300' : 'border-slate-700 text-slate-400'}`}>{status}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{exam.courseCode || 'Mock test'} · {exam.questionCount || 0} questions · {exam.durationMinutes || 0} minutes</p>
                  <p className="mt-3 text-sm text-slate-400">Opens {formatDate(exam.startAt)} <span className="mx-1 text-slate-600">/</span> Closes {formatDate(exam.endAt)}</p>
                  {!!exam.subjectQuestionAllocations?.length && <p className="mt-2 text-xs leading-5 text-slate-500">{exam.subjectQuestionAllocations.map((item) => item.subjectName).filter(Boolean).join(' · ')}</p>}
                </div>
                <button type="button" disabled={!isLive} onClick={() => startExam(exam)} className="min-w-[8rem] rounded-md bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500">
                  {isLive ? 'Start test' : status}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}