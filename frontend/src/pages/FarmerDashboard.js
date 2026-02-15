import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function FarmerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Pest & Disease Reporting System</h1>
        <nav>
          <Link to="/farmer/submit-report">Submit Report</Link>
          <Link to="/farmer/my-reports">My Reports</Link>
          <Link to="/farmer/library">Library</Link>
          <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>
      <div className="container">
        <h2>Welcome to Farmer Dashboard</h2>
        <div style={{ marginTop: '2rem' }}>
          <div className="report-card">
            <h3>📋 Submit a Report</h3>
            <p>Report pests or diseases affecting your crops. Upload images and provide details for expert identification.</p>
            <Link to="/farmer/submit-report"><button>Submit Report</button></Link>
          </div>
          <div className="report-card">
            <h3>📊 View My Reports</h3>
            <p>Track the status of all your submitted reports. View recommendations from agricultural experts.</p>
            <Link to="/farmer/my-reports"><button>View Reports</button></Link>
          </div>
          <div className="report-card">
            <h3>📚 Pest & Disease Library</h3>
            <p>Learn about common pests and diseases affecting your crops. View detailed information and treatment methods.</p>
            <Link to="/farmer/library"><button>View Library</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerDashboard;
