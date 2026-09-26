import { useState } from "react";
import icon from '../../../assects/icons/google-small.png';
import { auth } from '../../../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../styles/UserLogin.css';
import { db } from '../../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

function UserLogin() {
  const [isSignup, setisSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // new user handle
  const handleRegister = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate('/user-dashboard', { replace: true });
        const user = userCredential.user;
        const uName = name;
        const uEmail = user.email;
        const uid = user.uid;
        saveUserData(uName, uEmail, uid);
      }).catch((error) => {
        alert(`Registration Error: ${error.code}`);
      });
    };
    
    //google signin or signup
    const handleGoogleAuth = () => {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      signInWithPopup(auth, provider)
      .then((userCredential) => {
        navigate('/user-dashboard', { replace: true });
        const user = userCredential.user;
        const uName = user.displayName;
        const uEmail = user.email;
        const uid = user.uid;
        saveUserData(uName, uEmail, uid);
      })
      .catch((error) => {
        console.error("Google Auth Error:", error.code, error.message);
      });
    };

  //save new user data in db after register
  const saveUserData = async (name, email, uid) => {
    try {

      const docRef = doc(db, "users", uid);

      await setDoc(docRef, {
        name: name,
        email: email,
        uid: uid,
        role: "student",
      });
    } catch (error) {
      alert(`Error: , ${error}`);
    }
  };

  //login of user
  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/user-dashboard', { replace: true });
      }).catch((error) => {
        alert(`Login Error:  ${error.code}`);
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

export default UserLogin;
