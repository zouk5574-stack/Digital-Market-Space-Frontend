// src/components/modals/ModalBase.jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const ModalBase = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = 'max-w-lg',
  closeOnOverlayClick = true 
}) => {
  // Fermer avec la touche "Échap"
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Empêche le scroll du body
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        className={`
          bg-white rounded-xl shadow-2xl w-full ${width} 
          mx-auto transform transition-all duration-300
          animate-in fade-in-0 zoom-in-95
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête du modal */}
        {(title || onClose) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="
                  p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                  rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                "
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Contenu du modal */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalBase;
