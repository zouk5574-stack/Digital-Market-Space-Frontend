// src/components/freelance/DeliveryModal.jsx
import React, { useState } from 'react';
import { filesAPI, freelanceAPI } from '../../services/api'; // ✅ Import direct
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import FileUpload from '../ui/FileUpload';

const DeliveryModal = ({ isOpen, onClose, mission, onDelivery }) => {
  const [formData, setFormData] = useState({
    delivery_note: '',
    file_url: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Pas besoin de product_id pour les missions

      // ✅ CORRECT : utilise filesAPI.upload()
      const response = await filesAPI.upload(formData);
      setUploadedFile(response.data);
      setFormData(prev => ({
        ...prev,
        file_url: response.data.url
      }));
    } catch (error) {
      console.error('Erreur upload fichier:', error);
      alert('Erreur lors du téléchargement du fichier');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadedFile) {
      alert('Veuillez uploader votre travail');
      return;
    }

    setLoading(true);
    try {
      // ✅ CORRECT : utilise freelanceAPI.missions.deliver()
      await freelanceAPI.missions.deliver({
        mission_id: mission.id,
        delivery_note: formData.delivery_note,
        file_url: uploadedFile.url
      });
      
      onDelivery();
      onClose();
      alert('Livraison effectuée avec succès !');
    } catch (error) {
      console.error('Erreur livraison:', error);
      alert('Erreur lors de la livraison');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            🚚 Livrer la mission: {mission.title}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Note de livraison */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note de livraison (obligatoire)
              </label>
              <TextArea
                name="delivery_note"
                value={formData.delivery_note}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Décrivez votre travail, les fonctionnalités implémentées, les instructions d'utilisation..."
                helpText="Cette description aidera l'acheteur à comprendre votre travail"
              />
            </div>

            {/* Upload du fichier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichier de livraison (obligatoire)
              </label>
              <FileUpload
                onFileSelect={handleFileUpload}
                acceptedTypes=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.mp4,.mov,.avi"
                maxSize={50 * 1024 * 1024} // 50MB
                loading={loading}
              />
              
              {uploadedFile && (
                <div className="mt-2 bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-700">
                      Fichier uploadé: {uploadedFile.name}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Informations escrow */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                💰 Fonds sécurisés chez Fedapay
              </h4>
              <p className="text-sm text-blue-700">
                <strong>Montant en attente:</strong> {mission.final_price} XOF<br/>
                Les fonds seront débloqués automatiquement après validation par l'acheteur.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !formData.delivery_note || !uploadedFile}
              >
                {loading ? 'Livraison en cours...' : '🚚 Livrer le travail'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;
