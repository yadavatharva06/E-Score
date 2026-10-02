import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';

const formatDate = (value) => {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    : 'Date unavailable';
};

function makeAnalysis(attempt) {
  const accuracy = Number(attempt.accuracy) || 0;
  const weakest = [...(attempt.subjectBreakdown || [])]
    .filter((subject) => subject.attempted > 0)
    .sort((first, second) => first.accuracy - second.accuracy)[0];
  const strongest = [...(attempt.subjectBreakdown || [])]
    .filter((subject) => subject.attempted > 0)
    .sort((first, second) => second.accuracy - first.accuracy)[0];
  const performance = accuracy >= 80 ? 'strong' : accuracy >= 55 ? 'developing' : 'needs focused practice';
  const notes = [`You answered ${attempt.attempted || 0} of ${attempt.totalQuestions || 0} questions and scored ${attempt.correct || 0} correct (${accuracy}% accuracy).`];
  if (weakest) notes.push(`${weakest.subjectName} was the most challenging area at ${weakest.accuracy}% accuracy; review those questions first.`);
  if (strongest && strongest.subjectId !== weakest?.subjectId) notes.push(`${strongest.subjectName} was your strongest area at ${strongest.accuracy}% accuracy.`);
  if (attempt.unanswered) notes.push(`${attempt.unanswered} question${attempt.unanswered === 1 ? ' was' : 's were'} left unanswered.`);
  notes.push(`Overall, this attempt shows ${performance} performance.`);
  return notes;
}

export default function MockTestAnalysis() {
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    let isActive = true;
    if (!user?.email) {
      setError('Sign in again to load your analysis.');
      setIsLoading(false);
      return undefined;
    }
    const attemptsQuery = query(
      collection(db, 'users', user.email, 'mockTestAttempts'),
      orderBy('completedAt', 'desc')
    );
    getDocs(attemptsQuery)
      .then((snapshot) => {
        if (isActive) setAttempts(snapshot.docs.map((attemptDoc) => ({ id: attemptDoc.id, ...attemptDoc.data() })));
      })
      .catch(() => {
        if (isActive) setError('Unable to load your analysis. Check your connection and Firestore permissions.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => { isActive = false; };
  }, [user]);

  const averageAccuracy = attempts.length
    ? Math.round(attempts.reduce((total, attempt) => total + (Number(attempt.accuracy) || 0), 0) / attempts.length)
    : 0;
  const totalQuestions = attempts.reduce((total, attempt) => total + (Number(attempt.totalQuestions) || 0), 0);
  const totalCorrect = attempts.reduce((total, attempt) => total + (Number(attempt.correct) || 0), 0);

  return (
    <section>
      <div className="mb-7 border-b border-slate-800 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Performance review</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Mock test analysis</h2>
        <p className="mt-2 text-sm text-slate-400">A written summary of your saved attempts, including subject-level strengths and areas to revisit.</p>
      </div>
      {error && <p role="alert" className="mb-5 border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
      {isLoading ? <p role="status" className="py-8 text-sm text-slate-400">Loading your attempts...</p> : !error && attempts.length === 0 ? (
        <div className="border border-dashed border-slate-700 px-6 py-12 text-center">
          <p className="text-base font-semibold text-white">No completed tests to analyze</p>
          <p className="mt-2 text-sm text-slate-400">Your analysis will appear here after you submit a mock test.</p>
        </div>
      ) : !error && (
        <>
          <div className="mb-8 grid gap-px border border-slate-800 bg-slate-800 sm:grid-cols-3">
            {[
              ['Completed tests', attempts.length],
              ['Average accuracy', `${averageAccuracy}%`],
              ['Correct answers', `${totalCorrect} / ${totalQuestions}`],
            ].map(([label, value]) => <div key={label} className="bg-slate-900 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-3 text-2xl font-semibold text-white">{value}</p></div>)}
          </div>
          <div className="space-y-3">
            {attempts.map((attempt) => {
              const isExpanded = expandedId === attempt.id;
              return (
                <article key={attempt.id} className="border border-slate-800 bg-slate-900">
                  <button type="button" aria-expanded={isExpanded} onClick={() => setExpandedId(isExpanded ? '' : attempt.id)} className="grid w-full gap-4 p-5 text-left sm:grid-cols-[1fr_auto_auto] sm:items-center">
                    <span>
                      <span className="block font-semibold text-white">{attempt.examTitle || 'Mock test'}</span>
                      <span className="mt-1 block text-xs text-slate-500">{formatDate(attempt.completedAt)}{attempt.courseCode ? ` · ${attempt.courseCode}` : ''}</span>
                    </span>
                    <span className="text-sm text-slate-300">{attempt.correct || 0}/{attempt.totalQuestions || 0} correct</span>
                    <span className="flex items-center justify-between gap-4 sm:justify-end"><span className="font-mono text-sm font-semibold text-amber-300">{attempt.accuracy || 0}%</span><span aria-hidden="true" className="text-slate-500">{isExpanded ? '−' : '+'}</span></span>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-slate-800 px-5 py-5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Analysis</h3>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                        {makeAnalysis(attempt).map((note) => <li key={note} className="border-l border-amber-400/50 pl-3">{note}</li>)}
                      </ul>
                      {!!attempt.subjectBreakdown?.length && (
                        <div className="mt-6 overflow-x-auto">
                          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Subject breakdown</h3>
                          <table className="w-full min-w-[24rem] text-left text-sm">
                            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2 pr-4 font-semibold">Subject</th><th className="py-2 pr-4 font-semibold">Correct</th><th className="py-2 font-semibold">Accuracy</th></tr></thead>
                            <tbody className="divide-y divide-slate-800">{attempt.subjectBreakdown.map((subject) => <tr key={subject.subjectId}><td className="py-3 pr-4 text-slate-200">{subject.subjectName}</td><td className="py-3 pr-4 text-slate-400">{subject.correct}/{subject.attempted}</td><td className="py-3 text-amber-300">{subject.accuracy}%</td></tr>)}</tbody>
                          </table>
                        </div>
                      )}
                      {!!attempt.answers?.length && (
                        <details className="mt-6 border-t border-slate-800 pt-4">
                          <summary className="cursor-pointer text-sm font-semibold text-slate-300">Review answers</summary>
                          <div className="mt-4 space-y-3">{attempt.answers.map((answer, index) => <div key={`${answer.questionId}-${index}`} className="border border-slate-800 p-4"><p className="text-sm leading-6 text-slate-200">{index + 1}. {answer.questionText}</p><p className="mt-2 text-xs text-slate-400">Your answer: {answer.selectedOption || 'Not answered'} <span className="mx-1 text-slate-600">·</span> Correct: {answer.correctOption}</p>{answer.explanation && <p className="mt-2 text-xs leading-5 text-slate-500">{answer.explanation}</p>}</div>)}</div>
                        </details>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}