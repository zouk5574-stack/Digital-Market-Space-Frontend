import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useProductsApi } from '../../hooks/useApi';

const ProductModal = ({ isOpen, onClose, product = null }) => {
  const { actions: productActions } = useProductsApi();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price || '');
      setCategory(product.category || '');
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
    }
  }, [product, isOpen]);

  const handleSave = async () => {
    if (!name || !price) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      if (product) {
        await productActions.updateProduct(product.id, { name, description, price: Number(price), category });
      } else {
        await productActions.createProduct({ name, description, price: Number(price), category });
      }
      await productActions.getMyProducts(); // rafraîchit la liste
      onClose();
    } catch (err) {
      console.error('Erreur sauvegarde produit:', err);
      alert('Impossible de sauvegarder le produit.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {product ? 'Modifier Produit' : 'Ajouter Nouveau Produit'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (XOF)*</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={saving}>Annuler</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Sauvegarde...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;