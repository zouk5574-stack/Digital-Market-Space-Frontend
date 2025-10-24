import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { adminAPI } from '../../services/api'; // ✅ Import correct

const AdminWithdrawalModal = ({ 
  isOpen, 
  onClose, 
  withdrawal, // ✅ Données de la demande de retrait
  onActionSuccess // ✅ Callback après action
}) => {
  const [action, setAction] = useState(''); // 'approve' ou 'reject'
  const [reason, setReason] = useState(''); // Raison du rejet
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!withdrawal || !action) return;

    setLoading(true);
    try {
      if (action === 'approve') {
        // ✅ CORRECT : utilise adminAPI.withdrawals.approve(id)
        await adminAPI.withdrawals.approve(withdrawal.id);
      } else if (action === 'reject') {
        // ✅ CORRECT : utilise adminAPI.withdrawals.reject(id, reason)
        if (!reason.trim()) {
          alert('Veuillez saisir une raison pour le rejet');
          return;
        }
        await adminAPI.withdrawals.reject(withdrawal.id, reason);
      }

      if (onActionSuccess) onActionSuccess();
      onClose();
      resetForm();
    } catch (err) {
      console.error('Erreur traitement retrait:', err);
      alert('Impossible de traiter la demande de retrait: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAction('');
    setReason('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !withdrawal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Traitement du Retrait #{withdrawal.id}
        </h3>

        {/* Informations de la demande */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-4">
          <p className="text-sm text-gray-700">
            <strong>Vendeur:</strong> {withdrawal.user?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Montant:</strong> {withdrawal.amount} XOF
          </p>
          <p className="text-sm text-gray-700">
            <strong>Compte:</strong> {withdrawal.account_number}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Date:</strong> {new Date(withdrawal.created_at).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Statut:</strong> <span className={`font-medium ${withdrawal.status === 'pending' ? 'text-yellow-600' : withdrawal.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
              {withdrawal.status?.toUpperCase() || 'EN ATTENTE'}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sélection de l'action */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action à effectuer
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="action"
                  value="approve"
                  checked={action === 'approve'}
                  onChange={(e) => setAction(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-green-600 font-medium">Approuver</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="action"
                  value="reject"
                  checked={action === 'reject'}
                  onChange={(e) => setAction(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-red-600 font-medium">Rejeter</span>
              </label>
            </div>
          </div>

          {/* Raison du rejet (affiché seulement si rejet) */}
          {action === 'reject' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raison du rejet *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Expliquez la raison du rejet..."
                required
              />
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-700">
              <strong>Attention:</strong> Cette action est irréversible. 
              {action === 'approve' && " Le vendeur recevra les fonds sur son compte."}
              {action === 'reject' && " Le vendeur sera notifié du rejet."}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleClose} 
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading || !action || (action === 'reject' && !reason.trim())}
            >
              {loading ? 'Traitement...' : `Confirmer ${action === 'approve' ? 'l\\'approbation' : 'le rejet'}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminWithdrawalModal;
