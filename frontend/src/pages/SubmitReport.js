import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { reportAPI } from '../api';

function SubmitReport() {
  const [formData, setFormData] = useState({
    cropType: 'Tomato',
    description: '',
    location: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
    
    if (!image) {
      setMessage('Please select an image');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await reportAPI.createReport(
        formData.cropType,
        formData.description,
        formData.location,
        image
      );
      setMessage('Report submitted successfully!');
      setTimeout(() => {
        navigate('/farmer/my-reports');
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Pest & Disease Reporting System</h1>
        <nav>
          <Link to="/farmer/dashboard">Dashboard</Link>
          <Link to="/farmer/my-reports">My Reports</Link>
          <span onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>
      <div className="container">
        <div className="form-container" style={{ maxWidth: '600px' }}>
          <h2>Submit Pest/Disease Report</h2>
          {message && (
            <div className={message.includes('success') ? 'success' : 'error'}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Crop Type</label>
              <select name="cropType" value={formData.cropType} onChange={handleChange}>
                <option value="Tomato">Tomato</option>
                <option value="Cucumber">Cucumber</option>
              </select>
            </div>

            <div className="form-group">
              <label>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {preview && (
                <img src={preview} alt="Preview" className="report-image" style={{ maxHeight: '300px', marginTop: '1rem' }} />
              )}
            </div>

            <div className="form-group">
              <label>Description of Problem</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the pest/disease symptoms..."
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State or Farm Location"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SubmitReport;
