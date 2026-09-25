import { useState } from "react";
import icon from '../media/google-small.png';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [isSignup, setisSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard', { replace: true });
      }).catch((error) => {
        console.error("Signup Error:", error.code, error.message);//errors show from here
        alert("Error: " + error.message);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard', { replace: true }); // Navigate to the dashboard after successful login
      }).catch((error) => {
        console.error("Login Error:", error.code, error.message);
        alert("Error: " + error.message);
      });
  };

  const handleGoogleAuth = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    signInWithPopup(auth, provider)
      .then(() => {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard', { replace: true }); // Navigate to the dashboard after successful Google login
      })
      .catch((error) => {
        console.error("Google Auth Error:", error.code, error.message);
        alert("Error: " + error.message);
      });
  };

  const toggleAuthMode = (isSignupView) => {
    setisSignup(isSignupView);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="auth-screen-wrapper">
      {isSignup ? (
        <div className="right-block">
          <div className="form-content">
            <h2>Sign Up</h2>
            <p className="subtitle">Enter your details to Create new account</p>
            
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} id="name" autoComplete="username" required />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} id="email" autoComplete="email" required />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="•••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} id="password" autoComplete="new-password" required />
              </div>
              <button type="submit" className="submit-btn">Sign Up</button>
            </form>

            <div className="divider">
              <span>or sign up with Google Account</span>
            </div>

            <button className="google-btn" onClick={handleGoogleAuth}>
              <img src={icon} alt="Google icon" /> Sign Up with Google
            </button>
            
            <p className="footer-text">Already have an account? <a href="#Signin" onClick={() => toggleAuthMode(false)}>Sign In</a></p>
          </div>
        </div>
      ) : (
        <div className="right-block">
          <div className="form-content">
            <h2>Sign In</h2>
            <p className="subtitle">Enter your details to Login your account</p>
            
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} id="email" autoComplete="email" required />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="•••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} id="password" autoComplete="current-password" required />
              </div>
              <button type="submit" className="submit-btn">Sign In</button>
            </form>

            <div className="divider">
              <span>or sign in with Google Account</span>
            </div>

            <button className="google-btn" onClick={handleGoogleAuth}>
              <img src={icon} alt="Google icon" /> Sign in with Google
            </button>
            
            <p className="footer-text">Don't have an account? <a href="#Signup" onClick={() => toggleAuthMode(true)}>Sign Up</a></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;