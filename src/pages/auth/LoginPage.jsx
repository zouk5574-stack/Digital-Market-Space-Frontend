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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-6 sm:p-8"
        >
          {/* En-tête */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isAdminLogin ? 'Connexion Administrateur' : 'Connexion'}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {isAdminLogin 
                ? 'Accès réservé aux administrateurs' 
                : 'Accédez à votre compte Digital Market Space'
              }
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-start space-x-3">
                <svg className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Formulaire */}
          <form
            className="space-y-6"
            onSubmit={isAdminLogin ? handleAdminLogin : handleStandardLogin}
          >
            {!isAdminLogin ? (
              <div className="space-y-5">
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
              </div>
            ) : (
              <div className="space-y-5">
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
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={loading}
              className="mt-2"
            >
              {loading
                ? isAdminLogin ? 'Connexion Admin...' : 'Connexion...'
                : isAdminLogin ? 'Connexion Administrateur' : 'Se connecter'}
            </Button>
          </form>

          {/* Liens supplémentaires */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={toggleLoginMode}
              className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors py-2"
            >
              {isAdminLogin 
                ? '← Retour à la connexion standard' 
                : 'Accès administrateur →'}
            </button>

            {!isAdminLogin && (
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Nouveau sur Digital Market Space ?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Indicateur de sécurité */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
              <span>🔒</span>
              <span>Vos données sont sécurisées et cryptées</span>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
