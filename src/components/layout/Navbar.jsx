import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { Menu, X, ShoppingCart, Bell, User } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Effet pour détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => `
    font-medium transition-all duration-300 relative
    ${isActiveRoute(path) 
      ? 'text-indigo-600 font-semibold' 
      : 'text-gray-700 hover:text-indigo-600'
    }
    after:content-[''] after:absolute after:bottom-0 after:left-0 
    after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-300
    hover:after:w-full
    ${isActiveRoute(path) ? 'after:w-full' : ''}
  `;

  return (
    <header className={`global-header ${scrolled ? 'shadow-lg py-2' : 'shadow-md py-3'}`}>
      <div className="header-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={() => setMenuOpen(false)}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DMS</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DigitalMarketSpace
            </span>
          </Link>

          {/* Menu desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className={navLinkClass('/')}>
              Accueil
            </Link>
            <Link to="/products" className={navLinkClass('/products')}>
              Produits
            </Link>
            <Link to="/seller/dashboard" className={navLinkClass('/seller/dashboard')}>
              Vendre
            </Link>
            <Link to="/buyer/dashboard" className={navLinkClass('/buyer/dashboard')}>
              Acheter
            </Link>
            <Link to="/missions" className={navLinkClass('/missions')}>
              Missions
            </Link>
          </div>

          {/* Actions utilisateur desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition">
                  <Bell size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition">
                  <ShoppingCart size={20} />
                </button>
                <div className="flex items-center space-x-3 ml-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-indigo-600" />
                  </div>
                  <span className="text-gray-700 font-medium max-w-32 truncate">
                    {user?.name || 'Utilisateur'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-medium transition"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Bouton mobile */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            onClick={toggleMenu}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 mt-3 py-4 shadow-inner">
            <div className="space-y-4">
              {/* Navigation mobile */}
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/" 
                  onClick={toggleMenu}
                  className={`p-3 rounded-lg text-center transition ${isActiveRoute('/') ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-700 hover:bg-indigo-50'}`}
                >
                  Accueil
                </Link>
                <Link 
                  to="/products" 
                  onClick={toggleMenu}
                  className={`p-3 rounded-lg text-center transition ${isActiveRoute('/products') ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-700 hover:bg-indigo-50'}`}
                >
                  Produits
                </Link>
                <Link 
                  to="/seller/dashboard" 
                  onClick={toggleMenu}
                  className={`p-3 rounded-lg text-center transition ${isActiveRoute('/seller/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-700 hover:bg-indigo-50'}`}
                >
                  Vendre
                </Link>
                <Link 
                  to="/buyer/dashboard" 
                  onClick={toggleMenu}
                  className={`p-3 rounded-lg text-center transition ${isActiveRoute('/buyer/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-700 hover:bg-indigo-50'}`}
                >
                  Acheter
                </Link>
              </div>

              {/* Actions utilisateur mobile */}
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User size={16} className="text-indigo-600" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {user?.name || 'Utilisateur'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition">
                          <Bell size={18} />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition">
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="btn btn-primary w-full"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className="text-indigo-600 border border-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition text-center font-medium"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      onClick={toggleMenu}
                      className="btn btn-primary"
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
