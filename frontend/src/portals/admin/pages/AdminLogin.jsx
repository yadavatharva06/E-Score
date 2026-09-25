import React, { useState } from "react";
import { auth } from '../../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        const userRole = localStorage.getItem('userRole');
        console.log("Login Successful! Current User Role:", userRole);
        navigate('/admin-dashboard', { replace: true });
      })
      .catch((error) => {
        console.error("Admin Login Error:", error.code, error.message);
        alert("Authentication Failed: " + error.message);
      });
  };

  return (
    <div className="auth-screen-admin">
      <div className="block">
        <div className="form-menu">
          
          <h2>Admin Sign In</h2>

          <form onSubmit={handleAdminLogin}>
            <div className="input-box">
              <label htmlFor="admin-email">Admin Email</label>
              <input 
                type="email" 
                placeholder="admin@escore.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                id="admin-email" 
                autoComplete="email"
                required 
              />
            </div>
            
            <div className="input-box">
              <label htmlFor="admin-password">Admin Password</label>
              <input 
                type="password" 
                placeholder="•••••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                id="admin-password" 
                autoComplete="current-password"
                required 
              />
            </div>
            
            <button type="submit" className="submit-btn-admin">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
