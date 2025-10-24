// src/pages/payment/PaymentCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentsAPI, ordersAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const PaymentCallback = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Vérification du paiement en cours...');
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const transactionId = searchParams.get('transaction_id');
        const orderId = searchParams.get('order_id');

        if (!transactionId || !orderId) {
          throw new Error("Paramètres manquants dans l'URL de retour.");
        }

        // 🔍 Vérification côté backend via Fedapay
        const verification = await paymentsAPI.verify({ 
          transaction_id: transactionId, 
          order_id: orderId 
        });

        if (verification.data?.status === 'success') {
          setStatus('success');
          setMessage('Paiement réussi ✅');

          // 📦 Marquer la commande comme payée
          const updatedOrder = await ordersAPI.updateStatus(orderId, 'completed');
          setOrder(updatedOrder.data);
          toast.success('Votre paiement a été confirmé.');

          // 🧹 Nettoyage du localStorage
          localStorage.removeItem('pendingOrder');
        } else {
          throw new Error("Le paiement n'a pas pu être confirmé.");
        }
      } catch (error) {
        console.error('Erreur de vérification Fedapay:', error);
        setStatus('failed');
        setMessage("Le paiement a échoué ou n'a pas été confirmé ❌");
        toast.error("Échec du paiement. Réessayez ou contactez le support.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleGoToOrders = () => {
    navigate('/buyer/orders');
  };

  const handleRetry = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <Loader size="large" />
            <p className="mt-4 text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Paiement Confirmé</h2>
            <p className="text-gray-600 mb-6">
              Merci pour votre achat&nbsp;! Votre commande est maintenant validée.
            </p>
            <Button variant="primary" fullWidth onClick={handleGoToOrders}>
              Voir mes achats
            </Button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="text-5xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Paiement Échoué</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button variant="secondary" fullWidth onClick={handleRetry}>
              Retour à l'accueil
            </Button>
          </>
        )}
      </div>

      <p className="mt-6 text-sm text-gray-400">
        🔒 Transaction sécurisée via Fedapay
      </p>
    </div>
  );
};

export default PaymentCallback;
