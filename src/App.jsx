// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';

// Pages publiques
import HomePage from './pages/auth/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

//Pour plus de style 

import './styles/Innovation.css';
import './styles/Dashboard.css';
import './styles/App.css';

// Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import BuyerDashboard from './pages/buyer/BuyerDashboard';

// UI
import Loader from './components/ui/Loader';

/* ============================
   🔒 Route privée standard
============================ */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();
  if (loading) return <Loader />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/* ============================
   🧩 Route protégée par rôle
============================ */
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuthContext();

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ============================
   🧭 Routes principales
============================ */
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route
      path="/admin/dashboard"
      element={
        <RoleProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <AdminDashboard />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="/seller/dashboard"
      element={
        <RoleProtectedRoute allowedRoles={['seller', 'freelancer']}>
          <SellerDashboard />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="/buyer/dashboard"
      element={
        <RoleProtectedRoute allowedRoles={['buyer']}>
          <BuyerDashboard />
        </RoleProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

/* ============================
   🚀 App principale
============================ */
const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
