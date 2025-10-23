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
    }, 2800); // ⏱️ Durée d’affichage du splash
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 to-white text-center px-6 overflow-hidden relative">
      {/* === PARTICULES ANIMÉES === */}
      {showSplash && (
        <div className="absolute inset-0 -z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-indigo-200 rounded-full opacity-50 w-3 h-3"
              initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
              animate={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 8 + Math.random() * 5,
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
            className="flex flex-col items-center justify-center"
          >
            <img
              src="/Friendly E-commerce Logo with Light Grey_20250920_172930_0000.png"
              alt="Digital Market Space Logo"
              className="w-32 h-32 mb-4 animate-pulse"
            />
            <h1 className="text-2xl font-bold text-gray-700">
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
            className="flex flex-col justify-center items-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
              Bienvenue sur Digital Market Space 🌐
            </h1>
            <p className="text-gray-600 max-w-xl mb-8 px-4 sm:px-0">
              La marketplace tout-en-un pour les produits digitaux, services freelance et opportunités de collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button variant="primary" size="large">
                  Se connecter
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="large">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
