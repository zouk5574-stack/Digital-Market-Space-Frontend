import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

/**
 * CommissionSettingsModal
 * @param {boolean} isOpen - Si le modal est ouvert
 * @param {function} onClose - Fonction pour fermer le modal
 * @param {number} currentRate - Taux de commission actuel (en %)
 * @param {function} onSave - Callback pour sauvegarder le nouveau taux
 */
const CommissionSettingsModal = ({ isOpen, onClose, currentRate = 10, onSave }) => {
  const [rate, setRate] = useState(currentRate);
  const [saving, setSaving] = useState(false);

  // Synchronise le taux et gère la fermeture via Échap
  useEffect(() => {
    setRate(currentRate);
  }, [currentRate, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKey = (e) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', handleKey);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKey);
      };
    }
  }, [isOpen, onClose]);

  const handleSave = async () => {
    if (rate < 0 || rate > 100) return;
    setSaving(true);
    try {
      await onSave(rate);
      onClose();
    } catch (error) {
      console.error('Erreur sauvegarde commission:', error);
      alert('Impossible de sauvegarder la commission.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all animate-slideUp">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres de Commission</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Taux de commission (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              rate < 0 || rate > 100
                ? 'border-red-400 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            min={0}
            max={100}
          />
          {rate < 0 || rate > 100 ? (
            <p className="text-red-500 text-xs mt-1">
              Le taux doit être compris entre 0 et 100%.
            </p>
          ) : null}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving || rate < 0 || rate > 100}>
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommissionSettingsModal;