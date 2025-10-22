import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  useAdminApi, 
  useStatsApi, 
  useWalletApi, 
  useProductsApi, 
  useWithdrawalsApi,
  usePaymentProvidersApi,
  useFedapayApi,
  useFreelanceApi 
} from '../../hooks/useApi';

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
  const [activeTab, setActiveTab] = useState('overview');

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

  // Hooks API
  const { actions: adminActions, states: adminStates } = useAdminApi();
  const { actions: statsActions, states: statsStates } = useStatsApi();
  const { actions: walletActions, states: walletStates } = useWalletApi();
  const { actions: productActions, states: productStates } = useProductsApi();
  const { actions: withdrawalActions, states: withdrawalStates } = useWithdrawalsApi();
  const { actions: paymentActions, states: paymentStates } = usePaymentProvidersApi();
  const { actions: fedapayActions, states: fedapayStates } = useFedapayApi();
  const { actions: freelanceActions, states: freelanceStates } = useFreelanceApi();

  // Chargement initial
  useEffect(() => {
    statsActions.getAdminStats();
    adminActions.listUsers();
    adminActions.listWithdrawals();
    walletActions.getBalance();
    productActions.getMyProducts();
    paymentActions.getActiveProvider();
  }, []);

  // ================= Gestion Produits =================
  const handleOpenProductModal = (product = null) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productActions.updateProduct(editingProduct.id, productData);
      } else {
        await productActions.createProduct(productData);
      }
      productActions.getMyProducts();
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
          await productActions.deleteProduct(productId);
          productActions.getMyProducts();
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
      await fedapayActions.setKeys(keys);
      setShowFedapayModal(false);
      paymentActions.getActiveProvider();
      setShowInfoModal({ open: true, title: 'Succès', message: 'Clés Fedapay sauvegardées' });
    } catch (error) {
      console.error(error);
      setShowErrorModal({ open: true, title: 'Erreur', message: 'Impossible de sauvegarder les clés Fedapay' });
    }
  };

  // ================= Commission =================
  const handleSaveCommission = async (newRate) => {
    try {
      await adminActions.updateCommission(newRate);
      setShowCommissionModal(false);
      statsActions.getAdminStats();
      setShowInfoModal({ open: true, title: 'Succès', message: 'Commission mise à jour' });
    } catch (error) {
      console.error(error);
      setShowErrorModal({ open: true, title: 'Erreur', message: 'Impossible de sauvegarder la commission' });
    }
  };

  // ================== Loader Global ==================
  if (statsStates.adminStats.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  // ================== Données ==================
  const stats = statsStates.adminStats.data?.stats || {};
  const users = adminStates.users.data || [];
  const withdrawals = adminStates.withdrawals.data || [];
  const walletBalance = walletStates.balance.data?.wallet?.balance || 0;
  const products = productStates.products.data || [];
  const paymentProvider = paymentStates.activeProvider.data?.provider || {};

  return (
    <DashboardLayout menuItems={menuItems}>
      {/* === Ici tu peux ajouter ton contenu principal du dashboard === */}
      <h1 className="text-2xl font-bold mb-6">Bienvenue sur le tableau admin</h1>
      {/* Ex : Stats, Users, Produits, Retraits, etc. */}
      
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

      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        walletBalance={walletBalance}
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
        onSave={() => { /* rafraîchir la liste des services si nécessaire */ }}
        service={showServiceModal.service}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;