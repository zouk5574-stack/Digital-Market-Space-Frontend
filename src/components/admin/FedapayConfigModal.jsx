// src/components/admin/FedapayConfigModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const FedapayConfigModal = ({ isOpen, onClose, onSave, currentKeys }) => {
  const [formData, setFormData] = useState({
    public_key: '',
    secret_key: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentKeys) {
      setFormData({
        public_key: currentKeys.public_key || '',
        secret_key: currentKeys.secret_key || ''
      });
    }
  }, [isOpen, currentKeys]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
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
            Configuration Fedapay
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Clé Publique Fedapay"
              name="public_key"
              type="text"
              value={formData.public_key}
              onChange={handleChange}
              required
              placeholder="pk_..."
              helpText="Commence par 'pk_'"
            />
            
            <Input
              label="Clé Secrète Fedapay"
              name="secret_key"
              type="password"
              value={formData.secret_key}
              onChange={handleChange}
              required
              placeholder="sk_..."
              helpText="Commence par 'sk_' - Gardez-la secrète !"
            />
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Ces clés sont critiques pour le fonctionnement des paiements. 
                    Assurez-vous de les obtenir depuis votre dashboard Fedapay.
                  </p>
                </div>
              </div>
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
                disabled={loading}
              >
                {loading ? 'Sauvegarde...' : 'Sauvegarder les Clés'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FedapayConfigModal;
