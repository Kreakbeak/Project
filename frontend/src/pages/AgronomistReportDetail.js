import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { reportAPI, pestAPI } from '../api';
import { downloadReportPDF } from '../utils/pdfExport';

function AgronomistReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [treatment, setTreatment] = useState('');
  const [feedback, setFeedback] = useState('');
  const [updating, setUpdating] = useState(false);
  const [pests, setPests] = useState([]);
  const [selectedPestId, setSelectedPestId] = useState('');
  const [selectedPestDetails, setSelectedPestDetails] = useState(null);
  const [referringPest, setReferringPest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportAndPests = async () => {
      try {
        const reportResponse = await reportAPI.getReportById(id);
        const report = reportResponse.data.report;
        setReport(report);
        setStatus(report.status);
        setTreatment(report.treatment || '');
        setFeedback(report.feedback || '');
        
        // Fetch pests matching the crop type
        const pestsResponse = await pestAPI.getByCrop(report.cropType);
        setPests(pestsResponse.data.pests);
        
        // Set initial selected pest if one is already referred
        if (report.referredPestId) {
          setSelectedPestId(report.referredPestId._id);
          setSelectedPestDetails(report.referredPestId);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReportAndPests();
  }, [id]);

  const handlePestSelection = (e) => {
    const pestId = e.target.value;
    setSelectedPestId(pestId);
    
    if (pestId === 'not_in_library') {
      setSelectedPestDetails(null);
    } else {
      const pest = pests.find(p => p._id === pestId);
      setSelectedPestDetails(pest);
      if (pest) {
        setTreatment(pest.treatment || '');
      }
    }
  };

  const handleReferPest = async () => {
    if (!selectedPestId) {
      setError('Please select a pest or disease');
      return;
    }

    setReferringPest(true);
    try {
      const response = await reportAPI.referPestToReport(id, selectedPestId);
      setReport(response.data.report);
      setError('');
      alert('Pest reference added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refer pest');
    } finally {
      setReferringPest(false);
    }
  };

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
        <h1>Pest & Disease Reporting System - Agronomist</h1>
        <nav>
          <Link to="/agronomist/dashboard">Back to Reports</Link>
          <span onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Report Analysis & Recommendations</h2>
          {report && (
            <button 
              onClick={() => downloadReportPDF(report)}
              style={{
                backgroundColor: '#16a34a',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📥 Download Report
            </button>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Report Information */}
          <div>
            <div className="report-card">
              <h3 style={{ color: '#0f172a' }}>Farmer Information</h3>
              <p><strong>Name:</strong> {report.farmerId?.name}</p>
              <p><strong>Email:</strong> {report.farmerId?.email}</p>
              <p><strong>Phone:</strong> {report.farmerId?.phone}</p>
              <p><strong>Location:</strong> {report.farmerId?.location}</p>
            </div>

            <div className="report-card">
              <h3 style={{ color: '#0f172a' }}>Report Information</h3>
              <p><strong>Crop Type:</strong> {report.cropType}</p>
              <p><strong>Location:</strong> {report.location}</p>
              <p><strong>Reported Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
              <p><strong>Current Status:</strong> <span className={`status-badge status-${report.status.toLowerCase()}`}>{report.status}</span></p>
            </div>

            <div className="report-card">
              <h3 style={{ color: '#0f172a' }}>Problem Description</h3>
              <p style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                {report.description}
              </p>
              {report.imagePath && (
                <div style={{ marginTop: '1rem' }}>
                  <p><strong>Report Image:</strong></p>
                  <img 
                    src={`http://localhost:5000${report.imagePath}`} 
                    alt="Report" 
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', marginTop: '0.5rem' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Agronomist Analysis & Actions */}
          <div>
            {/* Pest/Disease Identification */}
            <div className="report-card" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#16a34a', marginTop: 0 }}>🔍 Pest/Disease Identification</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Match to Library (Crop: {report.cropType})
                </label>
                <select
                  value={selectedPestId}
                  onChange={handlePestSelection}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    marginBottom: '0.75rem'
                  }}
                >
                  <option value="">-- Select Pest/Disease --</option>
                  {pests.map(pest => (
                    <option key={pest._id} value={pest._id}>
                      {pest.name} ({pest.type})
                    </option>
                  ))}
                  <option value="not_in_library">Not in Library - Will add custom</option>
                </select>

                {selectedPestDetails && (
                  <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', border: '1px solid #d1fae5' }}>
                    <h4 style={{ color: '#16a34a', marginTop: 0 }}>{selectedPestDetails.name}</h4>
                    <p><strong>Type:</strong> {selectedPestDetails.type}</p>
                    {selectedPestDetails.symptoms && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <strong>Symptoms:</strong>
                        <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                          {selectedPestDetails.symptoms}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleReferPest}
                  disabled={referringPest || !selectedPestId}
                  style={{
                    width: '100%',
                    backgroundColor: selectedPestId ? '#3b82f6' : '#cbd5e1',
                    color: '#fff',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    cursor: selectedPestId ? 'pointer' : 'not-allowed',
                    fontWeight: '600',
                    marginTop: '0.75rem'
                  }}
                >
                  {referringPest ? '⏳ Matching...' : '✓ Confirm Identification'}
                </button>
              </div>
            </div>

            {/* Treatment & Recommendations */}
            <div className="report-card" style={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196F3', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#1565c0', marginTop: 0 }}>💊 Treatment & Recommendations</h3>
              
              <form onSubmit={handleUpdate}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Update Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Identified">Identified</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Treatment Recommendation
                  </label>
                  <textarea
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder="Provide detailed treatment recommendations based on the identified pest/disease..."
                    rows="6"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Additional Feedback & Notes
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add any additional observations, preventive measures, or follow-up recommendations..."
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  style={{
                    width: '100%',
                    backgroundColor: '#1565c0',
                    color: '#fff',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    cursor: updating ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}
                >
                  {updating ? '⏳ Updating...' : '💾 Save Analysis & Update Status'}
                </button>
              </form>
            </div>

            {/* Current Status */}
            {report.treatment && (
              <div className="report-card" style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
                <h3 style={{ color: '#b45309', marginTop: 0 }}>📝 Previous Analysis</h3>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {report.treatment}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgronomistReportDetail;
