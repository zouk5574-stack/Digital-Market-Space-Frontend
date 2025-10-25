// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';

// ✅ STYLE GLOBAL - IMPORT PRINCIPAL
import './styles/Global.css';

// ✅ UI globales
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';

// ✅ Pages publiques
import HomePage from './pages/auth/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// ✅ Produits
import ProductList from './components/products/ProductList';

// ✅ Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import BuyerDashboard from './pages/buyer/BuyerDashboard';

// ✅ Paiement
import PaymentCallback from './pages/payment/PaymentCallback';

// 🆕 NOUVELLES FONCTIONNALITÉS
import SecurityPanel from './components/Settings/SecurityPanel';
import FreelanceChatSystem from './components/Chat/FreelanceChatSystem';
import MissionDetails from './pages/freelance/MissionDetails';

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

  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <div className="app">
      {!hideLayout && <Navbar />}
      <main className="main-content">
        {children}
      </main>
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
      <Route path="/products" element={<ProductList />} />

      {/* 🆕 ROUTES MESSAGERIE FREELANCE */}
      <Route
        path="/missions/:id"
        element={
          <PrivateRoute>
            <MissionDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/mission/:missionId"
        element={
          <PrivateRoute>
            <FreelanceChatSystem />
          </PrivateRoute>
        }
      />

      {/* Dashboards avec protection de rôle */}
      <Route
        path="/admin/*"
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminDashboard />
          </RoleProtectedRoute>
        }
      />

      {/* 🆕 SOUS-ROUTES ADMIN POUR SÉCURITÉ */}
      <Route
        path="/admin/security"
        element={
          <RoleProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <SecurityPanel />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/seller/*"
        element={
          <RoleProtectedRoute allowedRoles={['seller', 'freelancer']}>
            <SellerDashboard />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/buyer/*"
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