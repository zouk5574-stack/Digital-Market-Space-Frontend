import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          DigitalMarket
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">
            Accueil
          </Link>
          <Link to="/seller/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">
            Vendre
          </Link>
          <Link to="/buyer/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">
            Acheter
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-gray-600">👋 {user?.name || 'Utilisateur'}</span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
              >
                Inscription
              </Link>
            </>
          )}
        </div>

        {/* Bouton mobile */}
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
          <div className="px-4 py-3 space-y-3">
            <Link to="/" onClick={toggleMenu} className="block text-gray-700 hover:text-indigo-600">
              Accueil
            </Link>
            <Link to="/seller/dashboard" onClick={toggleMenu} className="block text-gray-700 hover:text-indigo-600">
              Vendre
            </Link>
            <Link to="/buyer/dashboard" onClick={toggleMenu} className="block text-gray-700 hover:text-indigo-600">
              Acheter
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="w-full text-left bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Déconnexion
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="block text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
