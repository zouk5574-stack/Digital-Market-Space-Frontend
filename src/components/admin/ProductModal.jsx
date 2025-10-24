import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { productsAPI, filesAPI } from '../../services/api'; // ✅ Correction : import direct

const ProductModal = ({ isOpen, onClose, product = null, onProductSaved }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const nameInputRef = useRef(null);

  // Charger ou reset produit
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price || '');
      setCategory(product.category || '');
      setFiles(product.files || []);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setFiles([]);
    }
  }, [product, isOpen]);

  // Focus sur nom
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  // Gestion des fichiers
  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (!selectedFiles.length) return;

    setUploading(true);
    try {
      const uploadedFiles = [];
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await filesAPI.upload(formData);
        uploadedFiles.push(res.data);
      }
      setFiles((prev) => [...prev, ...uploadedFiles]);
    } catch (err) {
      console.error('Erreur upload fichier:', err);
      alert('Impossible de télécharger certains fichiers.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (fileId) => {
    setFiles((prev) => prev.filter(f => f.id !== fileId));
  };

  const handleSave = async () => {
    if (!name || !price) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const productData = { 
        name, 
        description, 
        price: Number(price), 
        category, 
        files: files.map(f => f.id) // ✅ Envoi seulement les IDs des fichiers
      };

      if (product) {
        // ✅ Correction : utilisation de l'API directe
        await productsAPI.update(product.id, productData);
      } else {
        await productsAPI.create(productData);
      }

      if (onProductSaved) {
        onProductSaved();
      }
      onClose();
    } catch (err) {
      console.error('Erreur sauvegarde produit:', err);
      alert('Impossible de sauvegarder le produit.');
    } finally {
      setSaving(false);
    }
  };

  // Detect escape key pour fermer
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl p-6 overflow-y-auto max-h-[90vh]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              {product ? 'Modifier Produit' : 'Ajouter Nouveau Produit'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
                <input
                  type="text"
                  value={name}
                  ref={nameInputRef}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nom du produit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Description du produit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (XOF)*</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Electronique"
                />
              </div>

              {/* Upload de fichiers avec miniatures */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fichiers</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-600"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">Téléchargement en cours...</p>}

                {files.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                    {files.map((f) => (
                      <div key={f.id} className="relative border rounded p-1 flex flex-col items-center justify-center text-center text-xs">
                        {f.url?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                          <img src={f.url} alt={f.name} className="w-full h-16 object-cover rounded" />
                        ) : (
                          <span className="truncate">{f.name}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(f.id)}
                          className="absolute top-0 right-0 text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
              <Button variant="secondary" onClick={onClose} disabled={saving || uploading}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={saving || uploading}>
                {saving ? <span className="animate-pulse">Sauvegarde...</span> : 'Enregistrer'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;