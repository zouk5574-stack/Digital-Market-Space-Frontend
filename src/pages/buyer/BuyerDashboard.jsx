import React, { useState, useEffect } from 'react';
import { useStatsApi, useOrdersApi, useProductsApi, useFreelanceApi } from '../../hooks/useApi';
import { fedapayAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/dashboard/StatsCard';
import ProductCard from '../../components/products/ProductCard';
import MissionModal from '../../components/freelance/MissionModal';
import toast from 'react-hot-toast';

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMissionModal, setShowMissionModal] = useState(false);

  const { actions: statsActions, states: statsStates } = useStatsApi();
  const { actions: ordersActions, states: ordersStates } = useOrdersApi();
  const { actions: productsActions, states: productsStates } = useProductsApi();
  const { actions: freelanceActions, states: freelanceStates } = useFreelanceApi();

  useEffect(() => {
    statsActions.getUserStats();
    ordersActions.getMyOrders();
    productsActions.getAllProducts();
    freelanceActions.getMyMissions();
  }, []);

  const stats = statsStates.userStats.data || {};
  const orders = ordersStates.orders.data || [];
  const products = productsStates.products.data || [];
  const missions = freelanceStates.myMissions.data || [];

  // 🔹 Fonction achat produit → redirection Fedapay
  const handleBuy = async (product) => {
    try {
      const response = await fedapayAPI.initPayment({ 
        product_id: product.id,
        amount: product.price,
        currency: 'XOF'
      });
      
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Lien de paiement introuvable');
      }
    } catch (err) {
      console.error('Erreur paiement :', err);
      toast.error('Une erreur est survenue lors du paiement');
    }
  };

  // 🔹 Valider une livraison (Escrow)
  const handleValidateDelivery = async (missionId) => {
    try {
      await freelanceActions.validateDelivery(missionId);
      toast.success('Livraison validée ✅ — les fonds seront libérés au vendeur.');
      freelanceActions.getMyMissions();
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la validation de la livraison');
    }
  };

  // 🔹 Créer une mission (avec Escrow à la création)
  const handleCreateMission = async (missionData) => {
    try {
      const response = await fedapayAPI.initEscrow(missionData);
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Mission créée sans lien de paiement');
      }
      setShowMissionModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la création de la mission');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard Acheteur</h1>
            <p className="mt-2 text-sm md:text-base text-gray-500">
              Achetez des produits digitaux et gérez vos missions freelance.
            </p>
          </div>
          <nav className="border-b border-gray-200">
            <div className="-mb-px flex space-x-6 overflow-x-auto">
              {[
                { id: 'overview', name: 'Vue Générale' },
                { id: 'products', name: 'Produits Digitaux' },
                { id: 'orders', name: 'Mes Achats' },
                { id: 'missions', name: 'Mes Missions' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm md:text-base transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* ===== CONTENU ===== */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* VUE GÉNÉRALE */}
        {activeTab === 'overview' && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Achats Total" 
                value={stats.purchases_count || 0} 
                icon="🛒" 
                color="blue" 
              />
              <StatsCard 
                title="Dépenses Total" 
                value={`${stats.total_purchases || '0'} XOF`} 
                icon="💰" 
                color="purple" 
              />
              <StatsCard 
                title="Commandes Validées" 
                value={stats.successful_purchases_count || 0} 
                icon="✅" 
                color="green" 
              />
              <StatsCard 
                title="Missions Créées" 
                value={missions.length} 
                icon="🎯" 
                color="orange" 
              />
            </div>
          </section>
        )}

        {/* PRODUITS */}
        {activeTab === 'products' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Produits Digitaux Disponibles</h2>
              <p className="text-gray-600 mt-1">Faites défiler pour découvrir les produits à acheter.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuy={() => handleBuy(product)}
                />
              ))}
            </div>
          </section>
        )}

        {/* COMMANDES */}
        {activeTab === 'orders' && (
          <section>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Mes Achats ({orders.length})</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {orders.map(order => (
                  <div key={order.id} className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Commande #{order.id?.slice(0, 8)}</h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div>Total: {order.total_price} XOF</div>
                          <div>Date: {new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {order.status === 'completed' && (
                      <div className="mt-3">
                        {order.order_items?.map(item => (
                          <Button
                            key={item.id}
                            variant="primary"
                            size="small"
                            onClick={() => window.open(item.product?.file_url, '_blank')}
                          >
                            Télécharger {item.product?.title}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* MISSIONS */}
        {activeTab === 'missions' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Mes Missions Freelance</h2>
                <p className="text-gray-600 mt-1">Créez et gérez vos missions avec Escrow intégré.</p>
              </div>
              <Button onClick={() => setShowMissionModal(true)}>+ Créer une Mission</Button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Missions ({missions.length})</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {missions.map(mission => (
                  <div key={mission.id} className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{mission.title}</h4>
                        <p className="text-gray-600 mt-1">{mission.description}</p>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>Budget: {mission.budget} XOF</span>
                          <span>Catégorie: {mission.category}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            mission.status === 'completed' ? 'bg-green-100 text-green-800' :
                            mission.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            mission.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {mission.status}
                          </span>
                        </div>
                      </div>

                      {mission.status === 'awaiting_validation' && (
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleValidateDelivery(mission.id)}
                        >
                          Valider Livraison
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <MissionModal
        isOpen={showMissionModal}
        onClose={() => setShowMissionModal(false)}
        onCreate={handleCreateMission}
      />
    </div>
  );
};

export default BuyerDashboard;
