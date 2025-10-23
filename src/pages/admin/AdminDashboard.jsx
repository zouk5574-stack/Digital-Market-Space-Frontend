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
import PlatformSettingsModal from '../../components/admin/PlateformSettingsModal';
import TransactionDetailsModal from '../../components/admin/TransactionDetailsModal';
import DeleteConfirmModal from '../../components/ui/DeleteConfirmModal';
import ServiceModal from '../../components/modals/ServiceModal';

const menuItems = [
  { name: 'Tableau de bord', path: '/admin/dashboard' },
  { name: 'Utilisateurs', path: '/admin/users' },
  { name: 'Produits', path: '/admin/products' },
  { name: 'Commandes', path: '/admin/orders' },
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [products, setProducts] = useState([]);
  const [paymentProvider, setPaymentProvider] = useState({});

  // Modals States
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showFedapayModal, setShowFedapayModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState({ open: false, title: '', message: '' });
  const [showErrorModal, setShowErrorModal] = useState({ open: false, title: '', message: '' });
  const [showPlatformSettingsModal, setShowPlatformSettingsModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState({ open: false, transactionId: null });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ open: false, onConfirm: null, message: '' });
  const [showServiceModal, setShowServiceModal] = useState({ open: false, service: null });

// ================= Chargement initial =================
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, withdrawalsRes, productsRes, providerRes] = await Promise.all([
        statsAPI.admin(),
        adminAPI.users.list(),
        adminAPI.withdrawals.list(),
        productsAPI.my(),
        providersAPI.active()
      ]);

      setStats(statsRes.data || {});
      setUsers(usersRes.data || []);
      setWithdrawals(withdrawalsRes.data || []);
      setProducts(productsRes.data || []);
      setPaymentProvider(providerRes.data?.provider || {});
      setWalletBalance(0); // Remplacer par le vrai endpoint si disponible
    } catch (error) {
      console.error(error);
      setShowErrorModal({ open: true, title: 'Erreur', message: 'Impossible de charger les données' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // ================= Gestion Produits =================
  const handleOpenProductModal = (product = null) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
      } else {
        await productsAPI.create(productData);
      }
      const updatedProducts = await productsAPI.my();
      setProducts(updatedProducts.data);
      setShowProductModal(false);
      setEditingProduct(null);
      setShowInfoModal({ open: true, title: 'Succès', message: 'Produit sauvegardé avec succès' });
    } catch (error) {
      console.error(error);
      setShowErrorModal({ open: true, title: 'Erreur', message: 'Impossible de sauvegarder le produit' });
    }
  };

  const handleDeleteProduct = (productId) => {
    setShowDeleteConfirm({
      open: true,
      message: 'Voulez-vous vraiment supprimer ce produit ?',
      onConfirm: async () => {
        try {
          await productsAPI.delete(productId);
          const updatedProducts = await productsAPI.my();
          setProducts(updatedProducts.data);
          setShowDeleteConfirm({ open: false, onConfirm: null, message: '' });
          setShowInfoModal({ open: true, title: 'Succès', message: 'Produit supprimé' });
        } catch (err) {
          console.error(err);
          setShowDeleteConfirm({ open: false, onConfirm: null, message: '' });
          setShowErrorModal({ open: true, title: 'Erreur', message: 'Impossible de supprimer le produit' });
        }
      }
    });
  };


// ================= Configuration Fedapay =================
  const handleSaveFedapayKeys = async (keys) => {
    try {
      await fedapayAPI.setKeys(keys);
      setShowFedapayModal(false);
      const providerRes = await providersAPI.active();
      setPaymentProvider(providerRes.data?.provider || {});
      setShowInfoModal({ open: true, title: 'Succès', message: 'Clés Fedapay sauvegardées' });
    } catch (error) {
      console.error(error);
      setShowErrorModal({ open: true, title: 'Erreur', message: 'Impossible de sauvegarder les clés Fedapay' });
    }
  };

  // ================= Commission =================
  const handleSaveCommission = async (newRate) => {
    try {
      await adminAPI.commission.update({ rate: newRate });
      setShowCommissionModal(false);
      const statsRes = await statsAPI.admin();
      setStats(statsRes.data);
      setShowInfoModal({ open: true, title: 'Succès', message: 'Commission mise à jour' });
    } catch (error) {
      console.error(error);
      setShowErrorModal({ open: true, title: 'Erreur', message: 'Impossible de sauvegarder la commission' });
    }
  };

