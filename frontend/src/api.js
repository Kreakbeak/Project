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
    axios.post(`${API_URL}/auth/login`, { email, password }),
  createUserByAdmin: (name, email, password, phone, role, location) =>
    axios.post(`${API_URL}/auth/create-user`, {
      name,
      email,
      password,
      phone,
      role,
      location
    }, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    })
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
    }),
  referPestToReport: (reportId, pestId) =>
    axios.post(`${API_URL}/reports/refer-pest`, 
      { reportId, pestId },
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    )
};

// Stats API
export const statsAPI = {
  getAdminStats: () =>
    axios.get(`${API_URL}/stats/admin`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }),
  getFarmerStats: () =>
    axios.get(`${API_URL}/stats/farmer`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }),
  getAgronomistStats: () =>
    axios.get(`${API_URL}/stats/agronomist`, {
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

// User Management API
export const userAPI = {
  getAllUsers: () =>
    axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }),
  getPendingUsers: () =>
    axios.get(`${API_URL}/users/pending`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }),
  getUserById: (userId) =>
    axios.get(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }),
  approveUser: (userId) =>
    axios.put(`${API_URL}/users/${userId}/approve`, {}, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }),
  rejectUser: (userId) =>
    axios.delete(`${API_URL}/users/${userId}/reject`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }),
  removeUser: (userId) =>
    axios.delete(`${API_URL}/users/${userId}/remove`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }),
  updateUserRole: (userId, role) =>
    axios.put(`${API_URL}/users/${userId}/role`, 
      { role },
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    )
};

export { setAuthToken, getAuthToken };
