import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './components/public/HomePage';
import AdminLogin from './portals/admin/pages/AdminLogin';
import AdminDashboard from './portals/admin/pages/AdminDashboard';
import UserDashboard from './portals/user/pages/UserDashboard';
import ExamInterface from './components/private/ExamInterface';
import UserLogin from './portals/user/pages/UserLogin';
import ProtectedRoute from './components/private/ProtectedRoute';
import ThemeToggle from './components/public/ThemeToggle';
import { ThemeProvider } from './components/public/ThemeContext';

function App() {
  const location = useLocation();
  const isExamRoute = location.pathname.startsWith('/user-dashboard/exam/');

  useEffect(() => {
    if (!isExamRoute && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [isExamRoute]);

  return (
    <ThemeProvider>
       <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-login" element={<UserLogin />} />

        <Route element={<ProtectedRoute allowedRole="student" />}>
          <Route path="/user-dashboard/exam/:examId" element={<ExamInterface />} />
          <Route path="/user-dashboard/*" element={<UserDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isExamRoute && <ThemeToggle />}
    </ThemeProvider>
  );
}

export default App;
