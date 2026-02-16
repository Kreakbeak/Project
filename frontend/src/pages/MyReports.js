import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { reportAPI } from '../api';
import { downloadReportPDF } from '../utils/pdfExport';

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getMyReports();
      setReports(response.data.reports);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportAPI.deleteReport(id);
        setReports(reports.filter(r => r._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete report');
      }
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Pest & Disease Reporting System</h1>
        <nav>
          <Link to="/farmer/dashboard">Dashboard</Link>
          <Link to="/farmer/submit-report">Submit Report</Link>
          <span onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>
      <div className="container">
        <h2>My Reports</h2>
        {error && <div className="error">{error}</div>}
        {loading && <div className="loading">Loading reports...</div>}
        {!loading && reports.length === 0 && <div className="info">No reports yet. <Link to="/farmer/submit-report">Submit one now</Link></div>}
        {!loading && reports.length > 0 && (
          <div>
            {reports.map(report => (
              <div key={report._id} className="report-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3>{report.cropType} - {report.location}</h3>
                    <div className="report-meta">
                      Submitted: {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <p><strong>Status:</strong> <span className={`status-badge status-${report.status.toLowerCase()}`}>{report.status}</span></p>
                    <p><strong>Description:</strong> {report.description}</p>
                    {report.imagePath && (
                      <img src={`http://localhost:5000${report.imagePath}`} alt="Report" style={{ maxWidth: '200px', marginTop: '0.5rem' }} />
                    )}
                    {report.treatment && (
                      <p style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                        <strong>Treatment Recommendation:</strong><br />
                        {report.treatment}
                      </p>
                    )}
                  </div>
                  <div style={{ marginLeft: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    <Link to={`/farmer/report/${report._id}`}><button>View Details</button></Link>
                    <button 
                      onClick={() => downloadReportPDF(report)}
                      style={{
                        backgroundColor: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      📥 Download
                    </button>
                    <button className="danger" onClick={() => handleDelete(report._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReports;
