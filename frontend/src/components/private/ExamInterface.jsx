import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

const normalizeDifficulty = (value) => ({
  medium: 'moderate',
  moderate: 'moderate',
  hard: 'high',
  high: 'high',
  easy: 'easy',
}[String(value || '').toLowerCase()] || String(value || '').toLowerCase());

const toDate = (value) => {
  if (value?.toDate) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const questionStatusStyles = {
  answered: 'border-emerald-400 bg-emerald-400 text-slate-950',
  notAnswered: 'border-amber-400/60 bg-amber-400/10 text-amber-200',
  notAttempted: 'border-slate-700 bg-slate-800 text-slate-300',
  review: 'border-sky-400 bg-sky-400/15 text-sky-200',
};

export default function ExamInterface() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const attemptId = new URLSearchParams(location.search).get('attempt') || '';
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visitedQuestionIndexes, setVisitedQuestionIndexes] = useState(new Set());
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [startedAt, setStartedAt] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);
  const autoSubmitStarted = useRef(false);
  const submitAttemptRef = useRef(null);
  const integrityViolationRef = useRef('');
  const violationHandledRef = useRef(false);
  const submissionStartedRef = useRef(false);
  const attemptConcludedRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    setExam(null);
    setQuestions([]);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setVisitedQuestionIndexes(new Set());
    setMarkedForReview(new Set());
    setStartedAt(null);
    setDeadline(null);
    setCurrentTime(Date.now());
    setIsLoading(true);
    setIsSubmitting(false);
    setErrorMessage('');
    setResult(null);
    autoSubmitStarted.current = false;
    integrityViolationRef.current = '';
    violationHandledRef.current = false;
    submissionStartedRef.current = false;
    attemptConcludedRef.current = false;

    const loadExam = async () => {
      const user = auth.currentUser;
      if (!user?.email) throw new Error('Sign in again to start this exam.');
      if (!document.fullscreenElement) {
        throw new Error('Fullscreen is required. Return to Mock Tests and start the exam again.');
      }

      const examSnapshot = await getDoc(doc(db, 'liveExams', examId));
      if (!examSnapshot.exists()) throw new Error('This exam is no longer available.');

      const loadedExam = { id: examSnapshot.id, ...examSnapshot.data() };
      const startAt = toDate(loadedExam.startAt);
      const endAt = toDate(loadedExam.endAt);
      const loadStartedAt = Date.now();
      if (loadedExam.status === 'cancelled' || !startAt || !endAt || loadStartedAt < startAt.getTime() || loadStartedAt > endAt.getTime()) {
        throw new Error('This exam is outside its live window.');
      }

      const questionGroups = await Promise.all((loadedExam.subjectQuestionAllocations || []).map(async (allocation) => {
        const requestedCounts = {
          easy: Number(allocation.easy) || 0,
          moderate: Number(allocation.moderate) || 0,
          high: Number(allocation.high) || 0,
        };
        const questionSnapshot = await getDocs(collection(db, 'subjects', allocation.subjectId, 'questions'));
        const available = questionSnapshot.docs.map((questionDoc) => ({ id: questionDoc.id, ...questionDoc.data() }));

        return shuffle(Object.entries(requestedCounts).flatMap(([difficulty, count]) => {
          if (!count) return [];
          const matching = shuffle(available.filter((question) => normalizeDifficulty(question.difficulty) === difficulty));
          if (matching.length < count) {
            throw new Error(`Not enough ${difficulty} questions available for ${allocation.subjectName}.`);
          }
          return matching.slice(0, count).map((question) => ({
            id: question.id,
            subjectId: allocation.subjectId,
            subjectName: allocation.subjectName,
            questionText: question.questionText,
            options: question.options || {},
            correctOption: question.correctOption,
            explanation: question.explanation || '',
            difficulty,
          }));
        }));
      }));

      const loadedQuestions = questionGroups.flat();
      if (!loadedQuestions.length) throw new Error('This exam has no questions available.');

      const attemptStartedAt = Date.now();
      if (attemptStartedAt >= endAt.getTime()) throw new Error('The exam closed while its questions were loading.');
      const durationMs = (Number(loadedExam.durationMinutes) || 1) * 60 * 1000;
      const examDeadline = Math.min(attemptStartedAt + durationMs, endAt.getTime());
      if (!isActive) return;
      setExam(loadedExam);
      setQuestions(loadedQuestions);
      setVisitedQuestionIndexes(new Set([0]));
      setStartedAt(attemptStartedAt);
      setDeadline(examDeadline);
      setCurrentTime(attemptStartedAt);
    };

    loadExam()
      .catch((error) => {
        if (isActive) setErrorMessage(error.message || 'Unable to load this exam. Check your connection and permissions.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => { isActive = false; };
  }, [examId, attemptId]);

  useEffect(() => {
    if (!deadline || result) return undefined;
    const intervalId = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [deadline, result]);

  useEffect(() => {
    if (!startedAt) return undefined;

    const recordViolation = (reason) => {
      if (attemptConcludedRef.current || violationHandledRef.current) return;
      violationHandledRef.current = true;
      integrityViolationRef.current = reason;
      setErrorMessage('Strict mode violation detected. Your current answers are being submitted.');
      submitAttemptRef.current?.(reason);
    };
    const handleVisibilityChange = () => {
      if (document.hidden) recordViolation('tab_hidden');
    };
    const handleWindowBlur = () => recordViolation('window_blur');
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !attemptConcludedRef.current) {
        recordViolation('fullscreen_exit');
        document.documentElement.requestFullscreen?.().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [startedAt]);

  const remainingSeconds = deadline ? Math.max(0, Math.ceil((deadline - currentTime) / 1000)) : 0;

  async function submitAttempt(violationReason = '') {
    if (!exam || !questions.length || submissionStartedRef.current || result) return;
    if (violationReason && !integrityViolationRef.current) integrityViolationRef.current = violationReason;
    const user = auth.currentUser;
    if (!user?.email) {
      setErrorMessage('Your student session expired. Sign in again before submitting.');
      return;
    }

    submissionStartedRef.current = true;
    setIsSubmitting(true);
    if (!integrityViolationRef.current) setErrorMessage('');
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
    }, {})).map((group) => ({
      ...group,
      accuracy: group.attempted ? Math.round(group.correct / group.attempted * 100) : 0,
    }));
    const score = correct * correctMarks - incorrect * negativeMarks;
    const maxScore = questions.length * correctMarks;
    const attemptData = {
      examId: exam.id,
      attemptId,
      examTitle: exam.title || 'Mock test',
      courseCode: exam.courseCode || '',
      examDetails: {
        title: exam.title || 'Mock test',
        courseCode: exam.courseCode || '',
        durationMinutes: Number(exam.durationMinutes) || 0,
        correctMarks,
        negativeMarks,
        scheduledStartAt: exam.startAt || null,
        scheduledEndAt: exam.endAt || null,
        questionCount: Number(exam.questionCount) || questions.length,
        subjectQuestionAllocations: exam.subjectQuestionAllocations || [],
      },
      userEmail: user.email,
      userId: user.uid,
      startedAt: new Date(startedAt),
      deadlineAt: new Date(deadline),
      totalQuestions: questions.length,
      attempted,
      correct,
      incorrect,
      unanswered: questions.length - attempted,
      score,
      maxScore,
      accuracy: attempted ? Math.round(correct / attempted * 100) : 0,
      timeTakenSeconds: Math.min(Math.floor((Date.now() - startedAt) / 1000), Math.floor((deadline - startedAt) / 1000)),
      subjectBreakdown,
      answers: reviewedAnswers,
      visitedQuestionIds: [...visitedQuestionIndexes].map((index) => questions[index]?.id).filter(Boolean),
      markedForReviewQuestionIds: [...markedForReview].map((index) => questions[index]?.id).filter(Boolean),
      integrityViolation: Boolean(integrityViolationRef.current),
      integrityViolationReason: integrityViolationRef.current || '',
      completedAt: serverTimestamp(),
    };

    try {
      const attemptRef = await addDoc(collection(db, 'users', user.email, 'mockTestAttempts'), attemptData);
      attemptConcludedRef.current = true;
      setResult({ id: attemptRef.id, ...attemptData, completedAt: new Date() });
      if (document.fullscreenElement && document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch {
          setErrorMessage('Attempt saved. Close fullscreen to return to the portal.');
        }
      }
    } catch {
      submissionStartedRef.current = false;
      setErrorMessage('Unable to save your result. Your answers are still here; try submitting again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  submitAttemptRef.current = submitAttempt;

  useEffect(() => {
    if (deadline && remainingSeconds === 0 && !isLoading && !isSubmitting && !result && !autoSubmitStarted.current) {
      autoSubmitStarted.current = true;
      submitAttemptRef.current?.();
    }
  }, [deadline, remainingSeconds, isLoading, isSubmitting, result]);

  const hours = String(Math.floor(remainingSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(remainingSeconds % 60).padStart(2, '0');
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const currentQuestion = questions[currentQuestionIndex];

  const getQuestionStatus = (index) => {
    if (markedForReview.has(index)) return 'review';
    if (answers[questions[index]?.id]) return 'answered';
    if (visitedQuestionIndexes.has(index)) return 'notAnswered';
    return 'notAttempted';
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestionIndexes((current) => new Set(current).add(index));
  };

  const updateAnswer = (option) => {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: option }));
    setVisitedQuestionIndexes((current) => new Set(current).add(currentQuestionIndex));
  };

  const toggleReview = () => {
    setMarkedForReview((current) => {
      const next = new Set(current);
      if (next.has(currentQuestionIndex)) next.delete(currentQuestionIndex);
      else next.add(currentQuestionIndex);
      return next;
    });
    setVisitedQuestionIndexes((current) => new Set(current).add(currentQuestionIndex));
  };

  const notAttemptedCount = questions.length - visitedQuestionIndexes.size;
  const notAnsweredCount = questions.filter((_, index) => getQuestionStatus(index) === 'notAnswered').length;
  const subjectSections = questions.reduce((sections, question, index) => {
    let section = sections.find((item) => item.subjectId === question.subjectId);
    if (!section) {
      section = { subjectId: question.subjectId, subjectName: question.subjectName, questionIndexes: [] };
      sections.push(section);
    }
    section.questionIndexes.push(index);
    return sections;
  }, []);
  const activeSection = subjectSections.find((section) => section.questionIndexes.includes(currentQuestionIndex));

  if (isLoading) {
    return <div role="status" className="min-h-screen bg-slate-950 p-8 text-sm text-slate-300">Preparing your exam...</div>;
  }

  if (errorMessage && !exam) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-slate-100 sm:p-10">
        <section className="mx-auto max-w-2xl border border-rose-500/30 bg-slate-900 p-6 sm:p-8">
          <p role="alert" className="text-sm text-rose-300">{errorMessage}</p>
          <button type="button" onClick={() => navigate('/user-dashboard/mock-tests')} className="mt-6 border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-amber-400/60">Back to tests</button>
        </section>
      </main>
    );
  }

  if (result) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-slate-100 sm:p-10">
        <section className="mx-auto max-w-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Attempt saved</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">{result.examTitle}</h1>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Score', `${result.score} / ${result.maxScore}`],
              ['Accuracy', `${result.accuracy}%`],
              ['Correct', `${result.correct} / ${result.totalQuestions}`],
              ['Attempted', `${result.attempted} / ${result.totalQuestions}`],
            ].map(([label, value]) => <div key={label} className="border border-slate-800 bg-slate-950 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-lg font-semibold text-white">{value}</p></div>)}
          </div>
          <p className="mt-5 text-sm text-slate-400">Your score and answer review are saved in Mock Test Analysis.</p>
          <button type="button" onClick={() => navigate('/user-dashboard/mock-tests')} className="mt-6 border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-amber-400/60">Back to tests</button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Live attempt</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">{exam.title}</h1>
            <p className="mt-1 text-sm text-slate-400">Question {currentQuestionIndex + 1} of {questions.length} · Attempted {answeredCount}</p>
          </div>
          <div role="timer" aria-live="off" className={`font-mono text-2xl font-bold ${remainingSeconds < 60 ? 'text-rose-300' : 'text-amber-300'}`}>
            {hours}:{minutes}:{seconds}
          </div>
        </header>
        {errorMessage && <p role="alert" className="mb-5 border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{errorMessage}</p>}

        <nav aria-label="Subject sections" className="mb-5 flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          {subjectSections.map((section) => {
            const isActive = section.subjectId === activeSection?.subjectId;
            return (
              <button
                key={section.subjectId}
                type="button"
                aria-pressed={isActive}
                onClick={() => navigateToQuestion(section.questionIndexes[0])}
                className={`flex items-center gap-2 border px-3.5 py-2.5 text-sm font-semibold transition ${isActive ? 'border-amber-400 bg-amber-400/10 text-amber-200' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white'}`}
              >
                <span>{section.subjectName}</span>
                <span className="font-mono text-xs opacity-70">{section.questionIndexes.length}</span>
              </button>
            );
          })}
        </nav>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <section className="min-w-0 border border-slate-800 bg-slate-900 p-5 sm:p-7" aria-label="Current exam question">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <span className="font-mono text-xs font-bold text-amber-400">QUESTION {String(currentQuestionIndex + 1).padStart(2, '0')}</span>
              <span className="text-xs font-semibold uppercase text-slate-400">Section: {currentQuestion.subjectName}</span>
            </div>
            <p className="whitespace-pre-wrap text-base leading-7 text-white">{currentQuestion.questionText}</p>
            <fieldset className="mt-6 grid gap-3">
              <legend className="sr-only">Select one answer</legend>
              {Object.entries(currentQuestion.options).map(([option, text]) => (
                <label key={option} className={`flex cursor-pointer items-start gap-3 border px-4 py-3.5 text-sm transition ${answers[currentQuestion.id] === option ? 'border-amber-400 bg-amber-400/10 text-white' : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-600'}`}>
                  <input type="radio" name={`question-${currentQuestion.id}`} value={option} checked={answers[currentQuestion.id] === option} onChange={() => updateAnswer(option)} className="mt-0.5 accent-amber-400" />
                  <span><span className="mr-2 font-semibold text-amber-300">{option}.</span>{text}</span>
                </label>
              ))}
            </fieldset>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
              <button type="button" disabled={currentQuestionIndex === 0} onClick={() => navigateToQuestion(currentQuestionIndex - 1)} className="border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
              <button type="button" aria-pressed={markedForReview.has(currentQuestionIndex)} onClick={toggleReview} className={`border px-4 py-2.5 text-sm font-semibold transition ${markedForReview.has(currentQuestionIndex) ? 'border-sky-400 bg-sky-400/10 text-sky-200' : 'border-slate-700 text-slate-300 hover:border-sky-400/60'}`}>
                {markedForReview.has(currentQuestionIndex) ? 'Remove review mark' : 'Mark for review'}
              </button>
              <button type="button" disabled={currentQuestionIndex === questions.length - 1} onClick={() => navigateToQuestion(currentQuestionIndex + 1)} className="border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-200 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
            </div>
          </section>

          <aside className="border border-slate-800 bg-slate-900 p-4 sm:p-5" aria-label="Exam question palette">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <h2 className="text-sm font-semibold text-white">Question palette</h2>
              <span className="text-xs text-slate-500">{questions.length} total</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="border border-emerald-400/30 bg-emerald-400/10 p-2.5"><span className="block text-slate-400">Attempted</span><span className="mt-1 block font-semibold text-emerald-300">{answeredCount}</span></div>
              <div className="border border-slate-700 bg-slate-800/60 p-2.5"><span className="block text-slate-400">Not attempted</span><span className="mt-1 block font-semibold text-slate-200">{notAttemptedCount}</span></div>
              <div className="border border-amber-400/30 bg-amber-400/10 p-2.5"><span className="block text-slate-400">Not answered</span><span className="mt-1 block font-semibold text-amber-200">{notAnsweredCount}</span></div>
              <div className="border border-sky-400/30 bg-sky-400/10 p-2.5"><span className="block text-slate-400">Marked for review</span><span className="mt-1 block font-semibold text-sky-200">{markedForReview.size}</span></div>
            </div>
            <div className="mt-5 max-h-[min(45vh,32rem)] space-y-4 overflow-y-auto pr-1">
              {subjectSections.map((section) => (
                <section key={section.subjectId} aria-label={`${section.subjectName} questions`}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold text-slate-300">{section.subjectName}</h3>
                    <span className="text-[11px] text-slate-500">{section.questionIndexes.length} questions</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {section.questionIndexes.map((index) => {
                      const question = questions[index];
                      const status = getQuestionStatus(index);
                      return (
                        <button
                          key={question.id}
                          type="button"
                          aria-label={`Question ${index + 1}: ${status === 'notAnswered' ? 'not answered' : status === 'notAttempted' ? 'not attempted' : status === 'review' ? 'marked for review' : 'answered'}`}
                          aria-current={index === currentQuestionIndex ? 'step' : undefined}
                          onClick={() => navigateToQuestion(index)}
                          className={`aspect-square rounded border text-xs font-semibold transition ${questionStatusStyles[status]} ${index === currentQuestionIndex ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:brightness-125'}`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-400" />Answered</p>
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-amber-400/40" />Not answered</p>
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-slate-700" />Not attempted</p>
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-sky-400/40" />Marked for review</p>
            </div>
          </aside>
        </div>

        <div className="sticky bottom-3 mt-5 flex flex-wrap items-center justify-between gap-3 border border-slate-700 bg-slate-950/95 p-4 backdrop-blur">
          <p className="text-sm text-slate-400">Unanswered questions are submitted as blank.</p>
          <button type="button" onClick={submitAttempt} disabled={isSubmitting} className="rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-60">
            {isSubmitting ? 'Saving result...' : 'Submit test'}
          </button>
        </div>
      </section>
    </main>
  );
}