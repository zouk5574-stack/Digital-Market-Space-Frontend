import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 to-white text-center px-6">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Bienvenue sur Digital Market Space 🌐
      </h1>
      <p className="text-gray-600 max-w-xl mb-8">
        La marketplace tout-en-un pour les produits digitaux, services freelance et opportunités de collaboration.
      </p>
      <div className="flex gap-4">
        <Link to="/login">
          <Button variant="primary" size="large">Se connecter</Button>
        </Link>
        <Link to="/register">
          <Button variant="secondary" size="large">Créer un compte</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
