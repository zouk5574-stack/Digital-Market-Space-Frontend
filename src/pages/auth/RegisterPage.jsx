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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900">
            Créer un compte
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="firstname"
                label="Prénom"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
              <Input
                name="lastname"
                label="Nom"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              name="username"
              label="Nom d’utilisateur"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              name="tel"
              label="Téléphone"
              value={formData.tel}
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              label="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" fullWidth variant="primary" disabled={loading}>
              {loading ? 'Création...' : 'S’inscrire'}
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-500">
              Se connecter
            </Link>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RegisterPage;