import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Typography
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';

/**
 * Modal automatique de création/édition des catégories
 * Fonctionnalités automatiques :
 * - Pré-remplissage des champs en mode édition
 * - Validation automatique des données
 * - Gestion automatique des états (loading, error, success)
 * - Réinitialisation automatique après succès
 * - Fermeture automatique après action
 */
const CategoryModal = ({ open, onClose, category = null }) => {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(category);
  
  // État automatique du formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  // État automatique des erreurs
  const [errors, setErrors] = useState({});

  // Réinitialisation automatique à l'ouverture
  useEffect(() => {
    if (open) {
      if (isEditMode && category) {
        // Mode édition : pré-remplissage automatique
        setFormData({
          name: category.name || '',
          description: category.description || '',
          is_active: category.is_active !== undefined ? category.is_active : true
        });
      } else {
        // Mode création : réinitialisation automatique
        setFormData({
          name: '',
          description: '',
          is_active: true
        });
      }
      setErrors({});
    }
  }, [open, isEditMode, category]);

  // Mutation automatique pour création/édition
  const mutation = useMutation({
    mutationFn: (data) => 
      isEditMode 
        ? categoriesAPI.update(category.id, data)
        : categoriesAPI.create(data),
    onSuccess: () => {
      // Invalidation automatique du cache
      queryClient.invalidateQueries(['categories']);
      // Fermeture automatique après succès
      onClose();
      // Réinitialisation automatique du formulaire
      setFormData({ name: '', description: '', is_active: true });
      setErrors({});
    },
    onError: (error) => {
      // Gestion automatique des erreurs de validation
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.error || 'Une erreur est survenue' });
      }
    }
  });

  // Validation automatique des champs
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la catégorie est obligatoire';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'La description ne doit pas dépasser 500 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission automatique avec validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  // Gestion automatique des changements de champs
  const handleChange = (field) => (e) => {
    const value = field === 'is_active' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Suppression automatique de l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Annulation automatique avec confirmation si modifications
  const handleCancel = () => {
    const hasChanges = isEditMode 
      ? formData.name !== category.name || 
        formData.description !== category.description || 
        formData.is_active !== category.is_active
      : formData.name !== '' || formData.description !== '';
    
    if (!hasChanges || window.confirm('Annuler les modifications ?')) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      {/* En-tête automatique selon le mode */}
      <DialogTitle>
        <Typography variant="h6" component="h2">
          {isEditMode ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </Typography>
        {isEditMode && (
          <Typography variant="body2" color="textSecondary">
            ID: {category.id}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Affichage automatique des erreurs générales */}
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          {/* Champ nom avec validation automatique */}
          <TextField
            autoFocus
            label="Nom de la catégorie"
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            error={Boolean(errors.name)}
            helperText={errors.name || 'Nom unique de la catégorie'}
            margin="normal"
            required
          />

          {/* Champ description avec compteur automatique */}
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange('description')}
            error={Boolean(errors.description)}
            helperText={
              errors.description || 
              `${formData.description.length}/500 caractères - Optionnel`
            }
            margin="normal"
            inputProps={{ maxLength: 500 }}
          />

          {/* Switch statut avec état automatique */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={handleChange('is_active')}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1">
                  Catégorie {formData.is_active ? 'active' : 'inactive'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formData.is_active 
                    ? 'Visible par tous les utilisateurs' 
                    : 'Masquée dans les listes'
                  }
                </Typography>
              </Box>
            }
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        {/* Bouton annulation avec protection automatique */}
        <Button 
          onClick={handleCancel}
          startIcon={<Cancel />}
          disabled={mutation.isLoading}
        >
          Annuler
        </Button>
        
        {/* Bouton sauvegarde avec état automatique */}
        <Button 
          type="submit"
          variant="contained"
          startIcon={mutation.isLoading ? <CircularProgress size={16} /> : <Save />}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading 
            ? 'Sauvegarde...' 
            : isEditMode ? 'Modifier' : 'Créer'
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryModal;