// src/pages/buyer/BuyerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useStatsApi, useOrdersApi, useProductsApi, useFreelanceApi } from '../../hooks/useApi';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/dashboard/StatsCard';
import ProductCard from '../../components/products/ProductCard';
import MissionModal from '../../components/freelance/MissionModal';

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
    productsActions.getAll();
    freelanceActions.getMyMissions();
  }, []);

  const stats = statsStates.userStats.data?.stats || {};
  const orders = ordersStates.orders.data || [];
  const products = productsStates.products.data || [];
  const missions = freelanceStates.missions.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Acheteur</h1>
            <p className="mt-1 text-sm text-gray-500">
              Achetez des produits digitaux et créez des missions freelance
            </p>
          </div>

          {/* Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Vue Générale' },
                { id: 'products', name: 'Produits Digitaux' },
                { id: 'orders', name: 'Mes Achats' },
                { id: 'missions', name: 'Mes Missions' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatsCard
                title="Achats Total"
                value={stats.purchasesCount}
                icon="🛒"
                color="blue"
              />
              <StatsCard
                title="Dépenses Total"
                value={`${stats.totalPurchases || '0'} XOF`}
                icon="💰"
                color="purple"
              />
              <StatsCard
                title="Commandes Validées"
                value={stats.successfulPurchasesCount}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dernières commandes */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dernières Commandes</h3>
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex justify-between items-center py-3 border-b">
                    <div>
                      <span className="font-medium">Commande #{order.id.slice(0, 8)}</span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="font-medium">{order.total_price} XOF</span>
                  </div>
                ))}
              </div>

              {/* Missions actives */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Missions Actives</h3>
                  <Button onClick={() => setShowMissionModal(true)} size="small">
                    + Nouvelle Mission
                  </Button>
                </div>
                {missions.filter(m => m.status !== 'completed').slice(0, 5).map(mission => (
                  <div key={mission.id} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">{mission.title}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      mission.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      mission.status === 'awaiting_validation' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {mission.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Produits Digitaux */}
        {activeTab === 'products' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Produits Digitaux Disponibles</h2>
              <p className="text-gray-600">Achetez des produits digitaux instantanément</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuy={() => console.log('Acheter:', product)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mes Missions */}
        {activeTab === 'missions' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mes Missions Freelance</h2>
                <p className="text-gray-600">Créez et gérez vos missions pour les vendeurs</p>
              </div>
              <Button onClick={() => setShowMissionModal(true)}>
                + Créer une Mission
              </Button>
            </div>
            
            {/* Liste des missions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Missions ({missions.length})</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {missions.map(mission => (
                  <div key={mission.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{mission.title}</h4>
                        <p className="text-gray-600 mt-1">{mission.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
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
                      <div className="flex space-x-2">
                        {mission.status === 'awaiting_validation' && mission.deliveries?.[0] && (
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => {
                              // Valider la livraison et débloquer l'escrow
                              console.log('Valider livraison:', mission);
                            }}
                          >
                            Valider Livraison
                          </Button>
                        )}
                        <Button variant="secondary" size="small">
                          Voir Détails
                        </Button>
                      </div>
                    </div>
                    
                    {/* Candidatures pour cette mission */}
                    {mission.applications && mission.applications.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">
                          Candidatures ({mission.applications.length})
                        </p>
                        <div className="mt-2 space-y-2">
                          {mission.applications.slice(0, 3).map(application => (
                            <div key={application.id} className="flex justify-between items-center text-sm">
                              <span>Proposition: {application.proposed_price} XOF</span>
                              {mission.status === 'open' && (
                                <Button
                                  variant="primary"
                                  size="small"
                                  onClick={() => {
                                    // Accepter la candidature et initier l'escrow
                                    console.log('Accepter candidature:', application);
                                  }}
                                >
                                  Accepter
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mes Achats */}
        {activeTab === 'orders' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Mes Achats ({orders.length})</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {orders.map(order => (
                  <div key={order.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          Commande #{order.id.slice(0, 8)}
                        </h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div>Total: {order.total_price} XOF</div>
                          <div>Date: {new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    {/* Articles de commande */}
                    {order.order_items && (
                      <div className="mt-4">
                        {order.order_items.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span>{item.products?.title || 'Produit'}</span>
                            <span>{item.quantity} x {item.price} XOF</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal création mission */}
      <MissionModal
        isOpen={showMissionModal}
        onClose={() => setShowMissionModal(false)}
        onCreate={(missionData) => {
          console.log('Créer mission:', missionData);
          setShowMissionModal(false);
        }}
      />
    </div>
  );
};

export default BuyerDashboard;
