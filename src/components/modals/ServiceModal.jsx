// src/components/modals/ServiceModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from './ModalBase';
import Button from '../ui/Button';
import { useFreelanceApi } from '../../hooks/useApi';

const ServiceModal = ({ isOpen, onClose, service }) => {
  const { actions: freelanceActions } = useFreelanceApi();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFiles([]);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // on récupère plusieurs fichiers
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert('Veuillez sélectionner au moins un fichier à livrer.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      await freelanceActions.deliverWork(service?.id, formData);

      alert('Mission livrée avec succès ✅');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de la livraison.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Livrer une mission"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          Vous livrez le travail pour la mission :{' '}
          <strong>{service?.mission?.title || 'Mission inconnue'}</strong>
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fichiers de livraison
          </label>
          <input
            type="file"
            name="deliveryFiles"
            multiple
            accept="image/*,video/*,.pdf,.zip,.doc,.docx,.txt,.rar"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
          {files.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              {files.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Envoi...' : 'Livrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ServiceModal;