import { useState } from 'react';
import axios from 'axios';

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
      const res = await axios.post('/api/withdrawals', {
        amount,
        provider_id,
        account_number
      });

      // ✅ Backend renvoie l'URL Fedapay sécurisée
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
      const res = await axios.get('/api/withdrawals/my');
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
      const res = await axios.post(`/api/withdrawals/${id}/approve`);
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
      const res = await axios.post(`/api/withdrawals/${id}/reject`, { reason });
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