// src/components/modals/ServiceModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from './ModalBase'; // Un composant de modal générique (ou remplace par ton propre modal)
import Button from '../ui/Button';
import { useProductsApi, useFreelanceApi } from '../../hooks/useApi';

const ServiceModal = ({ isOpen, onClose, service }) => {
  const isEditing = !!service?.id; // true si modification
  const isMission = !!service?.mission; // true si c'est une candidature freelance

  const { actions: productActions } = useProductsApi();
  const { actions: freelanceActions } = useFreelanceApi();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    files: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isMission) {
        // Pré-remplir pour une mission freelance
        setForm({
          name: service.mission.title || '',
          description: service.mission.description || '',
          price: service.proposed_price || '',
          category: '',
          files: null,
        });
      } else if (isEditing) {
        // Pré-remplir pour modification produit
        setForm({
          name: service.name || '',
          description: service.description || '',
          price: service.price || '',
          category: service.category || '',
          files: null,
        });
      } else {
        // Nouveau produit
        setForm({ name: '', description: '', price: '', category: '', files: null });
      }
    }
  }, [isOpen, service]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm((f) => ({ ...f, [name]: files[0] }));
    else setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isMission) {
        // Soumettre la livraison de mission freelance
        await freelanceActions.deliverWork(service.id, form.files);
      } else if (isEditing) {
        await productActions.updateProduct(service.id, form);
      } else {
        await productActions.createProduct(form);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isMission ? 'Livrer Mission' : isEditing ? 'Modifier Produit' : 'Nouveau Produit'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isMission && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prix (XOF)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fichier / Image</label>
              <input
                type="file"
                name="files"
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            </div>
          </>
        )}

        {isMission && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Fichier de livraison</label>
            <input
              type="file"
              name="files"
              onChange={handleChange}
              required
              className="mt-1 block w-full"
            />
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'En cours...' : isMission ? 'Livrer' : isEditing ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ServiceModal;