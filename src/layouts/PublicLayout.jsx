import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🔝 Navbar */}
      <Navbar />

      {/* 🧩 Contenu principal */}
      <main className="flex-grow">
        {children}
      </main>

      {/* 🔚 Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
