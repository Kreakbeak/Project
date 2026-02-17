import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI, authAPI } from '../api';

function AdminUserManagement() {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, pending
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'farmer',
    location: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allResponse = await userAPI.getAllUsers();
      setAllUsers(allResponse.data.users);

      const pendingResponse = await userAPI.getPendingUsers();
      setPendingUsers(pendingResponse.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await userAPI.approveUser(userId);
      setError('');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve user');
    }
  };

  const handleRejectUser = async (userId) => {
    if (window.confirm('Are you sure you want to reject this user?')) {
      try {
        await userAPI.rejectUser(userId);
        setError('');
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to reject user');
      }
    }
  };

  const handleRemoveUser = async (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        await userAPI.removeUser(userId);
        setError('');
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to remove user');
      }
    }
  };

  const handlePromoteUser = async (userId, newRole) => {
    try {
      await userAPI.updateUserRole(userId, newRole);
      setError('');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData({ ...createFormData, [name]: value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    if (!createFormData.name || !createFormData.email || !createFormData.password || !createFormData.phone || !createFormData.role) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await authAPI.createUserByAdmin(
        createFormData.name,
        createFormData.email,
        createFormData.password,
        createFormData.phone,
        createFormData.role,
        createFormData.location
      );
      
      // Clear form and close
      setCreateFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'farmer',
        location: ''
      });
      setShowCreateForm(false);
      
      // Refresh users list
      await fetchUsers();
      alert('User created successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create user';
      setError(errorMsg);
      console.error('Create user error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return { bg: '#fee2e2', text: '#991b1b' };
      case 'agronomist':
        return { bg: '#f0fdf4', text: '#065f46' };
      case 'farmer':
        return { bg: '#e0f2fe', text: '#0c4a6e' };
      default:
        return { bg: '#f8fafc', text: '#475569' };
    }
  };

  const displayUsers = activeTab === 'pending' ? pendingUsers : allUsers;

  return (
    <div>
      <nav className="navbar">
        <h1>Pest & Disease Reporting System - Admin</h1>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/reports">View Reports</Link>
          <Link to="/admin/pests">Manage Library</Link>
          <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
        </nav>
      </nav>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>User Management</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              backgroundColor: '#16a34a',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {showCreateForm ? 'Cancel' : '➕ Create New User'}
          </button>
        </div>

        {error && <div className="alert error" style={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontWeight: '600', border: '2px solid #fca5a5' }}>{error}</div>}

        {/* Create Form */}
        {showCreateForm && (
          <div className="report-card" style={{ marginBottom: '2rem', backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0' }}>
            <h3 style={{ color: '#16a34a', marginTop: 0 }}>➕ Create New User</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>Fill in all required fields to create a new user account</p>
            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Full Name <span style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={createFormData.name}
                    onChange={handleCreateChange}
                    placeholder="e.g., John Doe"
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Email <span style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={createFormData.email}
                    onChange={handleCreateChange}
                    placeholder="e.g., user@example.com"
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Password (Min 6 chars) <span style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    type="password"
                    name="password"
                    value={createFormData.password}
                    onChange={handleCreateChange}
                    placeholder="Enter a strong password"
                    required
                    minLength="6"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Phone <span style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={createFormData.phone}
                    onChange={handleCreateChange}
                    placeholder="e.g., 9876543210"
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Role <span style={{ color: '#dc2626' }}>*</span></label>
                  <select name="role" value={createFormData.role} onChange={handleCreateChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.95rem', cursor: 'pointer' }}>
                    <option value="farmer">Farmer</option>
                    <option value="agronomist">Agronomist</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={createFormData.location}
                    onChange={handleCreateChange}
                    placeholder="e.g., New Delhi, India"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>
              <button type="submit" style={{ width: '100%', backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}>
                ✓ Create User
              </button>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === 'all' ? '#16a34a' : 'transparent',
              color: activeTab === 'all' ? '#fff' : '#0f172a',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              borderBottom: activeTab === 'all' ? '3px solid #16a34a' : 'none'
            }}
          >
            All Users ({allUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === 'pending' ? '#f59e0b' : 'transparent',
              color: activeTab === 'pending' ? '#fff' : '#0f172a',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              borderBottom: activeTab === 'pending' ? '3px solid #f59e0b' : 'none'
            }}
          >
            Pending Approval ({pendingUsers.length})
          </button>
        </div>

        {loading && <div className="loading" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading users...</div>}

        {/* Users Table */}
        {!loading && displayUsers.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Location</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Registered</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayUsers.map((user) => {
                  const roleColor = getRoleColor(user.role);
                  return (
                    <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem' }}>{user.name}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{user.phone || '-'}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{user.location || '-'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ backgroundColor: roleColor.bg, color: roleColor.text, padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ backgroundColor: user.approved ? '#f0fdf4' : '#fef3c7', color: user.approved ? '#065f46' : '#92400e', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
                          {user.approved ? '✓ Approved' : '⏳ Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                          {!user.approved && (
                            <>
                              <button
                                onClick={() => handleApproveUser(user._id)}
                                style={{
                                  backgroundColor: '#10b981',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '0.5rem 0.75rem',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: '600'
                                }}
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleRejectUser(user._id)}
                                style={{
                                  backgroundColor: '#ef4444',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '0.5rem 0.75rem',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: '600'
                                }}
                              >
                                ✗ Reject
                              </button>
                            </>
                          )}
                          {user.role !== 'admin' && (
                            <select
                              value={user.role}
                              onChange={(e) => handlePromoteUser(user._id, e.target.value)}
                              style={{
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e1',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                              }}
                            >
                              <option value={user.role}>Change Role</option>
                              <option value="farmer">Farmer</option>
                              <option value="agronomist">Agronomist</option>
                            </select>
                          )}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleRemoveUser(user._id)}
                              style={{
                                backgroundColor: '#ea580c',
                                color: '#fff',
                                border: 'none',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                              }}
                            >
                              🗑️ Remove
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && displayUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            <p>No {activeTab === 'pending' ? 'pending' : ''} users found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUserManagement;
