import React, { useState } from 'react';
import { auth } from '../../../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AdminSetting from './AdminSetting';
import FeedExamDetail from './FeedExamDetail';
import CreateLiveExam from './CreateLiveExam';
import ManageUsers from './ManageUsers';
import AdminProfile from './AdminProfile';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('adminProfile');

  const handleAdminLogOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        navigate('/admin-login', { replace: true });
      })
      .catch((error) => {
        alert(`Admin Logout Error: ${error.code}`);
      });
  };

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <div className="sidebar-title">E-Score Admin</div>
        <nav className="admin-nav-links">
          <button 
            className={`admin-nav-btn ${activeTab === 'adminProfile' ? 'active' : ''}`}
            onClick={() => setActiveTab('adminProfile')}
          >
            👤 Profile
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'FeedExamDetail' ? 'active' : ''}`}
            onClick={() => setActiveTab('FeedExamDetail')}
          >
            📊 Feed Exam Detail 
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'createLiveExam' ? 'active' : ''}`}
            onClick={() => setActiveTab('createLiveExam')}
          >
            📝 Create Live Exam
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'manageUsers' ? 'active' : ''}`}
            onClick={() => setActiveTab('manageUsers')}
          >
            🧑‍🎓 User Control
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'setting' ? 'active' : ''}`}
            onClick={() => setActiveTab('setting')}
          >
            ⚙️ Setting
          </button>
        </nav>
        <button className="logout-btn" onClick={handleAdminLogOut}>
          Log Out
        </button>
      </aside>

      {/* 📜 Dynamic Right Side Content Viewport Workspace */}
      <main className="admin-main-content">
        <header className="admin-header">
          <h2>Administrator Panel</h2>
          <div className="admin-role-badge">Welcome: Admin Name</div>
        </header>

        <div className="admin-workspace-body">
          
          {activeTab === 'adminProfile' && <AdminProfile/>}

          {activeTab === 'FeedExamDetail' && <FeedExamDetail/>}

          {activeTab === 'createLiveExam' && <CreateLiveExam/>}

          {activeTab === 'manageUsers' && <ManageUsers/>}

          {activeTab === 'setting' && <AdminSetting />}

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
