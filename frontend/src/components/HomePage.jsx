
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Navigates the user to the /login URL path
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Top Navigation Bar */}
      <header style={styles.header}>
        <h1 style={styles.logo}>MyWebsite</h1>
        <button style={styles.loginButton} onClick={handleLoginClick}>
          Login
        </button>
      </header>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        <h2>Welcome to Our Website</h2>
        <p>
          This is a description of your amazing website. Here, you can explain 
          what services you provide, your mission statement, or any other features 
          that will catch the visitor's attention.
        </p>
      </main>
    </div>
  );
}

// Simple inline styling to layout the elements
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px',
  },
  logo: {
    margin: 0,
    fontSize: '24px',
  },
  loginButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  mainContent: {
    marginTop: '40px',
    textAlign: 'center',
  },
};

export default HomePage;
