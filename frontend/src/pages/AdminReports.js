import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { reportAPI } from '../api';

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getAllReports();
      setReports(response.data.reports);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = filter === 'All' 
    ? reports 
    : reports.filter(r => r.status === filter);

  return (
    <div>
      <nav className="navbar">
        <h1>Pest & Disease Reporting System - Admin</h1>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <span onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>
      <div className="container">
        <h2>All Reports</h2>
        {error && <div className="error">{error}</div>}
        
        <div style={{ marginBottom: '2rem' }}>
          <label>Filter by Status: </label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginLeft: '1rem', padding: '0.5rem' }}
          >
            <option value="All">All Reports</option>
            <option value="Pending">Pending</option>
            <option value="Identified">Identified</option>
            <option value="Resolved">Resolved</option>
          </select>
          <p style={{ marginTop: '0.5rem', color: '#7f8c8d' }}>Total: {filteredReports.length} reports</p>
        </div>

        {loading && <div className="loading">Loading reports...</div>}
        {!loading && filteredReports.length === 0 && <div className="info">No reports found</div>}
        {!loading && filteredReports.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Farmer</th>
                  <th>Crop</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr key={report._id}>
                    <td>{report.farmerId?.name}</td>
                    <td>{report.cropType}</td>
                    <td>{report.location}</td>
                    <td>
                      <span className={`status-badge status-${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/admin/report/${report._id}`}>
                        <button style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReports;
