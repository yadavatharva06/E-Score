import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


function ProtectedRoute({ allowedRole }) {
  // 1. Gather browser status tokens set during your LoginPage execution
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole'); // Expects 'student' or 'admin'

  // 🛡️ Security Check 1: User is completely anonymous (Not Logged In)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🛡️ Security Check 2: User logged in, but role does not match requirements
  if (allowedRole && userRole !== allowedRole) {
    // If a student attempts to access /admin panels, send them to student dashboard
    // If an admin attempts to access student routes, send them to admin dashboard
    return <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/dashboard'} replace />;
  }

  // 🔓 Validation Passed: Securely mount child views inside Layout structures using <Outlet />
  return <Outlet />;
}

export default ProtectedRoute;
