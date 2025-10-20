import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const MissionModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.budget) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }
    onCreate(formData);
    setFormData({ title: '', description: '', budget: '', category: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📝 Créer une nouvelle mission
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de la mission
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ex : Création de logo professionnel"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    rows="4"
                    placeholder="Décrivez les détails de votre mission..."
                    required
                  ></textarea>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (en XOF)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ex : 50000"
                    min="1000"
                    required
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  >
                    <option value="">-- Sélectionnez une catégorie --</option>
                    <option value="design">Design & Graphisme</option>
                    <option value="developpement">Développement Web</option>
                    <option value="rédaction">Rédaction & Traduction</option>
                    <option value="marketing">Marketing Digital</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3 pt-3">
                  <Button variant="secondary" onClick={onClose} type="button">
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit">
                    Créer la mission
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MissionModal;