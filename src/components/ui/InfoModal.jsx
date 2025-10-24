// src/components/ui/InfoModal.jsx
import React from 'react';
import { CheckCircle, Info, X } from 'lucide-react';
import Button from './Button';

const InfoModal = ({ 
  isOpen, 
  onClose, 
  title = 'Information', 
  message,
  type = 'info',
  showCloseButton = true
}) => {
  if (!isOpen) return null;

  const icons = {
    info: <Info className="w-6 h-6 text-blue-500" />,
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    warning: <Info className="w-6 h-6 text-yellow-500" />
  };

  const backgrounds = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md border ${backgrounds[type]}`}>
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {icons[type]}
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <Button 
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Compris
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
