import { useState } from 'react';
import { fedapayAPI, paymentsAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useFedapayApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===============================
  // 🟢 INITIALISER UN PAIEMENT PRODUIT
  // ===============================
  const initProductPayment = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fedapayAPI.initPayment(data);
      if (response.data?.url) {
        return { checkout_url: response.data.url };
      }
      throw new Error("URL de paiement introuvable");
    } catch (error) {
      console.error('❌ Erreur initProductPayment:', error);
      toast.error("Impossible d'initialiser le paiement. Réessayez.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🟣 INITIALISER UN PAIEMENT ESCROW (mission freelance)
  // ===============================
  const initEscrowPayment = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fedapayAPI.initEscrow(data);
      if (response.data?.url) {
        return { checkout_url: response.data.url };
      }
      throw new Error("URL de paiement escrow introuvable");
    } catch (error) {
      console.error('❌ Erreur initEscrowPayment:', error);
      toast.error("Erreur d'initialisation du paiement escrow.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🔵 VÉRIFIER UN PAIEMENT (Callback)
  // ===============================
  const verifyPayment = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentsAPI.verify(data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur verifyPayment:', error);
      return { status: 'error', message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🟡 VÉRIFIER UN ESCROW EXISTANT
  // ===============================
  const verifyEscrow = async (transactionId) => {
    setLoading(true);
    setError(null);
    try {
      // Note: Cette méthode n'existe pas dans l'API standard - à implémenter côté backend
      const response = await paymentsAPI.getById(transactionId);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur verifyEscrow:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    actions: {
      initProductPayment,
      initEscrowPayment,
      verifyPayment,
      verifyEscrow,
    },
  };
};
