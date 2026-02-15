import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { reportAPI } from '../api';

function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [treatment, setTreatment] = useState('');
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await reportAPI.getReportById(id);
        setReport(response.data.report);
        setStatus(response.data.report.status);
        setTreatment(response.data.report.treatment || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await reportAPI.updateReportStatus(id, status, treatment);
      setReport(response.data.report);
      setError('');
      alert('Report updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Loading report...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!report) return <div className="error">Report not found</div>;

  return (
    <div>
      <nav className="navbar">
        <h1>Pest & Disease Reporting System - Admin</h1>
        <nav>
          <Link to="/admin/reports">Back to Reports</Link>
          <Link to="/admin/dashboard">Dashboard</Link>
          <span onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>
      <div className="container">
        <h2>Report Detail</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Report Information */}
          <div>
            <div className="report-card">
              <h3>Farmer Information</h3>
              <p><strong>Name:</strong> {report.farmerId?.name}</p>
              <p><strong>Email:</strong> {report.farmerId?.email}</p>
              <p><strong>Phone:</strong> {report.farmerId?.phone}</p>
              <p><strong>Location:</strong> {report.farmerId?.location}</p>
            </div>

            <div className="report-card">
              <h3>Problem Details</h3>
              <p><strong>Crop Type:</strong> {report.cropType}</p>
              <p><strong>Location:</strong> {report.location}</p>
              <p><strong>Reported Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
              <p><strong>Current Status:</strong> <span className={`status-badge status-${report.status.toLowerCase()}`}>{report.status}</span></p>
              <p><strong>Description:</strong></p>
              <p style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>{report.description}</p>
              {report.imagePath && (
                <div>
                  <p><strong>Image:</strong></p>
                  <img 
                    src={`http://localhost:5000${report.imagePath}`} 
                    alt="Report" 
                    style={{ maxWidth: '100%', borderRadius: '4px', marginTop: '0.5rem' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Update Form */}
          <div>
            <div className="form-container" style={{ marginTop: 0 }}>
              <h3>Update Report</h3>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Identified">Identified</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Treatment Recommendation</label>
                  <textarea
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder="Add treatment or management recommendations..."
                    rows="6"
                  />
                </div>

                <button type="submit" disabled={updating}>
                  {updating ? 'Updating...' : 'Update Report'}
                </button>
              </form>

              {report.treatment && (
                <div style={{ marginTop: '2rem' }}>
                  <h4>Previous Recommendation:</h4>
                  <p style={{ padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                    {report.treatment}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDetail;
