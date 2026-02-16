import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { reportAPI, pestAPI } from '../api';
import { downloadReportPDF } from '../utils/pdfExport';

function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [treatment, setTreatment] = useState('');
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
      // Don't auto-populate treatment - let admin write it manually
    } else {
      const pest = pests.find(p => p._id === pestId);
      setSelectedPestDetails(pest);
      // Auto-populate treatment with pest treatment recommendation
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
        <h1>Pest & Disease Reporting System - Admin</h1>
        <nav>
          <Link to="/admin/reports">Back to Reports</Link>
          <Link to="/admin/dashboard">Dashboard</Link>
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
            {/* Pest Library Selection */}
            <div className="form-container" style={{ marginTop: 0, backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a', marginBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ color: '#16a34a', margin: 0 }}>🔍 Identify from Library</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Select a pest or disease from the library that matches this report</p>
              
              <div className="form-group">
                <label><strong>Select Pest/Disease</strong></label>
                <select 
                  value={selectedPestId} 
                  onChange={handlePestSelection}
                  style={{ marginBottom: '1rem' }}
                >
                  <option value="">-- Select from library --</option>
                  {pests.map(pest => (
                    <option key={pest._id} value={pest._id}>
                      {pest.name} ({pest.type}) - {pest.cropType}
                    </option>
                  ))}
                  <option value="not_in_library" style={{ fontStyle: 'italic', color: '#dc2626' }}>
                    ❌ Not found in library - Add manual recommendation
                  </option>
                </select>
              </div>

              {selectedPestId && selectedPestId !== 'not_in_library' && selectedPestDetails && (
                <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #d1fae5' }}>
                  <h4 style={{ color: '#16a34a', marginTop: 0 }}>📋 {selectedPestDetails.name}</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <div><strong>Type:</strong> {selectedPestDetails.type}</div>
                    <div><strong>Crop:</strong> {selectedPestDetails.cropType}</div>
                  </div>

                  {selectedPestDetails.description && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong>Description:</strong>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>{selectedPestDetails.description}</p>
                    </div>
                  )}

                  {selectedPestDetails.symptoms && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong>Symptoms:</strong>
                      <p style={{ margin: '0.25rem 0', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>{selectedPestDetails.symptoms}</p>
                    </div>
                  )}

                  {selectedPestDetails.treatment && (
                    <div style={{ marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                      <strong style={{ color: '#1565c0' }}>💊 Suggested Treatment:</strong>
                      <p style={{ margin: '0.25rem 0', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>{selectedPestDetails.treatment}</p>
                    </div>
                  )}

                  {selectedPestDetails.prevention && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong>Prevention:</strong>
                      <p style={{ margin: '0.25rem 0', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>{selectedPestDetails.prevention}</p>
                    </div>
                  )}

                  {selectedPestDetails.imagePath && (
                    <div>
                      <img 
                        src={`http://localhost:5000${selectedPestDetails.imagePath}`}
                        alt={selectedPestDetails.name}
                        style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px', marginTop: '0.5rem' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {selectedPestId === 'not_in_library' && (
                <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', borderLeft: '4px solid #f59e0b' }}>
                  <p style={{ margin: 0, color: '#92400e' }}>
                    <strong>⚠️ Manual Mode:</strong> The reported issue was not found in the library. Please provide manual recommendations in the treatment field below.
                  </p>
                </div>
              )}

              {selectedPestId && (
                <button 
                  onClick={handleReferPest} 
                  disabled={referringPest}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: referringPest ? 'not-allowed' : 'pointer',
                    opacity: referringPest ? 0.6 : 1,
                    width: '100%',
                    marginBottom: '1rem'
                  }}
                >
                  {referringPest ? 'Linking Pest...' : '✓ Link Pest Reference'}
                </button>
              )}

              {report.referredPestId && (
                <div style={{ padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '6px', border: '1px solid #6ee7b7' }}>
                  <p style={{ margin: 0, color: '#047857' }}>
                    <strong>✓ Current Reference:</strong> {report.referredPestId.name}
                  </p>
                </div>
              )}
            </div>

            {/* Status and Treatment Form */}
            <div className="form-container" style={{ marginTop: 0 }}>
              <h3>📝 Update Report Details</h3>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label><strong>Status</strong></label>
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
                  <label><strong>Treatment Recommendation</strong></label>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                    {selectedPestId && selectedPestId !== 'not_in_library' 
                      ? 'Below is auto-populated from the library. Edit as needed.'
                      : 'Enter your recommendation here.'}
                  </p>
                  <textarea
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder="Add treatment or management recommendations..."
                    rows="6"
                  />
                </div>

                <button type="submit" disabled={updating}>
                  {updating ? '⏳ Updating...' : '💾 Update Report'}
                </button>
              </form>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default ReportDetail;
