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

  useEffect(() => {
    setRate(currentRate);
  }, [currentRate, isOpen]);

  const handleSave = async () => {
    if (rate < 0 || rate > 100) {
      alert('Le taux doit être compris entre 0 et 100%');
      return;
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres de Commission</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Taux de commission (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            min={0}
            max={100}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommissionSettingsModal;