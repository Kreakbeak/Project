import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { pestAPI } from '../api';

function PestDiseaseLibrary() {
  const [pests, setPests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPest, setSelectedPest] = useState(null);
  const [filter, setFilter] = useState('Both');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPests();
  }, [filter]);

  const fetchPests = async () => {
    try {
      setLoading(true);
      let response;
      if (filter === 'Both') {
        response = await pestAPI.getAll();
      } else {
        response = await pestAPI.getByCrop(filter);
      }
      setPests(response.data.pests);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pests/diseases');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Pest & Disease Library</h1>
        <nav>
          <Link to="/farmer/dashboard">Dashboard</Link>
          <Link to="/farmer/submit-report">Submit Report</Link>
          <Link to="/farmer/my-reports">My Reports</Link>
          <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>

      <div className="container">
        <h2>Learn About Common Pests & Diseases</h2>
        {error && <div className="alert error">{error}</div>}

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label><strong>Filter by Crop:</strong></label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
          >
            <option value="Both">All Crops</option>
            <option value="Tomato">Tomato</option>
            <option value="Cucumber">Cucumber</option>
          </select>
        </div>

        {loading && <div className="loading">Loading library...</div>}

        {!loading && pests.length === 0 && (
          <div className="alert info">No pests or diseases found for this crop.</div>
        )}

        {!loading && pests.length > 0 && (
          <div>
            {selectedPest ? (
              <div className="report-card">
                <button onClick={() => setSelectedPest(null)} className="secondary" style={{ marginBottom: '1rem' }}>
                  ← Back to List
                </button>
                <h3>{selectedPest.name} ({selectedPest.type})</h3>
                <p><strong>Crop:</strong> {selectedPest.cropType}</p>
                {selectedPest.imagePath && (
                  <img 
                    src={`http://localhost:5000${selectedPest.imagePath}`} 
                    alt={selectedPest.name}
                    style={{ maxWidth: '100%', height: 'auto', margin: '1rem 0', borderRadius: '8px' }}
                  />
                )}
                
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Description</h4>
                  <p>{selectedPest.description}</p>

                  <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Symptoms</h4>
                  <p>{selectedPest.symptoms}</p>

                  <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Treatment</h4>
                  <p>{selectedPest.treatment}</p>

                  {selectedPest.prevention && (
                    <>
                      <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Prevention</h4>
                      <p>{selectedPest.prevention}</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {pests.map(pest => (
                  <div key={pest._id} className="report-card">
                    {pest.imagePath && (
                      <img 
                        src={`http://localhost:5000${pest.imagePath}`} 
                        alt={pest.name}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', marginBottom: '1rem' }}
                      />
                    )}
                    <h3 style={{ marginBottom: '0.5rem' }}>{pest.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                      <strong>{pest.type}</strong> • {pest.cropType}
                    </p>
                    <p>{pest.description.substring(0, 100)}...</p>
                    <button 
                      onClick={() => setSelectedPest(pest)}
                      style={{ marginTop: '1rem', width: '100%' }}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PestDiseaseLibrary;
