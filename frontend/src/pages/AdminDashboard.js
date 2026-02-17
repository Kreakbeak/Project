import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { statsAPI } from '../api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsAPI.getAdminStats();
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
        <h1>Pest & Disease Reporting System - Admin</h1>
        <nav>
          <Link to="/admin/reports">View Reports</Link>
          <Link to="/admin/users">Manage Users</Link>
          <Link to="/admin/pests">Manage Library</Link>
          <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>
      <div className="container">
        <h2>Welcome to Admin Dashboard</h2>
        
        {error && <div className="error" style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px' }}>{error}</div>}
        {loading && <div className="loading" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading statistics...</div>}

        {stats && (
          <>
            {/* Analytics Cards - Clickable */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                <h4 style={{ color: '#92400e', margin: '0 0 0.5rem 0' }}>⏳ Pending</h4>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#b45309' }}>
                  {stats.pendingReports}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>Click to view</p>
              </div>

              <div 
                className="report-card" 
                style={{ 
                  borderLeft: '4px solid #8b5cf6', 
                  backgroundColor: '#f3f0ff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => handleCardClick('Identified')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h4 style={{ color: '#6d28d9', margin: '0 0 0.5rem 0' }}>🔍 Identified</h4>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#4f46e5' }}>
                  {stats.identifiedReports}
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
                <h4 style={{ color: '#15803d', margin: '0 0 0.5rem 0' }}>✅ Resolved</h4>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#047857' }}>
                  {stats.resolvedReports}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>Click to view</p>
              </div>

              <div 
                className="report-card" 
                style={{ 
                  borderLeft: '4px solid #ec4899', 
                  backgroundColor: '#fdf2f8',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => navigate('/admin/reports')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(236, 72, 153, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h4 style={{ color: '#ad1457', margin: '0 0 0.5rem 0' }}>📈 Resolution Rate</h4>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#be185d' }}>
                  {stats.resolutionRate}%
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0 0 0' }}>Full report view</p>
              </div>
            </div>

            {/* Modal for Report Details */}
            {modalOpen && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '2rem',
                  maxWidth: '800px',
                  width: '90%',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>
                      {selectedFilter ? `${selectedFilter} Reports` : 'All Reports'}
                    </h2>
                    <button 
                      onClick={() => setModalOpen(false)}
                      style={{
                        backgroundColor: '#ef4444',
                        border: 'none',
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        lineHeight: '1'
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Farmer</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Crop</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredReports().map((report, idx) => {
                          const statusColor = getStatusColor(report.status);
                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '0.75rem' }}>{report.farmerId?.name || 'Unknown'}</td>
                              <td style={{ padding: '0.75rem' }}>{report.cropType}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '0.25rem 0.75rem',
                                  backgroundColor: statusColor.bg,
                                  color: statusColor.text,
                                  borderRadius: '12px',
                                  fontSize: '0.85rem',
                                  fontWeight: '600'
                                }}>
                                  {report.status}
                                </span>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                {new Date(report.createdAt).toLocaleDateString()}
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <button 
                                  onClick={() => navigate(`/admin/report/${report._id}`)}
                                  style={{
                                    padding: '0.4rem 0.8rem',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                  }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {getFilteredReports().length === 0 && (
                    <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '1rem' }}>
                      No {selectedFilter ? selectedFilter.toLowerCase() : ''} reports found.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Reports by Crop */}
            {stats.reportsByCrop && stats.reportsByCrop.length > 0 && (
              <div className="report-card" style={{ marginBottom: '2rem' }}>
                <h3>🌾 Reports by Crop Type</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  {stats.reportsByCrop.map((crop, idx) => (
                    <div key={idx} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <p style={{ margin: 0, fontWeight: '600', color: '#16a34a' }}>{crop._id}</p>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>{crop.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Most Common Pests */}
            {stats.mostCommonPests && stats.mostCommonPests.length > 0 && (
              <div className="report-card" style={{ marginBottom: '2rem' }}>
                <h3>🐛 Most Common Pests/Diseases</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  {stats.mostCommonPests.map((pest, idx) => (
                    <div key={idx} style={{ padding: '1rem', backgroundColor: '#fff0f9', borderRadius: '6px', border: '1px solid #fbcfe8' }}>
                      <p style={{ margin: 0, fontWeight: '600', color: '#be185d' }}>
                        {pest.pest[0]?.name || 'Unknown'}
                      </p>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.3rem', fontWeight: '700', color: '#ec4899' }}>
                        {pest.count} reports
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Actions */}
        <div style={{ marginTop: '2rem' }}>
          <h3>Quick Actions</h3>
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="report-card">
              <h3>📋 Manage Reports</h3>
              <p>View all farmer reports, identify pests/diseases, and provide treatment recommendations.</p>
              <Link to="/admin/reports"><button style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>View All Reports</button></Link>
            </div>
            <div className="report-card">
              <h3>📚 Manage Pest & Disease Library</h3>
              <p>Add, edit, and manage pest and disease information that farmers can reference and learn from.</p>
              <Link to="/admin/pests"><button style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Manage Library</button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

