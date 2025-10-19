// src/components/products/ProductCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOrdersApi, useFedapayApi } from '../../hooks/useApi';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { actions: ordersActions } = useOrdersApi();
  const { actions: fedapayActions } = useFedapayApi();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleBuyProduct = async () => {
    if (!user) {
      alert('Veuillez vous connecter pour acheter');
      return;
    }

    setLoading(true);
    try {
      // 1. Créer la commande
      const order = await ordersActions.create({
        product_id: product.id,
        quantity: quantity
      });

      // 2. Initialiser le paiement Fedapay
      const paymentData = {
        amount: product.price * quantity,
        description: `Achat: ${product.name}`,
        orderId: order.id,
        buyerId: user.id
      };

      const paymentResponse = await fedapayActions.initProductPayment(paymentData);
      
      // 3. Redirection vers Fedapay
      if (paymentResponse.checkout_url) {
        window.location.href = paymentResponse.checkout_url;
      } else {
        throw new Error('URL de paiement non reçue');
      }

    } catch (error) {
      console.error('Erreur achat produit:', error);
      alert('Erreur lors de l\'initialisation du paiement');
    } finally {
      setLoading(false);
    }
  };

  const isOwner = product.owner_id === user?.id;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image du produit */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {product.media_urls?.[0] ? (
          <img 
            src={product.media_urls[0]} 
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400">🛍️</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-indigo-600">
            {product.price} XOF
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Vendeur: {product.seller_name || 'Marketplace'}</span>
          {product.store_name && (
            <span>Boutique: {product.store_name}</span>
          )}
        </div>

        {!isOwner ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Quantité:</label>
              <select 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
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
                `Acheter - ${product.price * quantity} XOF`
              )}
            </Button>
            
            <div className="text-xs text-gray-500 text-center">
              🔒 Paiement sécurisé via Fedapay
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-gray-500">
            Votre produit
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
