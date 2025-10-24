// src/components/admin/PlatformSettingsModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { adminAPI } from '../../services/api';

const PlatformSettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    platformName: '',
    currency: 'XOF',
    defaultCommission: 10
  });
  const [loading, setLoading] = useState(false);

  // Chargement des paramètres actuels
  useEffect(() => {
    if (!isOpen) return;
    const fetchSettings = async () => {
      try {
        const { data } = await adminAPI.settings.get();
        // ✅ Correction : mapping correct des champs backend
        setSettings({
          platformName: data.platform_name || '',
          currency: data.currency || 'XOF',
          defaultCommission: data.default_commission || 10
        });
      } catch (err) {
        console.error('Erreur récupération des paramètres:', err);
      }
    };
    fetchSettings();
  }, [isOpen]);

  const handleChange = (e) =>
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (settings.defaultCommission < 0 || settings.defaultCommission > 100) {
      alert('Le taux de commission doit être entre 0 et 100 %');
      return;
    }

    setLoading(true);
    try {
      // ✅ Correction : structure de données adaptée au backend
      await adminAPI.settings.update({
        platform_name: settings.platformName,
        currency: settings.currency,
        default_commission: settings.defaultCommission
      });
      onClose();
    } catch (err) {
      console.error('Erreur sauvegarde paramètres:', err);
      alert('Échec de la sauvegarde des paramètres.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          ⚙️ Paramètres de la Plateforme
        </h2>

        <div className="space-y-4">
          <Input
            label="Nom de la plateforme"
            name="platformName"
            value={settings.platformName}
            onChange={handleChange}
            placeholder="Ex: Digital Market Space"
            required
          />

          <Input
            label="Devise"
            name="currency"
            value={settings.currency}
            onChange={handleChange}
            placeholder="XOF, USD, EUR..."
            maxLength={5}
            required
          />

          <Input
            label="Commission par défaut (%)"
            type="number"
            name="defaultCommission"
            value={settings.defaultCommission}
            onChange={handleChange}
            min={0}
            max={100}
            required
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Sauvegarde...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettingsModal;