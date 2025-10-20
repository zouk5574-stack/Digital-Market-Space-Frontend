// src/components/ui/InfoModal.jsx
import React from 'react';
import Button from './Button';

const InfoModal = ({ isOpen, onClose, title = 'Info', message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;