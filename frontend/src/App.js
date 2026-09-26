import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/pages/HomePage';

// admin
import AdminLogin from './portals/admin/pages/AdminLogin';
import AdminDashboard from './portals/admin/pages/AdminDashboard';

// user
import UserDashboard from './portals/user/pages/UserDashboard';
import UserLogin from './portals/user/pages/UserLogin';


function App() {
  return (
    <>
       <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        {/* --- 4. WILDCARD CATCH-ALL --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