// ================= Loader Global =================
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="large" />
    </div>
  );

  return (
    <DashboardLayout menuItems={menuItems}>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Admin</h1>

      {/* === Statistiques principales === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-blue-50 shadow rounded flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-blue-500 text-3xl mb-2">👤</span>
          <h3 className="text-gray-700 font-semibold mb-1">Utilisateurs</h3>
          <p className="text-2xl font-bold">{stats.totalUsers || users.length}</p>
        </div>
        <div className="p-6 bg-green-50 shadow rounded flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-green-500 text-3xl mb-2">📦</span>
          <h3 className="text-gray-700 font-semibold mb-1">Produits</h3>
          <p className="text-2xl font-bold">{stats.totalProducts || products.length}</p>
        </div>
        <div className="p-6 bg-yellow-50 shadow rounded flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-yellow-500 text-3xl mb-2">💰</span>
          <h3 className="text-gray-700 font-semibold mb-1">Retraits</h3>
          <p className="text-2xl font-bold">{withdrawals.length}</p>
        </div>
        <div className="p-6 bg-purple-50 shadow rounded flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-purple-500 text-3xl mb-2">🏦</span>
          <h3 className="text-gray-700 font-semibold mb-1">Wallet</h3>
          <p className="text-2xl font-bold">{walletBalance} XOF</p>
        </div>
      </div>

      {/* === Utilisateurs === */}
      <h2 className="text-2xl font-semibold mb-4">Utilisateurs</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
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

      {/* === Produits === */}
      <h2 className="text-2xl font-semibold mb-4">Produits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {products.map(p => (
          <div key={p.id} className="p-4 bg-white shadow rounded flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <h3 className="font-bold text-lg mb-1">{p.name}</h3>
              <p className="text-gray-600">Prix : {p.price} XOF</p>
              <p className="text-gray-500 text-sm">Stock : {p.stock || 'N/A'}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => handleOpenProductModal(p)} className="flex-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Modifier</button>
              <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      {/* === Retraits en attente === */}
      <h2 className="text-2xl font-semibold mb-4">Retraits en attente</h2>
      <ul className="mb-8 space-y-2">
        {withdrawals.map(w => (
          <li key={w.id} className="p-3 bg-gray-50 rounded flex justify-between items-center shadow-sm hover:bg-gray-100 transition-colors">
            <span>{w.user_name} - {w.amount} XOF</span>
            <span className="text-sm text-gray-500">{new Date(w.created_at).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>

{/* === Modals === */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      <FedapayConfigModal
        isOpen={showFedapayModal}
        onClose={() => setShowFedapayModal(false)}
        onSave={handleSaveFedapayKeys}
        currentKeys={paymentProvider}
      />

      <CommissionSettingsModal
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        currentRate={stats.commissionRate || 10}
        onSave={handleSaveCommission}
      />

      <InfoModal
        isOpen={showInfoModal.open}
        onClose={() => setShowInfoModal({ open: false, title: '', message: '' })}
        title={showInfoModal.title}
        message={showInfoModal.message}
      />

      <ErrorModal
        isOpen={showErrorModal.open}
        onClose={() => setShowErrorModal({ open: false, title: '', message: '' })}
        title={showErrorModal.title}
        message={showErrorModal.message}
      />

      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        walletBalance={walletBalance}
      />

      <PlatformSettingsModal
        isOpen={showPlatformSettingsModal}
        onClose={() => setShowPlatformSettingsModal(false)}
      />

      <TransactionDetailsModal
        isOpen={showTransactionModal.open}
        onClose={() => setShowTransactionModal({ open: false, transactionId: null })}
        transactionId={showTransactionModal.transactionId}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm.open}
        onClose={() => setShowDeleteConfirm({ open: false, onConfirm: null, message: '' })}
        onConfirm={showDeleteConfirm.onConfirm}
        message={showDeleteConfirm.message}
      />

      <ServiceModal
        isOpen={showServiceModal.open}
        onClose={() => setShowServiceModal({ open: false, service: null })}
        onSave={() => fetchInitialData()}
        service={showServiceModal.service}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
