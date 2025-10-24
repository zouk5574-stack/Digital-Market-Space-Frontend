// src/components/modals/ServiceModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from './ModalBase';
import Button from '../ui/Button';
import { freelanceAPI, filesAPI } from '../../services/api';

const ServiceModal = ({ isOpen, onClose, service }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFiles([]);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert('Veuillez sélectionner au moins un fichier à livrer.');
      return;
    }

    setLoading(true);
    try {
      // Étape 1: Upload des fichiers
      const uploadedFiles = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadResponse = await filesAPI.upload(formData);
        uploadedFiles.push(uploadResponse.data);
      }

      // Étape 2: Livraison de la mission
      const deliveryData = {
        mission_id: service?.id,
        files: uploadedFiles.map(file => file.id),
        message: `Livraison de ${files.length} fichier(s) pour la mission "${service?.mission?.title}"`
      };

      await freelanceAPI.missions.deliver(deliveryData);

      alert('Mission livrée avec succès ✅');
      onClose();
    } catch (err) {
      console.error('Erreur lors de la livraison:', err);
      alert(`Erreur lors de la livraison: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Livrer une mission"
      width="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
          <p className="text-sm text-gray-700">
            Vous livrez le travail pour la mission :
          </p>
          <p className="text-sm font-semibold text-indigo-700 mt-1">
            {service?.mission?.title || 'Mission inconnue'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fichiers de livraison
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              name="deliveryFiles"
              multiple
              accept="image/*,video/*,.pdf,.zip,.doc,.docx,.txt,.rar"
              onChange={handleFileChange}
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="pointer-events-none">
              <div className="text-indigo-600 mb-1">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                Cliquez pour sélectionner des fichiers
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Formats acceptés: images, PDF, ZIP, documents
              </p>
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Fichiers sélectionnés ({files.length}):
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                    {file.name} <span className="text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            type="button"
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || files.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Envoi en cours...
              </div>
            ) : (
              `Livrer (${files.length} fichier${files.length > 1 ? 's' : ''})`
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ServiceModal;
