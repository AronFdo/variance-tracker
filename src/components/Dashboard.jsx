import { useAuth } from '../contexts/AuthContext';
import { logout } from '../firebase/auth';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Staffing Variance Tracker</h1>
          <div className="user-info">
            <span>Welcome, {currentUser?.displayName || currentUser?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to your Dashboard</h2>
          <p>Firebase Auth and Firestore are now set up and ready to use!</p>
          <div className="info-grid">
            <div className="info-card">
              <h3>✓ Firebase Auth</h3>
              <p>Authentication is configured and working</p>
            </div>
            <div className="info-card">
              <h3>✓ Firestore</h3>
              <p>Database is ready for your data</p>
            </div>
            <div className="info-card">
              <h3>✓ User Profile</h3>
              <p>Email: {currentUser?.email}</p>
              {currentUser?.displayName && <p>Name: {currentUser.displayName}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


