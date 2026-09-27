import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ allowedRole }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {

    return <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'} replace />;
  }
  
  return <Outlet />;
}

export default ProtectedRoute;
