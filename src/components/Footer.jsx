import React from "react";
import { Facebook,Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-24">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-12">
        {/* Logo */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">DigitalMarket</h2>
          <p className="text-gray-400">
            Une marketplace moderne pour les produits digitaux et freelances de qualité.
          </p>
        </div>

        {/* Liens rapides */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Liens rapides</h3>
          <ul className="space-y-2">
            <li><a href="#home" className="hover:text-indigo-400">Accueil</a></li>
            <li><a href="#products" className="hover:text-indigo-400">Produits</a></li>
            <li><a href="#freelancers" className="hover:text-indigo-400">Freelances</a></li>
            <li><a href="#about" className="hover:text-indigo-400">À propos</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2">
            <li><a href="#help" className="hover:text-indigo-400">Centre d’aide</a></li>
            <li><a href="#terms" className="hover:text-indigo-400">Conditions</a></li>
            <li><a href="#privacy" className="hover:text-indigo-400">Confidentialité</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-2">
            <li><a href="mailto:support@digitalmarket.com" className="flex items-center space-x-2 hover:text-indigo-400"><Mail className="w-4 h-4"/> <span>support@digitalmarket.com</span></a></li>
            <li className="flex space-x-4 mt-3">
              <a href="#" className="hover:text-indigo-400"><Facebook /></a>
              <a href="#" className="hover:text-indigo-400"><Twitter /></a>
              <a href="#" className="hover:text-indigo-400"><Instagram /></a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-gray-500 text-sm">
        © 2025 DigitalMarket. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;