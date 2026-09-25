import { Routes, Route, Navigate } from 'react-router-dom'; // Notice <Router> wrapper isn't here
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import './App.css';


// 1. THIS IS WHAT WAS MISSING: Declaring the ProtectedRoute helper
function ProtectedRoute({ children }) {
  // Check if the user is authenticated from localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  // If authenticated, show the dashboard. If not, redirect to login page.
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
