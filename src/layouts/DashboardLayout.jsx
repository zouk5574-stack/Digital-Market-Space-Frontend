// 🔧 Version légèrement optimisée
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';

const DashboardLayout = ({ children, menuItems = [] }) => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ✅ Fermer sidebar automatiquement sur mobile après clic
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-md transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-indigo-600">Dashboard</h2>
          <button className="md:hidden" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={handleNavClick}
              className={`block px-6 py-3 transition-all ${
                location.pathname === item.path 
                  ? 'bg-indigo-100 text-indigo-600 border-r-2 border-indigo-600' 
                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
          <button className="md:hidden" onClick={toggleSidebar}>
            <Menu size={28} />
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium flex items-center gap-2">
              <User size={20} /> 
              {user?.name || user?.email || 'Utilisateur'}
            </span>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
