import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="global-footer">
      <div className="footer-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">DMS</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Digital-Market-Space
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Plateforme innovante pour acheter, vendre et proposer des services digitaux.  
              Simplifiez vos transactions en toute sécurité avec notre écosystème complet.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-indigo-600 rounded-full flex items-center justify-center transition group">
                <Facebook size={18} className="group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-indigo-600 rounded-full flex items-center justify-center transition group">
                <Twitter size={18} className="group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-indigo-600 rounded-full flex items-center justify-center transition group">
                <Instagram size={18} className="group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-indigo-600 rounded-full flex items-center justify-center transition group">
                <Linkedin size={18} className="group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="footer-section">
            <h4 className="text-lg font-semibold text-white mb-6 relative inline-block">
              Liens rapides
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-indigo-500 rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition flex items-center group">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition"></div>
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-indigo-400 transition flex items-center group">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition"></div>
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/seller/dashboard" className="text-gray-400 hover:text-indigo-400 transition flex items-center group">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition"></div>
                  Espace Vendeur
                </Link>
              </li>
              <li>
                <Link to="/buyer/dashboard" className="text-gray-400 hover:text-indigo-400 transition flex items-center group">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition"></div>
                  Espace Acheteur
                </Link>
              </li>
              <li>
                <Link to="/missions" className="text-gray-400 hover:text-indigo-400 transition flex items-center group">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition"></div>
                  Missions Freelance
                </Link>
              </li>
            </ul>
          </div>

          {/* Liens légaux */}
          <div className="footer-section">
            <h4 className="text-lg font-semibold text-white mb-6 relative inline-block">
              Informations
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-indigo-500 rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition flex items-center group">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition"></div>
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition flex items-center group">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition"></div>
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition flex items-center group">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition"></div>
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition flex items-center group">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition"></div>
                  Centre d'aide
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="text-lg font-semibold text-white mb-6 relative inline-block">
              Contact
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-indigo-500 rounded-full"></div>
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-white" />
                </div>
                <span className="text-gray-400 group-hover:text-indigo-400 transition text-sm">
                  digitalmarketspace488@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-white" />
                </div>
                <span className="text-gray-400 group-hover:text-indigo-400 transition text-sm">
                  +2290140410161
                </span>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin size={14} className="text-white" />
                </div>
                <span className="text-gray-400 group-hover:text-indigo-400 transition text-sm leading-relaxed">
                   Avenue du Digital<br />
                  Made in Bénin ** Valorisons La Tech Et L'innovation Béninoise **
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="footer-bottom border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Digital Market Space. Tous droits réservés.
            </div>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-indigo-400 transition">CGU</a>
              <a href="#" className="hover:text-indigo-400 transition">Confidentialité</a>
              <a href="#" className="hover:text-indigo-400 transition">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
