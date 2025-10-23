// src/components/freelance/DeliveryDownload.jsx
import React, { useState } from 'react';
import { useFilesApi, useFreelanceApi } from '../../hooks/useApi';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

const DeliveryDownload = ({ mission, delivery }) => {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  
  const { actions: filesActions } = useFilesApi();
  const { actions: freelanceActions } = useFreelanceApi();

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Récupérer l'URL signée pour le fichier de livraison
      const signedUrl = await filesActions.getSignedUrl(delivery.file_id);
      setDownloadUrl(signedUrl.url);
      
      // Ouvrir le téléchargement
      window.open(signedUrl.url, '_blank');
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      alert('Erreur lors du téléchargement');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateDelivery = async () => {
    if (!confirm('Confirmez-vous la réception et la validation du travail ? Les fonds seront alors transférés au vendeur.')) {
      return;
    }

    setLoading(true);
    try {
      await freelanceActions.validateDelivery(delivery.id);
      alert('Livraison validée ! Les fonds ont été transférés au vendeur.');
      // Recharger les données de la mission
      window.location.reload();
    } catch (error) {
      console.error('Erreur validation:', error);
      alert('Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        📦 Livraison reçue
      </h3>

      <div className="space-y-4">
        {/* Note de livraison */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Note du vendeur:</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded">
            {delivery.delivery_note}
          </p>
        </div>

        {/* Fichier de livraison */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Fichier livré:</h4>
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-blue-700">
                Fichier livré le {new Date(delivery.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <Button
              variant="secondary"
              size="small"
              onClick={handleDownload}
              disabled={loading}
            >
              {loading ? <Loader size="small" /> : '📥 Télécharger'}
            </Button>
          </div>
        </div>

        {/* Actions de validation */}
        {mission.status === 'awaiting_validation' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h4 className="font-medium text-yellow-800 mb-2">
              ⏳ En attente de votre validation
            </h4>
            <p className="text-sm text-yellow-700 mb-3">
              <strong>Fonds en attente:</strong> {mission.final_price} XOF<br/>
              Téléchargez et vérifiez le travail puis valider la réception car 🚨 la confirmation automatique pour intervenir en cas de votre oublie.
            </p>
            
            <Button
              variant="primary"
              onClick={handleValidateDelivery}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Validation...' : '✅ Valider la livraison et débloquer les fonds'}
            </Button>
          </div>
        )}

        {mission.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-green-700">
                Mission terminée - Les fonds ont été transférés au vendeur
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDownload;
