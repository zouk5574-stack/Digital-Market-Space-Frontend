// src/components/ui/ErrorModal.jsx
import React from 'react';
import Button from './Button';

const ErrorModal = ({ isOpen, onClose, title = 'Erreur', message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-red-700 mb-4">{title}</h2>
        <p className="text-red-800 mb-6">{message}</p>
        <div className="flex justify-end">
          <Button onClick={onClose} variant="secondary">Fermer</Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;