import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/public/HomePage';
import AdminLogin from './portals/admin/pages/AdminLogin';
import AdminDashboard from './portals/admin/pages/AdminDashboard';
import UserDashboard from './portals/user/pages/UserDashboard';
import ExamDashboard from './portals/user/pages/ExamDashboard';
import UserLogin from './portals/user/pages/UserLogin';
import ProtectedRoute from './components/private/ProtectedRoute';
import ThemeToggle from './components/public/ThemeToggle';
import { ThemeProvider } from './components/public/ThemeContext';

function App() {
  return (
    <ThemeProvider>
       <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-login" element={<UserLogin />} />

        <Route element={<ProtectedRoute allowedRole="student" />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-exams" element={<ExamDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ThemeToggle />
    </ThemeProvider>
  );
}

export default App;
