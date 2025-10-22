import React, { useState } from "react";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-indigo-600">
          Digital<span className="text-gray-800">Market</span>
        </div>

        {/* Barre de recherche */}
        <div className="hidden md:flex flex-1 mx-8">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Rechercher un produit ou un freelance..."
              className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#products" className="hover:text-indigo-600 font-medium">Produits</a>
          <a href="#freelancers" className="hover:text-indigo-600 font-medium">Freelances</a>

          {/* Panier */}
          <button className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-indigo-600" />
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full px-1.5">2</span>
          </button>

          {/* Menu utilisateur */}
          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full hover:bg-indigo-50 transition"
            >
              <User className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-gray-700">Youssef</span>
            </button>
            {userMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <a href="#profile" className="block px-4 py-2 hover:bg-gray-100">Mon profil</a>
                <a href="#orders" className="block px-4 py-2 hover:bg-gray-100">Mes commandes</a>
                <a href="#settings" className="block px-4 py-2 hover:bg-gray-100">Paramètres</a>
                <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Déconnexion</button>
              </div>
            )}
          </div>
        </div>

        {/* Menu mobile */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md py-4">
          <div className="flex flex-col items-center space-y-4">
            {/* Barre de recherche */}
            <div className="relative w-11/12">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>

            {/* Liens */}
            <a href="#products" className="hover:text-indigo-600 font-medium">Produits</a>
            <a href="#freelancers" className="hover:text-indigo-600 font-medium">Freelances</a>
            <a href="#about" className="hover:text-indigo-600 font-medium">À propos</a>
            <a href="#contact" className="hover:text-indigo-600 font-medium">Contact</a>

            {/* Boutons */}
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition">
                Connexion
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Inscription
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;