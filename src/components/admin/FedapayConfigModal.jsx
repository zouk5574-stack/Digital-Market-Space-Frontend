// src/components/admin/FedapayConfigModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { fedapayAPI } from '../../services/api'; // ✅ Ajout de l'import API

const FedapayConfigModal = ({ isOpen, onClose, currentKeys }) => {
  const [formData, setFormData] = useState({ public_key: '', secret_key: '' });
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchKeys = async () => {
        try {
          // ✅ Chargement des clés depuis l'API
          const { data } = await fedapayAPI.adminKeys();
          setFormData({
            public_key: data.public_key || '',
            secret_key: data.secret_key || ''
          });
        } catch (err) {
          console.error('Erreur chargement clés Fedapay:', err);
        }
      };
      fetchKeys();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Correction : utilisation directe de l'API
      await fedapayAPI.setKeys(formData);
      onClose();
      // Optionnel : recharger les données parentes
      if (window.location.reload) window.location.reload();
    } catch (error) {
      console.error('Erreur sauvegarde Fedapay:', error);
      alert('Erreur lors de la sauvegarde. Vérifiez vos clés.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all animate-scaleUp">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configuration Fedapay
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="relative">
            <Input
              label="Clé Secrète Fedapay"
              name="secret_key"
              type={showSecret ? "text" : "password"}
              value={formData.secret_key}
              onChange={handleChange}
              required
              placeholder="sk_..."
              helpText="Commence par 'sk_' - Gardez-la secrète !"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-xs text-indigo-600"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? 'Masquer' : 'Afficher'}
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="ml-3 text-sm text-yellow-700">
                Ces clés sont critiques pour le bon fonctionnement des paiements.  
                Assurez-vous de les copier depuis votre dashboard Fedapay.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
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
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FedapayConfigModal;
