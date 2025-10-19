import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';

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

  if (loading) return <Loader size="large" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input name="firstname" label="Prénom" value={formData.firstname} onChange={handleChange} required />
          <Input name="lastname" label="Nom" value={formData.lastname} onChange={handleChange} required />
          <Input name="username" label="Nom d’utilisateur" value={formData.username} onChange={handleChange} required />
          <Input name="email" type="email" label="Email" value={formData.email} onChange={handleChange} required />
          <Input name="tel" label="Téléphone" value={formData.tel} onChange={handleChange} required />
          <Input name="password" type="password" label="Mot de passe" value={formData.password} onChange={handleChange} required />
          <Button type="submit" fullWidth variant="primary" disabled={loading}>
            {loading ? 'Création...' : 'S’inscrire'}
          </Button>
        </form>
        <p className="text-sm text-center mt-4">
          Déjà inscrit ? <Link to="/login" className="text-indigo-600 font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
