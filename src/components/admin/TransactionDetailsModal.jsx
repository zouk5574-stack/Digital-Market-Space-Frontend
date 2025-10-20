// src/components/admin/TransactionDetailsModal.jsx
import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { walletAPI } from '../../services/api';

const TransactionDetailsModal = ({ isOpen, onClose, transactionId }) => {
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    if (!transactionId || !isOpen) return;

    const fetchTransaction = async () => {
      try {
        const { data } = await walletAPI.getTransactions();
        const tx = data.find(t => t.id === transactionId);
        setTransaction(tx);
      } catch (err) {
        console.error('Erreur récupération transaction:', err);
      }
    };

    fetchTransaction();
  }, [transactionId, isOpen]);

  if (!isOpen) return null;
  if (!transaction) return <div>Chargement...</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Détails Transaction</h2>
        <ul className="space-y-2 text-gray-700">
          <li><strong>ID:</strong> {transaction.id}</li>
          <li><strong>Montant:</strong> {transaction.amount} XOF</li>
          <li><strong>Type:</strong> {transaction.type}</li>
          <li><strong>Date:</strong> {new Date(transaction.created_at).toLocaleString()}</li>
          <li><strong>Statut:</strong> {transaction.status}</li>
        </ul>
        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;