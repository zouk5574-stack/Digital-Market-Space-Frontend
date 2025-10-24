// src/pages/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    tel: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) navigate('/login');
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
          className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 sm:p-8"
        >
          {/* En-tête */}
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Créer un compte
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Rejoignez Digital Market Space en quelques secondes
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 space-y-2"
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Prénom et Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="firstname"
                label="Prénom"
                value={formData.firstname}
                onChange={handleChange}
                required
                placeholder="Votre prénom"
              />
              <Input
                name="lastname"
                label="Nom"
                value={formData.lastname}
                onChange={handleChange}
                required
                placeholder="Votre nom"
              />
            </div>

            {/* Nom d'utilisateur */}
            <Input
              name="username"
              label="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choisissez un nom d'utilisateur"
            />

            {/* Email et Téléphone */}
            <div className="space-y-4">
              <Input
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre@email.com"
              />
              <Input
                name="tel"
                label="Téléphone"
                value={formData.tel}
                onChange={handleChange}
                required
                placeholder="Votre numéro de téléphone"
              />
            </div>

            {/* Mot de passe */}
            <Input
              name="password"
              type="password"
              label="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Créez un mot de passe sécurisé"
            />

            {/* Bouton d'inscription */}
            <Button 
              type="submit" 
              fullWidth 
              variant="primary" 
              size="large"
              disabled={loading}
              className="mt-4"
            >
              {loading ? 'Création en cours...' : 'Créer mon compte'}
            </Button>
          </form>

          {/* Lien de connexion */}
          <div className="text-center space-y-4 pt-6 mt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Déjà inscrit ?{' '}
              <Link 
                to="/login" 
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Se connecter
              </Link>
            </p>
            
            {/* Indicateur de sécurité */}
            <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
              <span>🔒</span>
              <span>Inscription 100% sécurisée</span>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RegisterPage;
