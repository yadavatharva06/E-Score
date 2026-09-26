import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    navigate('/user-login');
  };

  const handelAdminLogin = () => {
    navigate('/admin-login');
  }

  return (
    <div className="homepage-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">E-Score</div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#advantages" className="nav-link">Advantages</a>
          <a href="#interface" className="nav-link">Exam Interface</a>
          <button className="login-btn" onClick={handelAdminLogin}>Admin</button>
          <button className="login-btn" onClick={handleStudentLogin}>Student Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1 className="hero-title">Master Your Competitive Exams with <span>E-Score</span></h1>
        <p className="hero-subtitle">
          Experience the closest simulation to real competitive exams. Practice with high-quality mock tests, track your performance, and score higher.
        </p>
        <div className="hero-buttons">
          <button className="primary-btn" onClick={handleStudentLogin}>
            Explore Mock Tests
          </button>
        </div>
      </header>

      {/* Description & Features Section */}
      <section id="features" className="section">
        <h2 className="section-title">About E-Score</h2>
        <p className="section-description">
          E-Score is a premium web application engineered for aspirants of major competitive examinations. We replicate the exact environment, constraints, and pressure of physical test centres digitally, empowering you to eliminate exam anxiety.
        </p>

        <div className="grid-layout">
          <div className="content-card">
            <h3 className="card-title">Real Exam Interface</h3>
            <p className="card-text">Identical layouts, question palettes, timers, and navigation rules used by official examination bodies.</p>
          </div>
          <div className="content-card">
            <h3 className="card-title">Instant AI Analytics</h3>
            <p className="card-text">Get deep insights into your speed, accuracy, subject-wise strengths, and time management breakdowns.</p>
          </div>
          <div className="content-card">
            <h3 className="card-title">Curated Test Series</h3>
            <p className="card-text">Thousands of questions drafted by top educators, mapped precisely to the latest exam syllabus.</p>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="advantages" className="advantages-section">
        <h2 className="section-title">Why Choose E-Score?</h2>
        <div className="grid-layout">
          <div className="advantage-card">
            <div className="card-icon">🎯</div>
            <h4 className="card-title">Precision Benchmarking</h4>
            <p className="card-text">Compare your scores with lakhs of peers nationwide to understand your true percentile ranking.</p>
          </div>
          <div className="advantage-card">
            <div className="card-icon">⚡</div>
            <h4 className="card-title">Zero-Lag Simulation</h4>
            <p className="card-text">Our platform is optimized for low latency, ensuring no interruption during crucial mock sessions.</p>
          </div>
          <div className="advantage-card">
            <div className="card-icon">🛡️</div>
            <h4 className="card-title">Anti-Cheat System</h4>
            <p className="card-text">Institutions can leverage full-screen proctoring and tab-lock mechanisms for clean, real assessments.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-bar">
        <p>&copy; 2026 E-Score. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
