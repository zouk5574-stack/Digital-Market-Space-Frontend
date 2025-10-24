// src/components/products/ProductCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { fedapayAPI, paymentsAPI } from '../../services/api';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleBuyProduct = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour acheter ce produit.');
      return;
    }

    if (!window.confirm(`Confirmez votre achat de ${product.name} pour ${product.price * quantity} XOF ?`)) {
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Initialiser le paiement directement (la commande sera créée côté backend)
      const paymentData = {
        product_id: product.id,
        quantity: quantity,
        amount: product.price * quantity,
        description: `Achat: ${product.name}`,
        buyer_id: user.id,
      };

      // Utiliser paymentsAPI.init() pour créer la commande + paiement
      const paymentResponse = await paymentsAPI.init(paymentData);

      // 2️⃣ Sauvegarder localement la commande pour le suivi post-paiement
      if (paymentResponse.data.order) {
        localStorage.setItem('pendingOrder', JSON.stringify(paymentResponse.data.order));
      }

      // 3️⃣ Si Fedapay est requis, initialiser le paiement
      if (paymentResponse.data.requires_payment) {
        const fedapayResponse = await fedapayAPI.initPayment({
          amount: product.price * quantity,
          description: `Achat: ${product.name}`,
          order_id: paymentResponse.data.order?.id,
          first_name: user.name?.split(' ')[0] || 'Client',
          last_name: user.name?.split(' ')[1] || 'DigitalMarketSpace',
          email: user.email,
        });

        // 4️⃣ Redirection Fedapay
        if (fedapayResponse.data?.checkout_url) {
          toast.success('Redirection vers la page de paiement...');
          window.location.href = fedapayResponse.data.checkout_url;
        } else {
          throw new Error('URL de paiement non reçue');
        }
      } else {
        // Paiement direct (gratuit ou autre méthode)
        toast.success('Achat effectué avec succès !');
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur achat produit:', error);
      toast.error(`Erreur lors de l'achat: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = product.owner_id === user?.id;

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100">
      {/* Badge "Nouveau" */}
      {product.is_new && (
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow z-10">
          Nouveau
        </span>
      )}

      {/* Image du produit */}
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {product.media_urls?.[0] ? (
          <img
            src={product.media_urls[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="text-gray-400 text-6xl">🛍️</div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200"></div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.description || 'Aucune description disponible.'}
        </p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-indigo-600">
            {product.price?.toLocaleString()} XOF
          </span>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
            {product.category || 'Autre'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="truncate">Vendeur: {product.seller_name || 'Marketplace'}</span>
          {product.store_name && (
            <span className="truncate ml-2">Boutique: {product.store_name}</span>
          )}
        </div>

        {!isOwner ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600 font-medium">Quantité:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={handleBuyProduct}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader size="small" />
                  <span className="ml-2">Traitement...</span>
                </div>
              ) : (
                `Acheter - ${(product.price * quantity).toLocaleString()} XOF`
              )}
            </Button>

            <div className="flex items-center justify-center text-xs text-gray-500 space-x-1">
              <span>🔒</span>
              <span>Paiement sécurisé</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 px-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
            👑 Votre produit
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
