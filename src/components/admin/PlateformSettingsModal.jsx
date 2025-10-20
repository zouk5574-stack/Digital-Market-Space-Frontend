// src/components/admin/PlatformSettingsModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { adminAPI } from '../../services/api';

const PlatformSettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({ platformName: '', currency: 'XOF', defaultCommission: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSettings = async () => {
      try {
        const { data } = await adminAPI.stats.getDashboard();
        setSettings({
          platformName: data.platformName || '',
          currency: data.currency || 'XOF',
          defaultCommission: data.commissionRate || 10
        });
      } catch (err) {
        console.error('Erreur récupération settings:', err);
      }
    };
    fetchSettings();
  }, [isOpen]);

  const handleChange = (e) => setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      await adminAPI.commission.updateSettings({ rate: settings.defaultCommission });
      // Ajouter d'autres champs si nécessaire
      onClose();
    } catch (err) {
      console.error('Erreur sauvegarde settings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Paramètres Plateforme</h2>
        <div className="space-y-4">
          <div>
            <label>Nom de la plateforme</label>
            <input
              type="text"
              name="platformName"
              value={settings.platformName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label>Devise</label>
            <input
              type="text"
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label>Commission par défaut (%)</label>
            <input
              type="number"
              name="defaultCommission"
              value={settings.defaultCommission}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Annuler</Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>{loading ? 'Sauvegarde...' : 'Enregistrer'}</Button>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettingsModal;