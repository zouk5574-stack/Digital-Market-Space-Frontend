// src/hooks/useFedapayApi.js
import { useApiCore } from './useApiCore';
import toast from 'react-hot-toast';

/**
 * Hook personnalisé pour gérer toutes les interactions avec FedaPay.
 * Permet d'initialiser, vérifier et suivre les paiements
 * (produits digitaux & missions freelance).
 */
export const useFedapayApi = () => {
  const api = useApiCore();

  // ===============================
  // 🟢 INITIALISER UN PAIEMENT PRODUIT
  // ===============================
  const initProductPayment = async (data) => {
    try {
      const response = await api.post('/fedapay/init', data);
      if (response.data?.url) {
        return { checkout_url: response.data.url };
      }
      throw new Error("URL de paiement introuvable");
    } catch (error) {
      console.error('❌ Erreur initProductPayment:', error);
      toast.error("Impossible d'initialiser le paiement. Réessayez.");
      return null;
    }
  };

  // ===============================
  // 🟣 INITIALISER UN PAIEMENT ESCROW (mission freelance)
  // ===============================
  const initEscrowPayment = async (data) => {
    try {
      const response = await api.post('/fedapay/escrow/init', data);
      if (response.data?.url) {
        return { checkout_url: response.data.url };
      }
      throw new Error("URL de paiement escrow introuvable");
    } catch (error) {
      console.error('❌ Erreur initEscrowPayment:', error);
      toast.error("Erreur d'initialisation du paiement escrow.");
      return null;
    }
  };

  // ===============================
  // 🔵 VÉRIFIER UN PAIEMENT (Callback)
  // ===============================
  const verifyPayment = async (data) => {
    try {
      const response = await api.post('/fedapay/verify', data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur verifyPayment:', error);
      return { status: 'error', message: error.message };
    }
  };

  // ===============================
  // 🟡 VÉRIFIER UN ESCROW EXISTANT
  // ===============================
  const verifyEscrow = async (transactionId) => {
    try {
      const response = await api.get(`/fedapay/escrow/status/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur verifyEscrow:', error);
      return null;
    }
  };

  // ===============================
  // 🔥 ANNULER UN PAIEMENT / ESCROW
  // ===============================
  const cancelPayment = async (transactionId) => {
    try {
      const response = await api.post('/fedapay/cancel', { transactionId });
      toast.success('Paiement annulé avec succès.');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur cancelPayment:', error);
      toast.error("Impossible d'annuler le paiement.");
      return null;
    }
  };

  return {
    actions: {
      initProductPayment,
      initEscrowPayment,
      verifyPayment,
      verifyEscrow,
      cancelPayment,
    },
  };
};