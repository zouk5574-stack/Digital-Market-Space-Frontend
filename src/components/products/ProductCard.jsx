// src/components/products/ProductCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOrdersApi, useFedapayApi } from '../../hooks/useApi';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { actions: ordersActions } = useOrdersApi();
  const { actions: fedapayActions } = useFedapayApi();
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
      // 1️⃣ Créer la commande côté backend
      const order = await ordersActions.create({
        product_id: product.id,
        quantity: quantity,
      });

      if (!order?.id) {
        throw new Error('Création de commande échouée');
      }

      // 2️⃣ Sauvegarder localement la commande pour le suivi post-paiement
      localStorage.setItem('pendingOrder', JSON.stringify(order));

      // 3️⃣ Initialiser le paiement Fedapay
      const paymentData = {
        amount: product.price * quantity,
        description: `Achat: ${product.name}`,
        orderId: order.id,
        buyerId: user.id,
      };

      const paymentResponse = await fedapayActions.initProductPayment(paymentData);

      // 4️⃣ Redirection Fedapay
      if (paymentResponse?.checkout_url) {
        toast.success('Redirection vers la page de paiement...');
        window.location.href = paymentResponse.checkout_url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('Erreur achat produit:', error);
      toast.error("Erreur lors de l'initialisation du paiement. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = product.owner_id === user?.id;

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Badge "Nouveau" */}
      {product.is_new && (
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
          Nouveau
        </span>
      )}

      {/* Image du produit */}
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.media_urls?.[0] ? (
          <img
            src={product.media_urls[0]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-4xl">🛍️</span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description || 'Aucune description disponible.'}
        </p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-indigo-600">
            {product.price?.toLocaleString()} XOF
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {product.category || 'Autre'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Vendeur: {product.seller_name || 'Marketplace'}</span>
          {product.store_name && <span>Boutique: {product.store_name}</span>}
        </div>

        {!isOwner ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Quantité:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
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
            >
              {loading ? (
                <>
                  <Loader size="small" />
                  <span className="ml-2">Redirection Fedapay...</span>
                </>
              ) : (
                `Acheter - ${(product.price * quantity).toLocaleString()} XOF`
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center">
              🔒 Paiement sécurisé via Fedapay
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-gray-500 text-sm italic">
            Votre produit
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;