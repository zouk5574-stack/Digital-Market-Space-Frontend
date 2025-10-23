// src/pages/seller/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/dashboard/StatsCard';
import DataTable from '../../components/dashboard/DataTable';
import InfoModal from '../../components/ui/InfoModal';
import ErrorModal from '../../components/ui/ErrorModal';
import DeleteConfirmModal from '../../components/ui/DeleteConfirmModal';
import ProductModal from '../../components/admin/ProductModal';
import ServiceModal from '../../components/modals/ServiceModal';
import WithdrawalModal from '../../components/admin/withdrawalModal';
import { productsAPI, ordersAPI, freelanceAPI, statsAPI } from '../../services/api';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Modales
  const [infoModal, setInfoModal] = useState({ isOpen: false, message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null, onConfirm: null });
  const [productModal, setProductModal] = useState({ isOpen: false, product: null });
  const [serviceModal, setServiceModal] = useState({ isOpen: false, service: null });
  const [withdrawalModal, setwithdrawalModal] = useState({ isOpen: false, walletBalance: 0 });

  // Data
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [applications, setApplications] = useState([]);
  const [missions, setMissions] = useState([]);

  // ==================== Fonctions ====================
  const refreshData = async () => {
    try {
      const [statsRes, productsRes, salesRes, applicationsRes, missionsRes] = await Promise.all([
        statsAPI.user(),
        productsAPI.my(),
        ordersAPI.sales(),
        freelanceAPI.applications.my(),
        freelanceAPI.missions.list()
      ]);

      setStats(statsRes.data?.stats || {});
      setProducts(productsRes.data || []);
      setSales(salesRes.data || []);
      setApplications(applicationsRes.data || []);
      setMissions(missionsRes.data || []);
    } catch (err) {
      console.error(err);
      setErrorModal({ isOpen: true, message: 'Erreur lors du chargement initial.' });
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDeleteProduct = (product) => {
    setDeleteModal({
      isOpen: true,
      item: product,
      onConfirm: async () => {
        try {
          await productsAPI.delete(product.id);
          await refreshData();
          setDeleteModal({ isOpen: false, item: null, onConfirm: null });
        } catch {
          setErrorModal({ isOpen: true, message: 'Impossible de supprimer le produit.' });
        }
      }
    });
  };

  const handleDeliverMission = (mission) => {
    setServiceModal({ isOpen: true, service: mission });
  };

  // ==================== Render ====================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Vendeur</h1>
            <p className="mt-1 text-sm text-gray-500">Gérez vos produits, ventes et missions freelance</p>
          </div>

          <div className="flex flex-wrap justify-start sm:justify-end gap-3 w-full sm:w-auto">
            <Button variant="primary" onClick={() => setProductModal({ isOpen: true, product: null })}>
              + Nouveau Produit
            </Button>
            <Button variant="secondary" onClick={() => setActiveTab('missions')}>
              Voir Missions
            </Button>
            <Button
              variant="secondary"
              onClick={() => setWithdrawalModal({ isOpen: true, walletBalance: stats.totalSellerEarnings || 0 })}
            >
              Retrait
            </Button>
          </div>
        </div>

        {/* Navigation onglets */}
        <nav className="border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-6 px-4 sm:px-6 lg:px-8 min-w-max">
            {[
              { key: 'overview', label: 'Vue Générale' },
              { key: 'products', label: 'Mes Produits' },
              { key: 'sales', label: 'Mes Ventes' },
              { key: 'missions', label: 'Missions Freelance' },
              { key: 'applications', label: 'Mes Candidatures' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-150 ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Produits Actifs" value={products.length} icon="📦" color="blue" />
            <StatsCard title="Ventes Totales" value={stats.salesCount || 0} icon="💰" color="green" />
            <StatsCard title="Gains Nets" value={`${stats.totalSellerEarnings || 0} XOF`} icon="🎯" color="purple" />
            <StatsCard title="Missions Actives" value={missions?.filter(m => m.status === 'in_progress')?.length || 0} icon="⚡" color="orange" />
            <StatsCard title="Missions Terminées" value={missions?.filter(m => m.status === 'completed')?.length || 0} icon="✅" color="emerald" />
            <StatsCard title="Candidatures" value={applications?.length || 0} icon="📝" color="yellow" />
          </section>
        )}

        {activeTab === 'products' && (
          <section className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b px-6 py-4 gap-4">
              <h3 className="text-lg font-medium text-gray-900">Mes Produits ({products.length})</h3>
              <Button onClick={() => setProductModal({ isOpen: true, product: null })}>+ Ajouter Produit</Button>
            </div>
            <DataTable
              data={products}
              columns={[
                { key: 'name', label: 'Nom' },
                { key: 'description', label: 'Description' },
                { key: 'price', label: 'Prix', format: v => `${v} XOF` },
                { key: 'category', label: 'Catégorie' },
                { key: 'created_at', label: 'Créé le', format: v => new Date(v).toLocaleDateString() },
              ]}
              actions={[
                { label: 'Modifier', onClick: p => setProductModal({ isOpen: true, product: p }) },
                { label: 'Supprimer', onClick: handleDeleteProduct },
              ]}
            />
          </section>
        )}

        {activeTab === 'missions' && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b px-6 py-4 gap-4">
              <h3 className="text-lg font-medium text-gray-900">Missions Freelance ({missions?.length || 0})</h3>
            </div>
            <DataTable
              data={missions}
              columns={[
                { key: 'mission.title', label: 'Titre', format: (v, row) => row.mission?.title || 'N/A' },
                { key: 'mission.price', label: 'Prix', format: (v, row) => `${row.mission?.price || 0} XOF` },
                { key: 'status', label: 'Statut' },
                { key: 'created_at', label: 'Date', format: v => new Date(v).toLocaleDateString() },
              ]}
              actions={m => {
                const actions = [];
                if (m.status === 'in_progress') actions.push({ label: 'Livrer', onClick: () => handleDeliverMission(m) });
                if (m.delivery_file_url) actions.push({ label: 'Télécharger', onClick: () => window.open(m.delivery_file_url, '_blank') });
                return actions;
              }}
            />
          </section>
        )}
      </main>

      {/* Modales */}
      <InfoModal isOpen={infoModal.isOpen} onClose={() => setInfoModal({ isOpen: false, message: '' })} message={infoModal.message} />
      <ErrorModal isOpen={errorModal.isOpen} onClose={() => setErrorModal({ isOpen: false, message: '' })} message={errorModal.message} />
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, onConfirm: null })}
        onConfirm={deleteModal.onConfirm}
      />
      <ProductModal
        isOpen={productModal.isOpen}
        onClose={() => setProductModal({ isOpen: false, product: null })}
        product={productModal.product}
        onSaved={refreshData}
      />
      <ServiceModal
        isOpen={serviceModal.isOpen}
        onClose={() => setServiceModal({ isOpen: false, service: null })}
        service={serviceModal.service}
      />
      <WithdrawalModal
        isOpen={withdrawalModal.isOpen}
        onClose={() => setWithdrawalModal({ isOpen: false, walletBalance: 0 })}
        walletBalance={withdrawalModal.walletBalance}
        onSuccess={() => { refreshData(); setInfoModal({ isOpen: true, message: 'Retrait effectué avec succès 💸' }); }}
      />
    </div>
  );
};

export default SellerDashboard;