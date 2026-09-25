import { auth } from '../config/firebase';
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function Dashboard() {

  const navigate = useNavigate();

  // 2. Define the log out handler function
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        alert("User successfully signed out!")
        localStorage.removeItem('isAuthenticated');
        // The global state listener in App.jsx will automatically 
        // see this and redirect the user back to the AuthPage.
        navigate('/login', { replace: true }); // Navigate to the login page after signing out
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
        alert.error(error.message)
      });
  };

  return (
    <div>
      <header>
        <h2>E-Score Student Dashboard</h2>
        
        {/* 3. Attach the function to your Log Out button */}
        <button 
          onClick={handleLogOut} 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Log Out
        </button>
      </header>
    </div>
  );
}

export default Dashboard;
