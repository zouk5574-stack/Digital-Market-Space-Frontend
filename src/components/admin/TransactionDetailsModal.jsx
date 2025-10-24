// src/components/admin/TransactionDetailsModal.jsx
import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { paymentsAPI } from '../../services/api'; // ✅ Correction : import correct

const TransactionDetailsModal = ({ isOpen, onClose, transactionId }) => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!transactionId || !isOpen) return;

    const fetchTransaction = async () => {
      setLoading(true);
      try {
        // ✅ Correction : utilisation du bon endpoint
        const { data } = await paymentsAPI.transactions();
        const tx = data.find(t => t.id === transactionId);
        setTransaction(tx);
      } catch (err) {
        console.error('Erreur récupération transaction:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Détails Transaction</h2>
        
        {loading ? (
          <div className="text-center py-4">Chargement...</div>
        ) : transaction ? (
          <ul className="space-y-2 text-gray-700">
            <li><strong>ID:</strong> {transaction.id}</li>
            <li><strong>Montant:</strong> {transaction.amount} XOF</li>
            <li><strong>Type:</strong> {transaction.type}</li>
            <li><strong>Date:</strong> {new Date(transaction.created_at).toLocaleString()}</li>
            <li><strong>Statut:</strong> {transaction.status}</li>
          </ul>
        ) : (
          <div className="text-center py-4 text-red-500">Transaction non trouvée</div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;