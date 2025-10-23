import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminAPI, statsAPI, withdrawalsAPI, productsAPI, providersAPI, fedapayAPI } from '../../services/api';
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
      // TODO: récupérer solde wallet si endpoint disponible
      setWalletBalance(0);
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

  // ================== Loader Global ==================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems}>
      <h1 className="text-2xl font-bold mb-6">Bienvenue sur le tableau admin</h1>
      {/* Ici tu peux mapper users, products, withdrawals, stats pour affichage */}
      
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