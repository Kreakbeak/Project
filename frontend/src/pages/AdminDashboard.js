import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Pest & Disease Reporting System - Admin</h1>
        <nav>
          <Link to="/admin/reports">View Reports</Link>
          <Link to="/admin/pests">Manage Library</Link>
          <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>
      <div className="container">
        <h2>Welcome to Admin Dashboard</h2>
        <div style={{ marginTop: '2rem' }}>
          <div className="report-card">
            <h3>📋 Manage Reports</h3>
            <p>View all farmer reports, identify pests/diseases, and provide treatment recommendations.</p>
            <Link to="/admin/reports"><button>View All Reports</button></Link>
          </div>
          <div className="report-card">
            <h3>🔍 Report Analysis</h3>
            <p>Track outbreak patterns and update report statuses as they are identified and resolved.</p>
            <Link to="/admin/reports"><button>Go to Reports</button></Link>
          </div>
          <div className="report-card">
            <h3>📚 Manage Pest & Disease Library</h3>
            <p>Add, edit, and manage pest and disease information that farmers can reference and learn from.</p>
            <Link to="/admin/pests"><button>Manage Library</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
