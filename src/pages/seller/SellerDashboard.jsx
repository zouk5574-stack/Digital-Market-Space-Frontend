// src/pages/seller/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useStatsApi, useProductsApi, useOrdersApi, useFreelanceApi } from '../../hooks/useApi';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/dashboard/StatsCard';
import DataTable from '../../components/dashboard/DataTable';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { actions: statsActions, states: statsStates } = useStatsApi();
  const { actions: productActions, states: productStates } = useProductsApi();
  const { actions: ordersActions, states: ordersStates } = useOrdersApi();
  const { actions: freelanceActions, states: freelanceStates } = useFreelanceApi();

  useEffect(() => {
    statsActions.getUserStats();
    productActions.getMyProducts();
    ordersActions.getMySales();
    freelanceActions.getMyApplications();
  }, []);

  const stats = statsStates.userStats.data?.stats || {};
  const products = productStates.products.data || [];
  const sales = ordersStates.sales.data || [];
  const applications = freelanceStates.applications.data || [];

  // Applications groupées par statut
  const pendingApplications = applications.filter(app => 
    app.mission?.status === 'open' || app.mission?.status === 'pending_payment'
  );
  const activeMissions = applications.filter(app => 
    app.mission?.status === 'in_progress'
  );
  const completedMissions = applications.filter(app => 
    app.mission?.status === 'completed' || app.mission?.status === 'awaiting_validation'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Vendeur</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez vos produits, ventes et missions freelance
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="primary">
                + Nouveau Produit
              </Button>
              <Button variant="secondary">
                Voir Missions
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Vue Générale' },
                { id: 'products', name: 'Mes Produits' },
                { id: 'sales', name: 'Mes Ventes' },
                { id: 'missions', name: 'Missions Freelance' },
                { id: 'applications', name: 'Mes Candidatures' },
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
                title="Produits Actifs"
                value={products.length}
                icon="📦"
                color="blue"
              />
              <StatsCard
                title="Ventes Total"
                value={stats.salesCount}
                icon="💰"
                color="green"
              />
              <StatsCard
                title="Gains Nets"
                value={`${stats.totalSellerEarnings || '0'} XOF`}
                icon="🎯"
                color="purple"
              />
              <StatsCard
                title="Missions Actives"
                value={activeMissions.length}
                icon="⚡"
                color="orange"
              />
              <StatsCard
                title="Candidatures"
                value={applications.length}
                icon="📝"
                color="yellow"
              />
              <StatsCard
                title="Missions Terminées"
                value={completedMissions.length}
                icon="✅"
                color="green"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Produits récents */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Produits Récents</h3>
                {products.slice(0, 5).map(product => (
                  <div key={product.id} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-gray-500">{product.price} XOF</span>
                  </div>
                ))}
              </div>

              {/* Missions en cours */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Missions Actives</h3>
                {activeMissions.slice(0, 5).map(mission => (
                  <div key={mission.id} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">{mission.mission?.title}</span>
                    <span className="text-sm text-gray-500">{mission.proposed_price} XOF</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mes Produits */}
        {activeTab === 'products' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Mes Produits ({products.length})</h3>
              </div>
              <DataTable
                data={products}
                columns={[
                  { key: 'name', label: 'Nom' },
                  { key: 'description', label: 'Description' },
                  { key: 'price', label: 'Prix', format: (value) => `${value} XOF` },
                  { key: 'category', label: 'Catégorie' },
                  { 
                    key: 'created_at', 
                    label: 'Date Création', 
                    format: (value) => new Date(value).toLocaleDateString() 
                  },
                ]}
                actions={[
                  {
                    label: 'Modifier',
                    onClick: (product) => console.log('Modifier:', product),
                    variant: 'secondary'
                  },
                  {
                    label: 'Supprimer',
                    onClick: (product) => console.log('Supprimer:', product),
                    variant: 'danger'
                  }
                ]}
                loading={productStates.products.loading}
              />
            </div>
          </div>
        )}

        {/* Mes Candidatures */}
        {activeTab === 'applications' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Mes Candidatures ({applications.length})</h3>
              </div>
              <DataTable
                data={applications}
                columns={[
                  { key: 'mission.title', label: 'Mission' },
                  { key: 'proposed_price', label: 'Prix Proposé', format: (value) => `${value} XOF` },
                  { 
                    key: 'mission.status', 
                    label: 'Statut Mission', 
                    format: (value) => (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        value === 'completed' ? 'bg-green-100 text-green-800' :
                        value === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        value === 'open' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {value}
                      </span>
                    )
                  },
                  { 
                    key: 'created_at', 
                    label: 'Date Candidature', 
                    format: (value) => new Date(value).toLocaleDateString() 
                  },
                ]}
                actions={[
                  {
                    label: 'Voir Détails',
                    onClick: (application) => console.log('Voir:', application),
                    variant: 'secondary'
                  },
                  {
                    label: (app) => app.mission?.status === 'in_progress' ? 'Livrer' : '...',
                    onClick: (application) => {
                      if (application.mission?.status === 'in_progress') {
                        // Ouvrir modal de livraison
                        console.log('Livrer mission:', application);
                      }
                    },
                    variant: (app) => app.mission?.status === 'in_progress' ? 'primary' : 'secondary'
                  }
                ]}
                loading={freelanceStates.applications.loading}
              />
            </div>
          </div>
        )}

        {/* Autres onglets */}
        {(activeTab === 'sales' || activeTab === 'missions') && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">Section {activeTab} en cours de développement...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
