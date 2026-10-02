import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const getSubjectDocumentId = (subjectName) => subjectName.trim().replaceAll('/', '-');

export default function FeedExamDetails() {
  const [subjects, setSubjects] = useState([]);
  const [subjectMode, setSubjectMode] = useState('existing');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctOption, setCorrectOption] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSubjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'subjects'));
        const loadedSubjects = Array.from(new Map(snapshot.docs
          .map((subjectDoc) => {
            const subjectName = subjectDoc.data().subjectName || subjectDoc.data().name || '';
            const id = getSubjectDocumentId(subjectName);
            return [id, { id, subjectName }];
          })
          .filter(([id, subject]) => id && subject.subjectName)).values());

        if (isMounted) {
          setSubjects(loadedSubjects);
          setSelectedSubjectId((currentId) => currentId || loadedSubjects[0]?.id || '');
          if (!loadedSubjects.length) setSubjectMode('new');
        }
      } catch (error) {
        console.error('Failed to load subjects:', error);
        if (isMounted) setErrorMessage('Unable to load subjects. Check your connection and Firestore permissions.');
      }
    };

    loadSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      let subjectId = selectedSubjectId;
      let subject = subjects.find((item) => item.id === subjectId);

      if (subjectMode === 'new') {
        const normalizedName = newSubjectName.trim();
        if (!normalizedName) {
          setErrorMessage('Enter a subject name before saving the question.');
          return;
        }

        subject = subjects.find((item) => item.subjectName.toLowerCase() === normalizedName.toLowerCase());
        if (subject) {
          subjectId = subject.id;
        } else {
          subjectId = getSubjectDocumentId(normalizedName);
          const subjectDocument = doc(db, 'subjects', subjectId);
          await setDoc(subjectDocument, {
            subjectName: normalizedName,
            createdAt: serverTimestamp(),
          }, { merge: true });
          subject = { id: subjectId, subjectName: normalizedName };
          setSubjects((currentSubjects) => [...currentSubjects, subject]);
        }
      }

      if (!subjectId || !subject) {
        setErrorMessage('Select a subject or enter a new subject name.');
        return;
      }

      subjectId = getSubjectDocumentId(subject.subjectName);
      await setDoc(doc(db, 'subjects', subjectId), {
        subjectName: subject.subjectName,
      }, { merge: true });

      await addDoc(collection(db, 'subjects', subjectId, 'questions'), {
        subjectId,
        subjectName: subject.subjectName,
        questionText: questionText.trim(),
        options,
        correctOption,
        explanation: explanation.trim(),
        difficulty,
        createdAt: serverTimestamp(),
      });

      setSelectedSubjectId(subjectId);
      setSuccessMessage(`Question saved under ${subject.subjectName}.`);
      setQuestionText('');
      setOptions({ A: '', B: '', C: '', D: '' });
      setCorrectOption('A');
      setExplanation('');
      setNewSubjectName('');
    } catch (error) {
      console.error('Failed to save question:', error);
      setErrorMessage('Unable to save this record. Check your connection and Firestore permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (option, value) => {
    setOptions((currentOptions) => ({ ...currentOptions, [option]: value }));
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-5 mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <span className="text-amber-500">⚙️</span>
          <span>Core Question Bank Engine</span>
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Add questions to an existing subject or create a subject while adding a question.
        </p>
      </div>

      {successMessage && (
        <div role="status" className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div role="alert" className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {errorMessage}
        </div>
      )}
      
      <form
        className="space-y-6 bg-slate-800/20 border border-slate-800 rounded-2xl p-6 sm:p-8"
        onSubmit={handleAddQuestion}
      >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Subject
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-800/60 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubjectMode('existing')}
                  className={`py-2.5 px-3 rounded-lg text-sm font-semibold transition ${subjectMode === 'existing' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                >
                  Select Existing
                </button>
                <button
                  type="button"
                  onClick={() => setSubjectMode('new')}
                  className={`py-2.5 px-3 rounded-lg text-sm font-semibold transition ${subjectMode === 'new' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                >
                  Add New Subject
                </button>
              </div>
            </div>

            {subjectMode === 'existing' ? (
              <select value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)} className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm cursor-pointer" required>
                <option value="" disabled>{subjects.length ? 'Select a subject' : 'No subjects available'}</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.subjectName}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
                placeholder="Enter new subject name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                required
              />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Difficulty Complexity Tier
              </label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm cursor-pointer">
                <option value="easy">🟢 Easy Level</option>
                <option value="medium">🟡 Medium Level</option>
                <option value="hard">🔴 Hard Level</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Question Prompt / Statement (Markdown/LaTeX Supported)
            </label>
            <textarea
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm font-sans"
              rows="4"
              placeholder="Type the core mock exam question statement here..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Multiple Choice Option Configurations
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <div key={opt} className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 focus-within:border-amber-500 transition">
                  <span className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/30 flex-shrink-0">
                    {opt}
                  </span>
                  <input
                    type="text"
                    className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                    placeholder={`Enter text value for Option ${opt}`}
                    value={options[opt]}
                    onChange={(e) => handleOptionChange(opt, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Correct Option & Explanation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Designated Correct Option Target
              </label>
              <select value={correctOption} onChange={(e) => setCorrectOption(e.target.value)} className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm cursor-pointer font-bold text-emerald-400">
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Step-by-Step Rationale Explanation Sheet
              </label>
              <textarea
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm font-sans"
                rows="3"
                placeholder="Provide analytical background reasoning details for student reviews..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || (subjectMode === 'existing' && !subjects.length)}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 active:scale-[0.99] transition duration-200 text-sm tracking-wide flex items-center justify-center gap-2"
            >
              <span>💾</span>
              <span>{isSubmitting ? 'Saving...' : 'Save Question to Bank'}</span>
            </button>
          </div>
      </form>
    </div>
  );
}
