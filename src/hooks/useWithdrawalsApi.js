import { useState } from 'react';
import { withdrawalsAPI, adminAPI } from '../services/api';

export const useWithdrawalsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------------------------
  // Créer une demande de retrait
  // ---------------------------
  const createWithdrawal = async ({ amount, provider_id, account_number }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await withdrawalsAPI.create({ 
        amount, 
        provider_id, 
        account_number 
      });
      return res.data;
    } catch (err) {
      console.error("Erreur createWithdrawal:", err);
      setError(err.response?.data?.error || err.message || 'Erreur inconnue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Récupérer mes retraits
  // ---------------------------
  const getMyWithdrawals = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await withdrawalsAPI.my();
      return res.data.withdrawals || [];
    } catch (err) {
      console.error("Erreur getMyWithdrawals:", err);
      setError(err.response?.data?.error || err.message || 'Erreur inconnue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Admin : valider un retrait
  // ---------------------------
  const approveWithdrawal = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await adminAPI.withdrawals.approve(id);
      return res.data;
    } catch (err) {
      console.error("Erreur approveWithdrawal:", err);
      setError(err.response?.data?.error || err.message || 'Erreur inconnue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Admin : rejeter un retrait
  // ---------------------------
  const rejectWithdrawal = async (id, reason) => {
    setLoading(true);
    setError(null);

    try {
      const res = await adminAPI.withdrawals.reject(id, reason);
      return res.data;
    } catch (err) {
      console.error("Erreur rejectWithdrawal:", err);
      setError(err.response?.data?.error || err.message || 'Erreur inconnue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    actions: {
      createWithdrawal,
      getMyWithdrawals,
      approveWithdrawal,
      rejectWithdrawal
    }
  };
};
