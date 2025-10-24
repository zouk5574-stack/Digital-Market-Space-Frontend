import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { withdrawalsAPI } from '../../services/api'; // ✅ Import direct

const WithdrawalModal = ({ isOpen, onClose, walletBalance, onWithdrawalSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    provider_id: '1', // Fedapay par défaut
    account_number: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountNumber = Number(formData.amount);
    
    if (!amountNumber || amountNumber > walletBalance) {
      alert('Montant invalide ou supérieur au solde disponible');
      return;
    }

    setLoading(true);
    try {
      // ✅ Correction : utilisation de l'API directe
      const res = await withdrawalsAPI.create({
        amount: amountNumber,
        provider_id: formData.provider_id,
        account_number: formData.account_number
      });

      // Mise à jour immédiate du solde
      if (onWithdrawalSuccess) onWithdrawalSuccess(amountNumber);

      // Redirection vers Fedapay
      if (res?.data?.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        alert('Retrait créé mais impossible de rediriger vers Fedapay.');
      }

      onClose();
    } catch (err) {
      console.error('Erreur retrait:', err);
      alert('Impossible de créer la demande de retrait: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Demande de Retrait</h3>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p className="text-sm text-blue-700"><strong>Solde disponible:</strong> {walletBalance} XOF</p>
          <p className="text-xs text-blue-600 mt-1">Ce solde représente les revenus issus de ventes de vos produits digitaux et de l'accomplissement de vos missions freelances. BON COURAGE !✨</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Montant à retirer (XOF)"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            max={walletBalance}
            placeholder="Entrez le montant"
          />
          <Input
            label="Numéro de compte/portefeuille"
            name="account_number"
            type="text"
            value={formData.account_number}
            onChange={handleChange}
            required
            placeholder="Votre numéro de compte Fedapay"
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> Les retraits sont traités sous 24-48h. Vous serez redirigé vers Fedapay pour finaliser l'opération.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading || !formData.amount || !formData.account_number || formData.amount > walletBalance}
            >
              {loading ? 'Traitement...' : 'Demander le Retrait'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalModal;
