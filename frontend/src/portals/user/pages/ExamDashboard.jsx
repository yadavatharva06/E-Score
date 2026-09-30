import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../config/firebase';
import '../styles/UserDashboard.css';

const exams = [
  {
    id: 'cs-101',
    title: 'National Level CS Mock - 1',
    subject: 'Computer Science',
    date: 'Today, 2:00 PM',
    questions: 40,
    duration: 60,
    status: 'Available',
  },
  {
    id: 'cs-102',
    title: 'Data Structures Diagnostic',
    subject: 'Data Structures',
    date: 'Tomorrow, 10:00 AM',
    questions: 25,
    duration: 40,
    status: 'Upcoming',
  },
  {
    id: 'cs-103',
    title: 'Algorithm Speed Sprint',
    subject: 'Algorithms',
    date: 'Oct 4, 9:00 AM',
    questions: 30,
    duration: 30,
    status: 'Available',
  },
  {
    id: 'cs-099',
    title: 'Programming Fundamentals Mock',
    subject: 'Programming',
    date: 'Completed Sep 24',
    questions: 35,
    duration: 45,
    status: 'Completed',
    score: '82%',
  },
];

function ExamDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All exams');
  const [search, setSearch] = useState('');

  const filteredExams = exams.filter((exam) => {
    const matchesFilter = filter === 'All exams' || exam.status === filter;
    const matchesSearch = `${exam.title} ${exam.subject}`
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      navigate('/user-login', { replace: true });
    } catch (error) {
      alert(`Error signing out: ${error.code}`);
    }
  };

  const handleExamAction = (exam) => {
    if (exam.status !== 'Completed') {
      navigate(`/dashboard/mock-test/${exam.id}`);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">E-Score</div>
        <nav className="sidebar-nav" aria-label="Student navigation">
          <button className="nav-item-btn" onClick={() => navigate('/user-dashboard')}>
            Home Overview
          </button>
          <button className="nav-item-btn active" aria-current="page">
            Available Exams
          </button>
          <button className="nav-item-btn" onClick={() => navigate('/user-dashboard')}>
            Performance
          </button>
        </nav>
        <button className="logout-btn-sidebar" onClick={handleLogOut}>
          Log Out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Exam Dashboard</h2>
          <span style={{ color: 'var(--theme-muted)', fontSize: 14, fontWeight: 500 }}>
            Student Portal
          </span>
        </header>

        <div className="dashboard-content">
          <section style={styles.intro}>
            <div>
              <p style={styles.eyebrow}>YOUR EXAM CENTER</p>
              <h1 style={styles.heading}>Ready for your next challenge?</h1>
              <p style={styles.description}>
                Find an exam, check the schedule, and keep your preparation moving.
              </p>
            </div>
            <div style={styles.nextExam}>
              <span style={styles.nextExamLabel}>NEXT EXAM</span>
              <strong>Today, 2:00 PM</strong>
              <span>National Level CS Mock - 1</span>
            </div>
          </section>

          <section className="stats-grid" aria-label="Exam summary">
            <div className="stat-card">
              <div className="stat-label">Available now</div>
              <div className="stat-value highlight">02</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Upcoming</div>
              <div className="stat-value">01</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Completed</div>
              <div className="stat-value">01</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Latest score</div>
              <div className="stat-value">82%</div>
            </div>
          </section>

          <section className="panel-card" aria-labelledby="exam-list-title">
            <div style={styles.listHeader}>
              <div>
                <h3 className="panel-title" id="exam-list-title" style={styles.panelTitle}>
                  My exams
                </h3>
                <p style={styles.listSubtitle}>Browse assigned exams and review completed attempts.</p>
              </div>
              <label style={styles.searchLabel}>
                <span className="sr-only">Search exams</span>
                <input
                  type="search"
                  placeholder="Search exams"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  style={styles.searchInput}
                />
              </label>
            </div>

            <div style={styles.filters} aria-label="Filter exams">
              {['All exams', 'Available', 'Upcoming', 'Completed'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={filter === option}
                  style={{
                    ...styles.filterButton,
                    ...(filter === option ? styles.activeFilter : {}),
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mock-test-list">
              {filteredExams.map((exam) => (
                <article className="mock-test-item" key={exam.id} style={styles.examItem}>
                  <div className="mock-info" style={styles.examInfo}>
                    <span style={styles.subject}>{exam.subject}</span>
                    <h4>{exam.title}</h4>
                    <p>{exam.date} · {exam.questions} questions · {exam.duration} min</p>
                  </div>
                  <div style={styles.examAction}>
                    <span
                      style={{
                        ...styles.status,
                        ...(exam.status === 'Available' ? styles.availableStatus : {}),
                        ...(exam.status === 'Completed' ? styles.completedStatus : {}),
                      }}
                    >
                      {exam.status === 'Completed' ? `Score ${exam.score}` : exam.status}
                    </span>
                    {exam.status !== 'Upcoming' && (
                      <button
                        type="button"
                        className="btn-launch-test"
                        onClick={() => handleExamAction(exam)}
                        disabled={exam.status === 'Completed'}
                        style={exam.status === 'Completed' ? styles.disabledButton : undefined}
                      >
                        {exam.status === 'Completed' ? 'Reviewed' : 'Start exam'}
                      </button>
                    )}
                  </div>
                </article>
              ))}
              {filteredExams.length === 0 && (
                <p style={styles.emptyState}>No exams match your search.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const styles = {
  intro: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    padding: '28px 30px',
    marginBottom: 28,
    background: 'linear-gradient(115deg, #102943 0%, #17645e 100%)',
    color: '#fff',
    borderRadius: 6,
  },
  eyebrow: { margin: '0 0 10px', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#a9d9c9' },
  heading: { margin: 0, fontSize: 25, lineHeight: 1.2 },
  description: { margin: '10px 0 0', color: '#d8e7e4', fontSize: 14 },
  nextExam: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 210, paddingLeft: 24, borderLeft: '1px solid rgba(255,255,255,.3)', fontSize: 13 },
  nextExamLabel: { color: '#a9d9c9', fontSize: 10, fontWeight: 700, letterSpacing: 1 },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 },
  panelTitle: { border: 0, padding: 0, marginBottom: 5 },
  listSubtitle: { margin: 0, color: 'var(--theme-muted)', fontSize: 13 },
  searchLabel: { flex: '0 1 250px' },
  searchInput: { width: '100%', padding: '10px 12px', border: '1px solid var(--theme-border)', borderRadius: 4, background: 'var(--theme-surface)', color: 'var(--theme-text)', fontSize: 14, boxSizing: 'border-box' },
  filters: { display: 'flex', gap: 8, flexWrap: 'wrap', margin: '22px 0 18px' },
  filterButton: { padding: '8px 12px', border: '1px solid var(--theme-border)', borderRadius: 4, background: 'var(--theme-surface)', color: 'var(--theme-muted)', fontSize: 13, cursor: 'pointer' },
  activeFilter: { borderColor: '#17645e', background: '#e8f3f0', color: '#14574f', fontWeight: 700 },
  examItem: { background: '#fff' },
  examInfo: { minWidth: 0 },
  subject: { display: 'block', marginBottom: 5, color: 'var(--theme-accent-soft)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' },
  examAction: { display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 },
  status: { color: 'var(--theme-muted)', fontSize: 12, fontWeight: 600 },
  availableStatus: { color: 'var(--theme-accent-soft)' },
  completedStatus: { color: 'var(--theme-muted)' },
  disabledButton: { background: '#eef0f1', color: '#606b73', borderColor: '#eef0f1', cursor: 'default' },
  emptyState: { padding: '24px 0', color: 'var(--theme-muted)', textAlign: 'center', fontSize: 14 },
};

export default ExamDashboard;