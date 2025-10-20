// src/components/ui/DeleteConfirmModal.jsx
import React from 'react';
import Button from './Button';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, message = 'Êtes-vous sûr ?' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button variant="danger" onClick={onConfirm}>Supprimer</Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;