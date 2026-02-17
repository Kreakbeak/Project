import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuthToken } from './api';
import './styles/App.css';

// Import pages
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import SubmitReport from './pages/SubmitReport';
import MyReports from './pages/MyReports';
import AdminReports from './pages/AdminReports';
import ReportDetail from './pages/ReportDetail';
import FarmerReportDetail from './pages/FarmerReportDetail';
import PestDiseaseLibrary from './pages/PestDiseaseLibrary';
import ManagePestsDiseases from './pages/ManagePestsDiseases';
import AgronomistDashboard from './pages/AgronomistDashboard';
import AgronomistReportDetail from './pages/AgronomistReportDetail';

const PrivateRoute = ({ element, requiredRole }) => {
  const token = getAuthToken();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return element;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/farmer/dashboard" element={<PrivateRoute element={<FarmerDashboard />} requiredRole="farmer" />} />
          <Route path="/farmer/submit-report" element={<PrivateRoute element={<SubmitReport />} requiredRole="farmer" />} />
          <Route path="/farmer/my-reports" element={<PrivateRoute element={<MyReports />} requiredRole="farmer" />} />
          <Route path="/farmer/library" element={<PrivateRoute element={<PestDiseaseLibrary />} requiredRole="farmer" />} />
          <Route path="/farmer/report/:id" element={<PrivateRoute element={<FarmerReportDetail />} requiredRole="farmer" />} />
          <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminDashboard />} requiredRole="admin" />} />
          <Route path="/admin/users" element={<PrivateRoute element={<AdminUserManagement />} requiredRole="admin" />} />
          <Route path="/admin/reports" element={<PrivateRoute element={<AdminReports />} requiredRole="admin" />} />
          <Route path="/admin/report/:id" element={<PrivateRoute element={<ReportDetail />} requiredRole="admin" />} />
          <Route path="/admin/pests" element={<PrivateRoute element={<ManagePestsDiseases />} requiredRole="admin" />} />
          <Route path="/agronomist/dashboard" element={<PrivateRoute element={<AgronomistDashboard />} requiredRole="agronomist" />} />
          <Route path="/agronomist/library" element={<PrivateRoute element={<PestDiseaseLibrary />} requiredRole="agronomist" />} />
          <Route path="/agronomist/report/:id" element={<PrivateRoute element={<AgronomistReportDetail />} requiredRole="agronomist" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
