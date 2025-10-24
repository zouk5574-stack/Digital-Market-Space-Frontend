// src/pages/auth/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 to-white text-center px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* === PARTICULES ANIMÉES === */}
      {showSplash && (
        <div className="absolute inset-0 -z-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-indigo-200 rounded-full opacity-40 w-2 h-2 sm:w-3 sm:h-3"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) 
              }}
              animate={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) 
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 10 + Math.random() * 8,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showSplash ? (
          // === SPLASH SCREEN ===
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            <img
              src="/Friendly E-commerce Logo with Light Grey_20250920_172930_0000.png"
              alt="Digital Market Space Logo"
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 animate-pulse"
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Digital Market Space
            </h1>
          </motion.div>
        ) : (
          // === PAGE PRINCIPALE ===
          <motion.div
            key="homepage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center items-center space-y-8 max-w-2xl mx-auto"
          >
            {/* Titre principal */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Bienvenue sur{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Digital Market Space
                </span>{" "}
                🌐
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-2">
                La marketplace tout-en-un pour les produits digitaux, services freelance 
                et opportunités de collaboration sécurisées.
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0">
              <Link to="/login" className="flex-1 sm:flex-none">
                <Button variant="primary" size="large" fullWidth className="sm:w-48">
                  Se connecter
                </Button>
              </Link>
              <Link to="/register" className="flex-1 sm:flex-none">
                <Button variant="secondary" size="large" fullWidth className="sm:w-48">
                  Créer un compte
                </Button>
              </Link>
            </div>

            {/* Informations supplémentaires */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 text-sm sm:text-base">
              <div className="flex flex-col items-center space-y-2 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                <span className="text-2xl">🛒</span>
                <p className="font-medium text-gray-700">Produits Digitaux</p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                <span className="text-2xl">💼</span>
                <p className="font-medium text-gray-700">Services Freelance</p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                <span className="text-2xl">🔒</span>
                <p className="font-medium text-gray-700">Paiements Sécurisés</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
