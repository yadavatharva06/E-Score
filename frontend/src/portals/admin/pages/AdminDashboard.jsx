import { auth } from '../../../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();

  // admin logout
  const handleAdminLogOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        navigate('/admin-login', { replace: true });
      })
      .catch((error) => {
        alert(`Admin Logout Error: , ${error.code}`);
      });
  };

  return (
    <div className="admin-dashboard-container">
      {/* Admin Operations Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-title">E-Score Admin</div>
        <nav className="admin-nav-links">
          <button className="admin-nav-btn active">📊 System Overview</button>
          <button className="admin-nav-btn">📝 Question Bank</button>
          <button className="admin-nav-btn">🧑‍🎓 User Control</button>
        </nav>
        <button className="logout-btn" onClick={handleAdminLogOut}>
          Log Out
        </button>
      </aside>

      {/* Primary Workspace Window */}
      <main className="admin-main-content">
        <header className="admin-header">
          <h2>Management Console</h2>
          <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
            Role: System Administrator
          </div>
        </header>

        <div className="admin-workspace-body">
          <div className="welcome-card">
            <h3>Welcome to your Management Matrix Dashboard</h3>
            <p>
              From this operational environment, you can supervise live test deployment cycles, create custom question structures for competitive mock examinations, and track structural user profiles cleanly.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
