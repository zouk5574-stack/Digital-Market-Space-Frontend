// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';

// ✅ UI globales
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';

// ✅ Pages publiques
import HomePage from './pages/auth/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// ✅ Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import BuyerDashboard from './pages/buyer/BuyerDashboard';

// ✅ Paiement
import PaymentCallback from './pages/payment/PaymentCallback';

// ✅ Styles globaux
import './styles/Innovation.css';
import './styles/Dashboard.css';
import './styles/App.css';

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
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;

  return children;
};

/* ============================
   🎨 Layout global
============================ */
const Layout = ({ children }) => {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/register', '/payment/callback'];

  // ❌ Cache Navbar et Footer sur login/register et callback paiement
  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
};

/* ============================
   🧭 Routes principales
============================ */
const AppRoutes = () => (
  <Layout>
    <Routes>
      {/* Pages publiques */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Dashboards */}
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

      {/* Callback Fedapay */}
      <Route path="/payment/callback" element={<PaymentCallback />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
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