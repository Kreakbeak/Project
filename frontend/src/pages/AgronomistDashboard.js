import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { statsAPI } from '../api';

function AgronomistDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsAPI.getAgronomistStats();
        setStats(response.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCardClick = (filter) => {
    setSelectedFilter(filter);
    setModalOpen(true);
  };

  const getFilteredReports = () => {
    if (!stats?.recentReports) return [];
    if (!selectedFilter) return stats.recentReports;
    return stats.recentReports.filter(r => r.status === selectedFilter);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return { bg: '#fffbeb', text: '#b45309' };
      case 'Identified': return { bg: '#f3f0ff', text: '#7c3aed' };
      case 'Reviewed': return { bg: '#e0f2fe', text: '#0369a1' };
      case 'Resolved': return { bg: '#f0fdf4', text: '#059669' };
      default: return { bg: '#f8fafc', text: '#64748b' };
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Pest & Disease Reporting System - Agronomist</h1>
        <nav>
          <Link to="/agronomist/library">Pest Library</Link>
          <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>
      <div className="container">
        <h2>Welcome to Agronomist Dashboard</h2>

        {error && <div className="error" style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px' }}>{error}</div>}
        {loading && <div className="loading" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading statistics...</div>}

        {stats && (
          <>
            {/* Analytics Cards - Clickable */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2.5rem'
            }}>
              <div 
                className="report-card" 
                style={{ 
                  borderLeft: '4px solid #3b82f6', 
                  backgroundColor: '#eff6ff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => handleCardClick(null)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h4 style={{ color: '#1e40af', margin: '0 0 0.5rem 0' }}>📊 Total Reports</h4>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#0c4a6e' }}>
                  {stats.totalReports}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>Click to view all</p>
              </div>

              <div 
                className="report-card" 
                style={{ 
                  borderLeft: '4px solid #f59e0b', 
                  backgroundColor: '#fffbeb',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => handleCardClick('Pending')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(245, 158, 11, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h4 style={{ color: '#b45309', margin: '0 0 0.5rem 0' }}>⏳ Pending</h4>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#b45309' }}>
                  {stats.pendingReports}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>Click to view</p>
              </div>

              <div 
                className="report-card" 
                style={{ 
                  borderLeft: '4px solid #a855f7', 
                  backgroundColor: '#f3f0ff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => handleCardClick('Identified')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(168, 85, 247, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h4 style={{ color: '#7c3aed', margin: '0 0 0.5rem 0' }}>🔍 Identified</h4>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#7c3aed' }}>
                  {stats.identifiedReports}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>Click to view</p>
              </div>

              <div 
                className="report-card" 
                style={{ 
                  borderLeft: '4px solid #0ea5e9', 
                  backgroundColor: '#e0f2fe',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => handleCardClick('Reviewed')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h4 style={{ color: '#0369a1', margin: '0 0 0.5rem 0' }}>✅ Reviewed</h4>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#0369a1' }}>
                  {stats.reviewedReports}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>Click to view</p>
              </div>

              <div 
                className="report-card" 
                style={{ 
                  borderLeft: '4px solid #10b981', 
                  backgroundColor: '#f0fdf4',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => handleCardClick('Resolved')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h4 style={{ color: '#059669', margin: '0 0 0.5rem 0' }}>🎉 Resolved</h4>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#059669' }}>
                  {stats.resolvedReports}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>Click to view</p>
              </div>

              <div 
                className="report-card" 
                style={{ 
                  borderLeft: '4px solid #06b6d4', 
                  backgroundColor: '#ecfdf5'
                }}
              >
                <h4 style={{ color: '#0891b2', margin: '0 0 0.5rem 0' }}>📈 Resolution Rate</h4>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#0891b2' }}>
                  {stats.resolutionRate}%
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>Reports Resolved</p>
              </div>
            </div>

            {/* Modal for filtered reports */}
            {modalOpen && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '2rem'
              }}>
                <div style={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  padding: '2rem',
                  width: '90%',
                  maxWidth: '1000px',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, color: '#0f172a' }}>
                      {selectedFilter ? `${selectedFilter} Reports` : 'All Reports'}
                    </h3>
                    <button 
                      onClick={() => setModalOpen(false)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Close
                    </button>
                  </div>

                  {getFilteredReports().length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                      No {selectedFilter ? selectedFilter.toLowerCase() : ''} reports found
                    </p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Farmer</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Crop</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Location</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Reported</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredReports().map((report) => {
                            const statusColor = getStatusColor(report.status);
                            return (
                              <tr key={report._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem' }}>{report.farmerId?.name || 'Unknown'}</td>
                                <td style={{ padding: '0.75rem' }}>{report.cropType}</td>
                                <td style={{ padding: '0.75rem' }}>{report.location}</td>
                                <td style={{ padding: '0.75rem' }}>
                                  <span style={{
                                    backgroundColor: statusColor.bg,
                                    color: statusColor.text,
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                  }}>
                                    {report.status}
                                  </span>
                                </td>
                                <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                  <Link to={`/agronomist/report/${report._id}`}>
                                    <button style={{
                                      backgroundColor: '#3b82f6',
                                      color: '#fff',
                                      border: 'none',
                                      padding: '0.5rem 1rem',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '0.9rem',
                                      fontWeight: '600'
                                    }}>
                                      Analyze
                                    </button>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats Cards for crops and recommendations */}
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ color: '#0f172a', marginBottom: '1.5rem' }}>Reports by Crop Type</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                {stats.reportsByCrop && stats.reportsByCrop.length > 0 ? (
                  stats.reportsByCrop.map((crop) => (
                    <div key={crop._id} className="report-card" style={{ backgroundColor: '#f8fafc', border: '1px solid #e5e7eb' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>{crop._id}</h4>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#3b82f6' }}>
                        {crop.count}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748b' }}>No reports by crop</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AgronomistDashboard;
