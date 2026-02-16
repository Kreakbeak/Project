import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { reportAPI, pestAPI } from '../api';
import { downloadReportPDF } from '../utils/pdfExport';

function FarmerReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPest, setSelectedPest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await reportAPI.getReportById(id);
        setReport(response.data.report);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <div className="loading">Loading report...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!report) return <div className="error">Report not found</div>;

  return (
    <div>
      <nav className="navbar">
        <h1>Pest & Disease Reporting System</h1>
        <nav>
          <Link to="/farmer/my-reports">Back to My Reports</Link>
          <Link to="/farmer/dashboard">Dashboard</Link>
          <span onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Report Detail</h2>
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
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Report Information - Left Column */}
          <div>
            <div className="report-card">
              <h3 style={{ color: '#0f172a' }}>Report Information</h3>
              <p><strong>Crop Type:</strong> {report.cropType}</p>
              <p><strong>Location:</strong> {report.location}</p>
              <p><strong>Reported Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${report.status.toLowerCase()}`}>{report.status}</span></p>
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

          {/* Right Column - Admin Response & Referral */}
          <div>
            {/* Treatment Recommendation */}
            {report.treatment && (
              <div className="report-card" style={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196F3', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#1565c0', marginTop: 0 }}>💊 Treatment Recommendation</h3>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {report.treatment}
                </p>
              </div>
            )}

            {/* Referred Pest/Disease */}
            {report.referredPestId ? (
              <div className="report-card" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a' }}>
                <h3 style={{ color: '#16a34a', marginTop: 0 }}>📚 Matched To</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Your report has been identified as:
                </p>
                
                <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #d1fae5' }}>
                  <h4 style={{ color: '#16a34a', marginTop: 0 }}>{report.referredPestId?.name || 'Unknown'}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    <p><strong>Type:</strong> {report.referredPestId?.type}</p>
                    <p><strong>Crop:</strong> {report.referredPestId?.cropType}</p>
                  </div>
                  
                  {report.referredPestId?.description && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong>Description:</strong>
                      <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>{report.referredPestId?.description}</p>
                    </div>
                  )}
                  
                  {report.referredPestId?.symptoms && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong>Symptoms:</strong>
                      <p style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{report.referredPestId?.symptoms}</p>
                    </div>
                  )}
                  
                  {report.referredPestId?.treatment && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong>Treatment:</strong>
                      <p style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{report.referredPestId?.treatment}</p>
                    </div>
                  )}
                  
                  {report.referredPestId?.prevention && (
                    <div>
                      <strong>Prevention:</strong>
                      <p style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{report.referredPestId?.prevention}</p>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => setSelectedPest(report.referredPestId)}
                  style={{ 
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  View Full Details
                </button>
              </div>
            ) : (
              <div className="report-card" style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
                <h3 style={{ color: '#b45309', marginTop: 0 }}>⏳ Pending Identification</h3>
                <p>Your report is awaiting admin review and pest/disease identification.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedPest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <h2 style={{ color: '#16a34a', marginTop: 0 }}>{selectedPest.name}</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>Type:</strong> {selectedPest.type}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Crop Type:</strong> {selectedPest.cropType}
            </div>
            
            {selectedPest.imagePath && (
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src={`http://localhost:5000${selectedPest.imagePath}`}
                  alt={selectedPest.name}
                  style={{ maxWidth: '100%', borderRadius: '4px' }}
                />
              </div>
            )}
            
            {selectedPest.description && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Description:</strong>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedPest.description}</p>
              </div>
            )}
            
            {selectedPest.symptoms && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Symptoms:</strong>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedPest.symptoms}</p>
              </div>
            )}
            
            {selectedPest.treatment && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Treatment:</strong>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedPest.treatment}</p>
              </div>
            )}
            
            {selectedPest.prevention && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Prevention:</strong>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedPest.prevention}</p>
              </div>
            )}
            
            <button 
              onClick={() => setSelectedPest(null)}
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                marginTop: '1rem',
                fontWeight: '600'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmerReportDetail;
