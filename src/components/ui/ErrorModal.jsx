// src/components/ui/ErrorModal.jsx
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import Button from './Button';

const ErrorModal = ({ 
  isOpen, 
  onClose, 
  title = 'Erreur', 
  message,
  details,
  showCloseButton = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-red-200">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-red-100 bg-red-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold text-red-900">{title}</h2>
          </div>
          
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-red-800 leading-relaxed">{message}</p>
          {details && (
            <details className="mt-3">
              <summary className="text-sm text-red-600 cursor-pointer hover:text-red-700">
                Détails techniques
              </summary>
              <pre className="mt-2 p-3 bg-red-50 rounded-lg text-xs text-red-700 overflow-auto">
                {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
              </pre>
            </details>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end p-6 border-t border-red-100 bg-red-50 rounded-b-2xl">
          <Button 
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
