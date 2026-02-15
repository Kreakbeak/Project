import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Auth API
export const authAPI = {
  register: (name, email, password, phone, role, location) =>
    axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      phone,
      role,
      location
    }),
  login: (email, password) =>
    axios.post(`${API_URL}/auth/login`, { email, password })
};

// Report API
export const reportAPI = {
  createReport: (cropType, description, location, imageFile) => {
    const formData = new FormData();
    formData.append('cropType', cropType);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('image', imageFile);
    
    return axios.post(`${API_URL}/reports`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
  },
  getMyReports: () =>
    axios.get(`${API_URL}/reports/my-reports`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }),
  getAllReports: () =>
    axios.get(`${API_URL}/reports`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }),
  getReportById: (id) =>
    axios.get(`${API_URL}/reports/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }),
  updateReportStatus: (id, status, treatment) =>
    axios.put(`${API_URL}/reports/${id}`, 
      { status, treatment },
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    ),
  deleteReport: (id) =>
    axios.delete(`${API_URL}/reports/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    })
};

// Pest/Disease API
export const pestAPI = {
  getAll: () =>
    axios.get(`${API_URL}/pests`),
  getByCrop: (cropType) =>
    axios.get(`${API_URL}/pests/crop/${cropType}`),
  getById: (id) =>
    axios.get(`${API_URL}/pests/${id}`),
  create: (name, type, cropType, description, symptoms, treatment, prevention, imageFile) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('cropType', cropType);
    formData.append('description', description);
    formData.append('symptoms', symptoms);
    formData.append('treatment', treatment);
    formData.append('prevention', prevention);
    formData.append('image', imageFile);
    
    return axios.post(`${API_URL}/pests`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
  },
  update: (id, name, type, cropType, description, symptoms, treatment, prevention, imageFile) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('cropType', cropType);
    formData.append('description', description);
    formData.append('symptoms', symptoms);
    formData.append('treatment', treatment);
    formData.append('prevention', prevention);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    return axios.put(`${API_URL}/pests/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
  },
  delete: (id) =>
    axios.delete(`${API_URL}/pests/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    })
};

export { setAuthToken, getAuthToken };
