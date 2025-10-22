import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Section 1 : À propos */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Digital Market Space</h3>
          <p className="text-gray-400 text-sm">
            Plateforme innovante pour acheter, vendre et proposer des services digitaux.  
            Simplifiez vos transactions en toute sécurité.
          </p>
        </div>

        {/* Section 2 : Liens rapides */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Liens rapides</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-indigo-400">Accueil</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400">Connexion</Link></li>
            <li><Link to="/register" className="hover:text-indigo-400">Inscription</Link></li>
            <li><Link to="/seller/dashboard" className="hover:text-indigo-400">Espace Vendeur</Link></li>
          </ul>
        </div>

        {/* Section 3 : Réseaux sociaux */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Nous suivre</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-indigo-400"><Facebook /></a>
            <a href="#" className="hover:text-indigo-400"><Twitter /></a>
            <a href="#" className="hover:text-indigo-400"><Instagram /></a>
            <a href="#" className="hover:text-indigo-400"><Linkedin /></a>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="bg-gray-800 py-4 text-center text-sm text-gray-400 border-t border-gray-700">
        © 2025 Digital Market Space. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
