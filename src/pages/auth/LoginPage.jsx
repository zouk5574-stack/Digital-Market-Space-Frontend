// src/pages/auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    firstname: '',
    lastname: '',
    phone: '',
    adminPassword: ''
  });

  const { login, superAdminLogin, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirection si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) return;
    const result = await login(formData.identifier, formData.password);
    if (result.success) navigate(from, { replace: true });
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!formData.firstname || !formData.lastname || !formData.phone || !formData.adminPassword) return;
    const result = await superAdminLogin(
      formData.firstname,
      formData.lastname,
      formData.phone,
      formData.adminPassword
    );
    if (result.success) navigate('/admin/dashboard', { replace: true });
  };

  const toggleLoginMode = () => {
    setIsAdminLogin(!isAdminLogin);
    setFormData({
      identifier: '',
      password: '',
      firstname: '',
      lastname: '',
      phone: '',
      adminPassword: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8"
        >
          {/* En-tête */}
          <div className="text-center">
            <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900">
              {isAdminLogin ? 'Connexion Administrateur' : 'Connexion'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {isAdminLogin 
                ? 'Accès réservé aux administrateurs' 
                : 'Accédez à votre compte Digital Market Space'
              }
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form
            className="space-y-6"
            onSubmit={isAdminLogin ? handleAdminLogin : handleStandardLogin}
          >
            {!isAdminLogin ? (
              <>
                <Input
                  label="Nom d'utilisateur ou Téléphone"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  required
                  placeholder="Entrez votre username ou numéro de téléphone"
                />
                <Input
                  label="Mot de passe"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Entrez votre mot de passe"
                />
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Prénom"
                    name="firstname"
                    type="text"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    required
                    placeholder="Votre prénom"
                  />
                  <Input
                    label="Nom"
                    name="lastname"
                    type="text"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    required
                    placeholder="Votre nom"
                  />
                </div>
                <Input
                  label="Téléphone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre numéro de téléphone"
                />
                <Input
                  label="Mot de passe administrateur"
                  name="adminPassword"
                  type="password"
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Mot de passe administrateur"
                />
              </>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading
                ? isAdminLogin ? 'Connexion Admin...' : 'Connexion...'
                : isAdminLogin ? 'Connexion Administrateur' : 'Se connecter'}
            </Button>
          </form>

          {/* Liens supplémentaires */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <button
              type="button"
              onClick={toggleLoginMode}
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {isAdminLogin 
                ? '← Retour à la connexion standard' 
                : 'Accès administrateur →'}
            </button>

            {!isAdminLogin && (
              <p className="text-sm text-gray-600">
                Nouveau sur Digital Market Space ?{' '}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Créer un compte
                </Link>
              </p>
            )}
          </div>

          {/* Indicateur de sécurité */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            🔒 Vos données sont sécurisées et cryptées
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;