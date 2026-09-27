import React, { useState } from "react";
import { auth, db } from '../../../config/firebase';
import {doc, getDoc} from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // admin login handel
  const handleAdminLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        CheckRole(userCredential.user.email);
      })
      .catch((error) => {
        alert(`Admin Login Error: ${error.code}`);
      });
  };

  // check role function
  const CheckRole = async (email) => {
    try {
      const docRef = doc(db, "admin", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.Role === "admin") {
          navigate('/admin-dashboard', { replace: true });
        } else {
          alert("Access Denied: You are not an admin. Please Login/Register from student login.");
          navigate('/', { replace: true });
        }
      } else {
        alert("Admin not found.");
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
    }
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
