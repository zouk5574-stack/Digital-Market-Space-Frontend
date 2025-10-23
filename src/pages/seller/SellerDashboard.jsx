// src/pages/seller/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/dashboard/StatsCard';
import DataTable from '../../components/dashboard/DataTable';
import InfoModal from '../../components/ui/InfoModal';
import ErrorModal from '../../components/ui/ErrorModal';
import DeleteConfirmModal from '../../components/ui/DeleteConfirmModal';
import TransactionDetailsModal from '../../components/admin/TransactionDetailsModal';
import ProductModal from '../../components/modals/ProductModal';
import ServiceModal from '../../components/modals/ServiceModal'; // ✅ ajouté
import WithdrawalModal from '../../components/admin/WithdrawalModal';
import { productsAPI, ordersAPI, freelanceAPI, withdrawalsAPI, statsAPI } from '../../services/api';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // ----- Modals -----
  const [infoModal, setInfoModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null, onConfirm: null });
  const [transactionModal, setTransactionModal] = useState({ open: false, transactionId: null });
  const [productModal, setProductModal] = useState({ open: false, product: null });
  const [withdrawalModal, setWithdrawalModal] = useState({ open: false, walletBalance: 0 });
  const [serviceModal, setServiceModal] = useState({ open: false, service: null }); // ✅ ajouté

  // ----- States -----
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [applications, setApplications] = useState([]);
  const [missions, setMissions] = useState([]);

  // ----- Chargement initial -----
  useEffect(() => {
    fetchUserStats();
    fetchMyProducts();
    fetchMySales();
    fetchMyApplications();
    fetchMyMissions();
  }, []);

  // ----- API calls -----
  const fetchUserStats = async () => {
    try {
      const res = await statsAPI.user();
      setStats(res.data.stats || {});
    } catch {
      setErrorModal({ open: true, message: 'Impossible de récupérer les statistiques.' });
    }
  };

  const fetchMyProducts = async () => {
    try {
      const res = await productsAPI.my();
      setProducts(res.data || []);
    } catch {
      setErrorModal({ open: true, message: 'Impossible de récupérer vos produits.' });
    }
  };

  const fetchMySales = async () => {
    try {
      const res = await ordersAPI.sales();
      setSales(res.data || []);
    } catch {
      setErrorModal({ open: true, message: 'Impossible de récupérer vos ventes.' });
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await freelanceAPI.applications.my();
      setApplications(res.data || []);
    } catch {
      setErrorModal({ open: true, message: 'Impossible de récupérer vos candidatures.' });
    }
  };

  const fetchMyMissions = async () => {
    try {
      const res = await freelanceAPI.missions.list();
      setMissions(res.data || []);
    } catch {
      setErrorModal({ open: true, message: 'Impossible de récupérer vos missions.' });
    }
  };

  // ----- Supprimer Produit -----
  const handleDeleteProduct = (product) => {
    setDeleteModal({
      open: true,
      item: product,
      onConfirm: async () => {
        try {
          await productsAPI.delete(product.id);
          fetchMyProducts();
          setDeleteModal({ open: false, item: null, onConfirm: null });
        } catch {
          setErrorModal({ open: true, message: 'Impossible de supprimer le produit.' });
        }
      },
    });
  };

  // ----- Livrer Mission -----
  const handleDeliverMission = (mission) => {
    setServiceModal({ open: true, service: mission });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ====== En-tête ====== */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Vendeur</h1>
            <p className="mt-1 text-sm text-gray-500">Gérez vos produits, ventes et missions freelance</p>
          </div>

          {/* Boutons action */}
          <div className="flex flex-wrap justify-start sm:justify-end gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              onClick={() => setProductModal({ open: true, product: null })}
              className="w-full sm:w-auto"
            >
              + Nouveau Produit
            </Button>
            <Button
              variant="secondary"
              onClick={() => setActiveTab('missions')}
              className="w-full sm:w-auto"
            >
              Voir Missions
            </Button>
            <Button
              variant="secondary"
              onClick={() => setWithdrawalModal({ open: true, walletBalance: stats.totalSellerEarnings || 0 })}
              className="w-full sm:w-auto"
            >
              Retrait
            </Button>
          </div>
        </div>

        {/* ====== Navigation Onglets ====== */}
        <nav className="border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-6 px-4 sm:px-6 lg:px-8 min-w-max">
            {[
              { key: 'overview', label: 'Vue Générale' },
              { key: 'products', label: 'Mes Produits' },
              { key: 'sales', label: 'Mes Ventes' },
              { key: 'missions', label: 'Missions Freelance' },
              { key: 'applications', label: 'Mes Candidatures' },
            ].map((tab) => (
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

      {/* ====== Contenu Principal ====== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* ----- Vue Générale ----- */}
        {activeTab === 'overview' && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Produits Actifs" value={products.length} icon="📦" color="blue" />
            <StatsCard title="Ventes Totales" value={stats.salesCount || 0} icon="💰" color="green" />
            <StatsCard title="Gains Nets" value={`${stats.totalSellerEarnings || 0} XOF`} icon="🎯" color="purple" />
            <StatsCard title="Missions Actives" value={missions.filter((m) => m.status === 'in_progress').length} icon="⚡" color="orange" />
            <StatsCard title="Missions Terminées" value={missions.filter((m) => m.status === 'completed').length} icon="✅" color="emerald" />
            <StatsCard title="Candidatures" value={applications.length} icon="📝" color="yellow" />
          </section>
        )}

        {/* ----- Mes Produits ----- */}
        {activeTab === 'products' && (
          <section className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b px-6 py-4 gap-4">
              <h3 className="text-lg font-medium text-gray-900">Mes Produits ({products.length})</h3>
              <Button onClick={() => setProductModal({ open: true, product: null })}>+ Ajouter Produit</Button>
            </div>
            <div className="overflow-x-auto">
              <DataTable
                data={products}
                columns={[
                  { key: 'name', label: 'Nom' },
                  { key: 'description', label: 'Description' },
                  { key: 'price', label: 'Prix', format: (v) => `${v} XOF` },
                  { key: 'category', label: 'Catégorie' },
                  { key: 'created_at', label: 'Créé le', format: (v) => new Date(v).toLocaleDateString() },
                ]}
                actions={[
                  { label: 'Modifier', onClick: (p) => setProductModal({ open: true, product: p }) },
                  { label: 'Supprimer', onClick: handleDeleteProduct },
                ]}
              />
            </div>
          </section>
        )}

        {/* ----- Missions Freelance ----- */}
        {activeTab === 'missions' && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b px-6 py-4 gap-4">
              <h3 className="text-lg font-medium text-gray-900">Missions Freelance ({missions.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <DataTable
                data={missions}
                columns={[
                  { key: 'mission.title', label: 'Titre', format: (v, row) => row.mission?.title || 'N/A' },
                  { key: 'mission.price', label: 'Prix', format: (v, row) => `${row.mission?.price || 0} XOF` },
                  { key: 'status', label: 'Statut' },
                  { key: 'created_at', label: 'Date', format: (v) => new Date(v).toLocaleDateString() },
                ]}
                actions={(m) => {
                  const actions = [];
                  if (m.status === 'in_progress') {
                    actions.push({ label: 'Livrer', onClick: () => handleDeliverMission(m) });
                  }
                  if (m.delivery_file_url) {
                    actions.push({
                      label: 'Télécharger',
                      onClick: () => window.open(m.delivery_file_url, '_blank'),
                    });
                  }
                  return actions;
                }}
              />
            </div>
          </section>
        )}
      </main>

      {/* ====== Modales globales ====== */}
      {infoModal.open && <InfoModal open={infoModal.open} onClose={() => setInfoModal({ open: false, message: '' })} message={infoModal.message} />}
      {errorModal.open && <ErrorModal open={errorModal.open} onClose={() => setErrorModal({ open: false, message: '' })} message={errorModal.message} />}
      {deleteModal.open && (
        <DeleteConfirmModal
          open={deleteModal.open}
          onConfirm={deleteModal.onConfirm}
          onCancel={() => setDeleteModal({ open: false, item: null, onConfirm: null })}
        />
      )}
      {transactionModal.open && (
        <TransactionDetailsModal
          open={transactionModal.open}
          onClose={() => setTransactionModal({ open: false, transactionId: null })}
          transactionId={transactionModal.transactionId}
        />
      )}
      {productModal.open && (
        <ProductModal
          isOpen={productModal.open}
          onClose={() => setProductModal({ open: false, product: null })}
          product={productModal.product}
          onSaved={() => {
            fetchMyProducts();
            fetchUserStats();
          }}
        />
      )}
      {serviceModal.open && (
        <ServiceModal
          isOpen={serviceModal.open}
          onClose={() => setServiceModal({ open: false, service: null })}
          service={serviceModal.service}
        />
      )}
      {withdrawalModal.open && (
        <WithdrawalModal
          open={withdrawalModal.open}
          onClose={() => setWithdrawalModal({ open: false, walletBalance: 0 })}
          walletBalance={withdrawalModal.walletBalance}
          onSuccess={() => {
            fetchUserStats();
            setInfoModal({ open: true, message: 'Retrait effectué avec succès 💸' });
          }}
        />
      )}
    </div>
  );
};

export default SellerDashboard;