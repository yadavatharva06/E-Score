import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/public/HomePage';
import AdminLogin from './portals/admin/pages/AdminLogin';
import AdminDashboard from './portals/admin/pages/AdminDashboard';
import UserDashboard from './portals/user/pages/UserDashboard';
import UserLogin from './portals/user/pages/UserLogin';
import ProtectedRoute from './components/private/ProtectedRoute';

function App() {
  return (
    <>
       <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-login" element={<UserLogin />} />

        {/* user route */}
        <Route element={<ProtectedRoute allowedRole="student" />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>

        {/* admin route */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* wildcard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
