import React, { useState } from 'react';
import { auth } from '../../../config/firebase';
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../styles/UserDashboard.css';

function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Hardcoded real exam analytical metrics
  const scoreData = [
    { label: "Mock 1", score: 68, percentage: "68%" },
    { label: "Mock 2", score: 74, percentage: "74%" },
    { label: "Mock 3", score: 81, percentage: "81%" },
    { label: "Mock 4", score: 79, percentage: "79%" },
    { label: "Mock 5", score: 88, percentage: "88%" }
  ];

  const availableTests = [
    { id: "cs-101", title: "National Level CS Mock - 1", questions: "40 Qs", time: "60 Mins" },
    { id: "cs-102", title: "Data Structures Diagnostic", questions: "25 Qs", time: "40 Mins" },
    { id: "cs-103", title: "Algorithm Speed Sprint", questions: "30 Qs", time: "30 Mins" }
  ];

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        alert("User successfully signed out!");
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        const userRole = localStorage.getItem('userRole');
        console.log("Logout Successful! Current User Role:", userRole);
        navigate('/user-login', { replace: true });
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
        alert(error.message);
      });
  };

  const handleStartExam = (testId) => {
    // Navigates directly into your testing interface suite
    navigate(`/dashboard/mock-test/${testId}`);
  };

  return (
    <div className="dashboard-container">
      {/* Shared Dashboard Side Navigation Panel */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">E-Score</div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            🏠 Home Overview
          </button>
          <button 
            className={`nav-item-btn ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            📝 Available Mock Tests
          </button>
          <button 
            className={`nav-item-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            📊 Detailed Analytics
          </button>
        </nav>
        <button className="logout-btn-sidebar" onClick={handleLogOut}>
          Log Out
        </button>
      </aside>

      {/* Main Content Workspace Frame */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>E-Score Student Dashboard</h2>
          <div style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
            Welcome Back, Student
          </div>
        </header>

        <div className="dashboard-content">
          {/* Top Level Metric Evaluation Ribbon */}
          <section className="stats-grid">
            <div className="stat-card">
              <div style={styles.statLabel} className="stat-label">All-India Rank</div>
              <div className="stat-value highlight">#1,482</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Overall Percentile</div>
              <div className="stat-value">98.4%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Mock Tests Solved</div>
              <div className="stat-value">05</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Average Accuracy</div>
              <div className="stat-value">82.3%</div>
            </div>
          </section>

          {/* Core Graphical Breakdown & Mock Test Queue split */}
          <div className="content-split-row">
            {/* Visual Progress Graph Panel */}
            <div className="panel-card">
              <h3 className="panel-title">Score Trajectory & Performance Analysis</h3>
              <div className="graph-canvas">
                {scoreData.map((item, idx) => (
                  <div key={idx} className="graph-column-wrapper">
                    <div 
                      className="graph-bar" 
                      style={{ height: item.percentage }}
                    >
                      <span className="graph-tooltip">{item.score}</span>
                    </div>
                    <span className="graph-label">{item.label}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: '#666', margin: '15px 0 0 0', lineHeight: 1.5 }}>
                🎯 <strong>Trend Analysis:</strong> Your test parameters indicate a steady 14% efficiency upward spike over the last 3 assessment cycles due to increased processing metrics in data structures.
              </p>
            </div>

            {/* Test Queue Entry Panels */}
            <div className="panel-card">
              <h3 className="panel-title">Assigned Mock Exams</h3>
              <div className="mock-test-list">
                {availableTests.map((test) => (
                  <div key={test.id} className="mock-test-item">
                    <div className="mock-info">
                      <h4>{test.title}</h4>
                      <p>{test.questions} | {test.time}</p>
                    </div>
                    <button 
                      className="btn-launch-test"
                      onClick={() => handleStartExam(test.id)}
                    >
                      Launch
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Inline fallback variables matching dashboard theme configuration requirements
const styles = {
  statLabel: {
    letterSpacing: '0.5px'
  }
};

export default UserDashboard;
