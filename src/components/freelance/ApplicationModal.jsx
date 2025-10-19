// src/components/freelance/ApplicationModal.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';

const ApplicationModal = ({ isOpen, onClose, mission, onApply }) => {
  const [formData, setFormData] = useState({
    proposal: '',
    proposed_price: mission.budget || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onApply({
        mission_id: mission.id,
        proposal: formData.proposal,
        proposed_price: parseFloat(formData.proposed_price)
      });
    } catch (error) {
      console.error('Erreur:', error);
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
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Postuler à la mission: {mission.title}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Votre proposition (obligatoire)
              </label>
              <TextArea
                name="proposal"
                value={formData.proposal}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Décrivez votre approche, votre expérience, et pourquoi vous êtes le meilleur choix pour cette mission..."
              />
            </div>

            <Input
              label="Prix proposé (XOF)"
              name="proposed_price"
              type="number"
              value={formData.proposed_price}
              onChange={handleChange}
              required
              min="1"
              max={mission.budget}
              placeholder={`Budget maximum: ${mission.budget} XOF`}
              helpText={`Le budget maximum pour cette mission est de ${mission.budget} XOF`}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-700">
                <strong>Processus de paiement sécurisé:</strong><br/>
                1. Votre candidature est acceptée<br/>
                2. L'acheteur sécurise les fonds chez Fedapay (escrow)<br/>
                3. Vous travaillez en toute confiance<br/>
                4. Livraison et validation<br/>
                5. Paiement automatique débloqué
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
                disabled={loading || !formData.proposal || !formData.proposed_price}
              >
                {loading ? 'Envoi...' : 'Postuler'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
