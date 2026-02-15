import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { pestAPI } from '../api';

function ManagePestsDiseases() {
  const [pests, setPests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPest, setEditingPest] = useState(null);
  const [preview, setPreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'Pest',
    cropType: 'Tomato',
    description: '',
    symptoms: '',
    treatment: '',
    prevention: ''
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPests();
  }, []);

  const fetchPests = async () => {
    try {
      setLoading(true);
      const response = await pestAPI.getAll();
      setPests(response.data.pests);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pests/diseases');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingPest && !image) {
      setError('Image is required for new pest/disease');
      return;
    }

    try {
      const { name, type, cropType, description, symptoms, treatment, prevention } = formData;
      
      if (editingPest) {
        await pestAPI.update(editingPest._id, name, type, cropType, description, symptoms, treatment, prevention, image);
      } else {
        await pestAPI.create(name, type, cropType, description, symptoms, treatment, prevention, image);
      }

      fetchPests();
      setShowForm(false);
      setEditingPest(null);
      setFormData({ name: '', type: 'Pest', cropType: 'Tomato', description: '', symptoms: '', treatment: '', prevention: '' });
      setImage(null);
      setPreview('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save pest/disease');
    }
  };

  const handleEdit = (pest) => {
    setEditingPest(pest);
    setFormData({
      name: pest.name,
      type: pest.type,
      cropType: pest.cropType,
      description: pest.description,
      symptoms: pest.symptoms,
      treatment: pest.treatment,
      prevention: pest.prevention
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pest/disease?')) {
      try {
        await pestAPI.delete(id);
        setPests(pests.filter(p => p._id !== id));
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPest(null);
    setFormData({ name: '', type: 'Pest', cropType: 'Tomato', description: '', symptoms: '', treatment: '', prevention: '' });
    setImage(null);
    setPreview('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Manage Pest & Disease Library</h1>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/reports">Reports</Link>
          <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Pest & Disease Library</h2>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add New'}
          </button>
        </div>

        {error && <div className="alert error">{error}</div>}

        {showForm && (
          <div className="form-container">
            <h3>{editingPest ? 'Edit' : 'Add New'} Pest/Disease</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} required>
                    <option value="Pest">Pest</option>
                    <option value="Disease">Disease</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Crop Type</label>
                  <select name="cropType" value={formData.cropType} onChange={handleChange} required>
                    <option value="Tomato">Tomato</option>
                    <option value="Cucumber">Cucumber</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Symptoms</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Treatment</label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Prevention</label>
                <textarea
                  name="prevention"
                  value={formData.prevention}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingPest}
                />
                {preview && (
                  <img src={preview} alt="Preview" style={{ maxWidth: '200px', marginTop: '1rem', borderRadius: '6px' }} />
                )}
              </div>

              <div className="btn-group">
                <button type="submit">{editingPest ? 'Update' : 'Create'}</button>
                <button type="button" className="secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading && <div className="loading">Loading library...</div>}

        {!loading && pests.length === 0 && (
          <div className="alert info">No pests or diseases in library. Create one to get started.</div>
        )}

        {!loading && pests.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Crop</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pests.map(pest => (
                  <tr key={pest._id}>
                    <td><strong>{pest.name}</strong></td>
                    <td>{pest.type}</td>
                    <td>{pest.cropType}</td>
                    <td>{pest.description.substring(0, 50)}...</td>
                    <td>
                      <div className="btn-group" style={{ gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEdit(pest)}
                          className="secondary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(pest._id)}
                          className="danger"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          Delete
                        </button>
                      </div>
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

export default ManagePestsDiseases;
