import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminAPI, statsAPI, productsAPI, providersAPI, fedapayAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';
import ProductModal from '../../components/admin/ProductModal';
import FedapayConfigModal from '../../components/admin/FedapayConfigModal';
import CommissionSettingsModal from '../../components/admin/CommissionSettingsModal';
import InfoModal from '../../components/ui/InfoModal';
import ErrorModal from '../../components/ui/ErrorModal';
import WithdrawalModal from '../../components/admin/WithdrawalModal';
import PlatformSettingsModal from '../../components/admin/PlatformSettingsModal';
import TransactionDetailsModal from '../../components/admin/TransactionDetailsModal';
import DeleteConfirmModal from '../../components/ui/DeleteConfirmModal';
import ServiceModal from '../../components/modals/ServiceModal';

// ➕ AJOUTEZ CET IMPORT :
import ProductList from '../../components/products/ProductList';
import toast from 'react-hot-toast';

const menuItems = [
  { name: 'Tableau de bord', path: '/admin/dashboard' },
  { name: 'Utilisateurs', path: '/admin/users' },
  { name: 'Produits', path: '/admin/products' },
  { name: 'Commandes', path: '/admin/orders' },
  { name: 'Boutique', path: '/admin/boutique' }, // ➕ AJOUTEZ CET ONGLET
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // ➕ AJOUTEZ LA GESTION DES ONGLETS
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentProvider, setPaymentProvider] = useState({});

  // ----- Modals States -----
  const [infoModal, setInfoModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, message: '', onConfirm: null });
  const [productModal, setProductModal] = useState({ isOpen: false, product: null });
  const [fedapayModal, setFedapayModal] = useState(false);
  const [commissionModal, setCommissionModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [platformSettingsModal, setPlatformSettingsModal] = useState(false);
  const [transactionModal, setTransactionModal] = useState({ isOpen: false, transactionId: null });
  const [serviceModal, setServiceModal] = useState({ isOpen: false, service: null });

  // ==================== Chargement initial ====================
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes, withdrawalsRes, providerRes] = await Promise.all([
        statsAPI.admin(),
        adminAPI.users.list(),
        productsAPI.my(), // ➕ CHANGEZ ICI : admin voit uniquement SES produits
        adminAPI.withdrawals.list(),
        providersAPI.active(),
      ]);

      setStats(statsRes.data || {});
      setUsers(usersRes.data?.users || usersRes.data || []);
      setProducts(productsRes.data?.products || productsRes.data || []);
      setWithdrawals(withdrawalsRes.data?.withdrawals || withdrawalsRes.data || []);
      setPaymentProvider(providerRes.data || {});
      setWalletBalance(statsRes.data?.platform_balance || 0);
    } catch (err) {
      console.error(err);
      toast.error('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // ==================== Gestion Produits ====================
  const openProductModal = (product = null) => setProductModal({ isOpen: true, product });
  const saveProduct = async (data) => {
    try {
      if (productModal.product) {
        await productsAPI.update(productModal.product.id, data);
      } else {
        await productsAPI.create(data);
      }
      await fetchInitialData();
      setProductModal({ isOpen: false, product: null });
      toast.success('Produit sauvegardé avec succès');
    } catch (err) {
      console.error(err);
      toast.error('Impossible de sauvegarder le produit');
    }
  };

  const deleteProduct = (id) => {
    setDeleteConfirm({
      isOpen: true,
      message: 'Voulez-vous vraiment supprimer ce produit ?',
      onConfirm: async () => {
        try {
          await productsAPI.delete(id);
          setProducts(prev => prev.filter(p => p.id !== id));
          setDeleteConfirm({ isOpen: false, message: '', onConfirm: null });
          toast.success('Produit supprimé avec succès');
        } catch (err) {
          console.error(err);
          toast.error('Impossible de supprimer le produit');
        }
      },
    });
  };

  // ==================== Fedapay ====================
  const saveFedapayKeys = async (keys) => {
    try {
      await fedapayAPI.setKeys(keys);
      setFedapayModal(false);
      const providerRes = await providersAPI.active();
      setPaymentProvider(providerRes.data || {});
      toast.success('Clés Fedapay sauvegardées');
    } catch (err) {
      console.error(err);
      toast.error('Impossible de sauvegarder les clés');
    }
  };

  // ==================== Commission ====================
  const saveCommission = async (rate) => {
    try {
      await adminAPI.commission.update({ commission_rate: rate });
      setCommissionModal(false);
      await fetchInitialData();
      toast.success('Commission mise à jour');
    } catch (err) {
      console.error(err);
      toast.error('Impossible de sauvegarder la commission');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader size="large" /></div>;

  return (
    <DashboardLayout menuItems={menuItems}>
      {/* ➕ AJOUTEZ LA NAVIGATION PAR ONGLETS */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Tableau de bord' },
            { id: 'boutique', name: 'Boutique' },
          ].map(tab => (
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

      {/* === ONGLET TABLEAU DE BORD === */}
      {activeTab === 'dashboard' && (
        <>
          <h1 className="text-3xl font-bold mb-6">Tableau de bord Admin</h1>

          {/* === Stats === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Utilisateurs', value: stats.total_users || users.length, icon: '👤', color: 'blue' },
              { label: 'Produits', value: stats.total_products || products.length, icon: '📦', color: 'green' },
              { label: 'Retraits', value: withdrawals.length, icon: '💰', color: 'yellow' },
              { label: 'Wallet', value: `${walletBalance} XOF`, icon: '🏦', color: 'purple' },
            ].map((s, i) => (
              <div key={i} className={`p-6 bg-${s.color}-50 shadow rounded flex flex-col items-center hover:shadow-lg transition-shadow`}>
                <span className={`text-${s.color}-500 text-3xl mb-2`}>{s.icon}</span>
                <h3 className="text-gray-700 font-semibold mb-1">{s.label}</h3>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          {/* === Users Table === */}
          <h2 className="text-2xl font-semibold mb-4">Utilisateurs</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full table-auto border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {['ID','Nom','Email','Status'].map((h,i) => <th key={i} className="px-4 py-2">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-center">{u.id}</td>
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-white text-sm ${u.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                        {u.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* === Mes Produits (Admin) === */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Mes Produits ({products.length})</h2>
            <button 
              onClick={() => openProductModal()} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Nouveau Produit
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {products.map(p => (
              <div key={p.id} className="p-4 bg-white shadow rounded flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <h3 className="font-bold text-lg mb-1">{p.title || p.name}</h3>
                  <p className="text-gray-600">Prix : {p.price} XOF</p>
                  <p className="text-gray-500 text-sm">Stock : {p.stock || 'N/A'}</p>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button onClick={() => openProductModal(p)} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Modifier</button>
                  <button onClick={() => deleteProduct(p.id)} className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Supprimer</button>
                </div>
              </div>
            ))}
          </div>

          {/* === Retraits === */}
          <h2 className="text-2xl font-semibold mb-4">Retraits en attente</h2>
          <ul className="mb-8 space-y-2">
            {withdrawals.map(w => (
              <li key={w.id} className="p-3 bg-gray-50 rounded flex justify-between items-center shadow-sm hover:bg-gray-100 transition-colors">
                <span>{w.user_name} - {w.amount} XOF</span>
                <span className="text-sm text-gray-500">{new Date(w.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* === ONGLET BOUTIQUE === */}
      {activeTab === 'boutique' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Boutique Admin</h1>
              <p className="text-gray-600 mt-2">Gérez vos produits en vente</p>
            </div>
            <button 
              onClick={() => openProductModal()} 
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              + Nouveau Produit
            </button>
          </div>

          {/* ➕ INTÉGRATION DU ProductList INTELLIGENT */}
          <div className="bg-white rounded-lg shadow">
            <ProductList />
          </div>
        </div>
      )}

      {/* === Modals === */}
      <ProductModal 
        isOpen={productModal.isOpen} 
        onClose={() => setProductModal({ isOpen: false, product: null })} 
        onSave={saveProduct} 
        product={productModal.product} 
      />
      <FedapayConfigModal 
        isOpen={fedapayModal} 
        onClose={() => setFedapayModal(false)} 
        onSave={saveFedapayKeys} 
        currentKeys={paymentProvider} 
      />
      <CommissionSettingsModal 
        isOpen={commissionModal} 
        onClose={() => setCommissionModal(false)} 
        currentRate={stats.commission_rate || 10} 
        onSave={saveCommission} 
      />
      <InfoModal 
        isOpen={infoModal.isOpen} 
        onClose={() => setInfoModal({ isOpen: false, title: '', message: '' })} 
        title={infoModal.title} 
        message={infoModal.message} 
      />
      <ErrorModal 
        isOpen={errorModal.isOpen} 
        onClose={() => setErrorModal({ isOpen: false, title: '', message: '' })} 
        title={errorModal.title} 
        message={errorModal.message} 
      />
      <WithdrawalModal 
        isOpen={withdrawalModal} 
        onClose={() => setWithdrawalModal(false)} 
        walletBalance={walletBalance} 
      />
      <PlatformSettingsModal 
        isOpen={platformSettingsModal} 
        onClose={() => setPlatformSettingsModal(false)} 
      />
      <TransactionDetailsModal 
        isOpen={transactionModal.isOpen} 
        onClose={() => setTransactionModal({ isOpen: false, transactionId: null })} 
        transactionId={transactionModal.transactionId} 
      />
      <DeleteConfirmModal 
        isOpen={deleteConfirm.isOpen} 
        onClose={() => setDeleteConfirm({ isOpen: false, message: '', onConfirm: null })} 
        onConfirm={deleteConfirm.onConfirm} 
        message={deleteConfirm.message} 
      />
      <ServiceModal 
        isOpen={serviceModal.isOpen} 
        onClose={() => setServiceModal({ isOpen: false, service: null })} 
        onSave={fetchInitialData} 
        service={serviceModal.service} 
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;