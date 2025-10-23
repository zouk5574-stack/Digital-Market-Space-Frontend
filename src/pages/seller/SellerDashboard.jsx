// src/pages/seller/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/dashboard/StatsCard';
import DataTable from '../../components/dashboard/DataTable';
import InfoModal from '../../components/ui/InfoModal';
import ErrorModal from '../../components/ui/ErrorModal';
import DeleteConfirmModal from '../../components/ui/DeleteConfirmModal';
import TransactionDetailsModal from '../../components/admin/TransactionDetailsModal';
import ServiceModal from '../../components/modals/ServiceModal';
import WithdrawalModal from '../../components/admin/WithdrawalModal';
import { productsAPI, ordersAPI, freelanceAPI, withdrawalsAPI, statsAPI } from '../../services/api';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // ----- Modals -----
  const [infoModal, setInfoModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null, onConfirm: null });
  const [transactionModal, setTransactionModal] = useState({ open: false, transactionId: null });
  const [serviceModal, setServiceModal] = useState({ open: false, service: null });
  const [withdrawalModal, setWithdrawalModal] = useState({ open: false, walletBalance: 0 });

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

  // ----- Filtrage Missions -----
  const pendingApplications = applications.filter(app => ['open', 'pending_payment'].includes(app.mission?.status));
  const activeMissions = missions.filter(m => m.status === 'in_progress');
  const completedMissions = missions.filter(m => ['completed', 'awaiting_validation'].includes(m.status));

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
      }
    });
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
              onClick={() => setServiceModal({ open: true, service: null })}
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
              { key: 'applications', label: 'Mes Candidatures' }
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

      {/* ====== Contenu Principal ====== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* ----- Vue Générale ----- */}
        {activeTab === 'overview' && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Produits Actifs" value={products.length} icon="📦" color="blue" />
            <StatsCard title="Ventes Totales" value={stats.salesCount || 0} icon="💰" color="green" />
            <StatsCard title="Gains Nets" value={`${stats.totalSellerEarnings || 0} XOF`} icon="🎯" color="purple" />
            <StatsCard title="Missions Actives" value={missions.filter(m => m.status === 'in_progress').length} icon="⚡" color="orange" />
            <StatsCard title="Missions Terminées" value={missions.filter(m => m.status === 'completed').length} icon="✅" color="emerald" />
            <StatsCard title="Candidatures" value={applications.length} icon="📝" color="yellow" />
          </section>
        )}

        {/* ----- Mes Produits ----- */}
        {activeTab === 'products' && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b px-6 py-4 gap-4">
              <h3 className="text-lg font-medium text-gray-900">
                Mes Produits ({products.length})
              </h3>
              <Button onClick={() => setServiceModal({ open: true, service: null })}>+ Ajouter Produit</Button>
            </div>

            <div className="overflow-x-auto">
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
                  { label: 'Modifier', onClick: p => setServiceModal({ open: true, service: p }) },
                  { label: 'Supprimer', onClick: handleDeleteProduct },
                ]}
              />
            </div>
          </section>
        )}

        {/* ----- Mes Missions Freelance ----- */}
        {activeTab === 'missions' && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-medium text-gray-900">
                Mes Missions ({missions.length})
              </h3>
              <Button variant="secondary" onClick={fetchMyMissions}>
                🔄 Rafraîchir
              </Button>
            </div>

            <div className="overflow-x-auto">
              <DataTable
                data={missions}
                columns={[
                  { key: 'title', label: 'Titre' },
                  { key: 'budget', label: 'Budget', format: v => `${v} XOF` },
                  { key: 'status', label: 'Statut' },
                  { key: 'created_at', label: 'Créée le', format: v => new Date(v).toLocaleDateString() },
                ]}
                actions={[
                  { label: 'Détails', onClick: m => setInfoModal({ open: true, message: `Mission: ${m.title}` }) },
                ]}
              />
            </div>
          </section>
        )}

        {/* ----- Mes Candidatures ----- */}
        {activeTab === 'applications' && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Mes Candidatures ({applications.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <DataTable
                data={applications}
                columns={[
                  { key: 'mission.title', label: 'Mission' },
                  { key: 'proposed_price', label: 'Prix Proposé', format: v => `${v} XOF` },
                  { key: 'mission.status', label: 'Statut Mission' },
                  { key: 'created_at', label: 'Date', format: v => new Date(v).toLocaleDateString() },
                ]}
                actions={[
                  { label: 'Voir Détails', onClick: a => setTransactionModal({ open: true, transactionId: a.id }) },
                ]}
              />
            </div>
          </section>
        )}

        {/* ----- Mes Ventes ----- */}
        {activeTab === 'sales' && (
          <section className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Mes Ventes ({sales.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <DataTable
                data={sales}
                columns={[
                  { key: 'order_id', label: 'Commande' },
                  { key: 'product_name', label: 'Produit' },
                  { key: 'amount', label: 'Montant', format: v => `${v} XOF` },
                  { key: 'status', label: 'Statut' },
                  { key: 'created_at', label: 'Date', format: v => new Date(v).toLocaleDateString() },
                ]}
                actions={[
                  { label: 'Détails', onClick: s => setTransactionModal({ open: true, transactionId: s.id }) },
                ]}
              />
            </div>
          </section>
        )}
      </main>


{/* ====== Modales globales ====== */}

      {/* InfoModal */}
      {infoModal.open && (
        <InfoModal
          open={infoModal.open}
          onClose={() => setInfoModal({ open: false, message: '' })}
          message={infoModal.message}
        />
      )}

      {/* ErrorModal */}
      {errorModal.open && (
        <ErrorModal
          open={errorModal.open}
          onClose={() => setErrorModal({ open: false, message: '' })}
          message={errorModal.message}
        />
      )}

      {/* DeleteConfirmModal */}
      {deleteModal.open && (
        <DeleteConfirmModal
          open={deleteModal.open}
          onConfirm={() => {
            handleDeleteProduct(deleteModal.productId);
            setDeleteModal({ open: false, productId: null });
          }}
          onCancel={() => setDeleteModal({ open: false, productId: null })}
        />
      )}

      {/* TransactionDetailsModal */}
      {transactionModal.open && (
        <TransactionDetailsModal
          open={transactionModal.open}
          onClose={() => setTransactionModal({ open: false, transactionId: null })}
          transactionId={transactionModal.transactionId}
        />
      )}

      {/* ServiceModal (ajout / édition produit) */}
      {serviceModal.open && (
        <ServiceModal
          open={serviceModal.open}
          onClose={() => setServiceModal({ open: false, service: null })}
          service={serviceModal.service}
          onSaved={() => {
            fetchMyProducts();
            fetchSellerStats();
          }}
        />
      )}

      {/* WithdrawalModal (retrait) */}
      {withdrawalModal.open && (
        <WithdrawalModal
          open={withdrawalModal.open}
          onClose={() => setWithdrawalModal({ open: false, walletBalance: 0 })}
          walletBalance={withdrawalModal.walletBalance}
          onSuccess={() => {
            fetchSellerStats();
            setInfoModal({ open: true, message: 'Retrait effectué avec succès 💸' });
          }}
        />
      )}
    </div>
  );
};

export default SellerDashboard;

