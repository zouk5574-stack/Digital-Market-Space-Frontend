import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, 
  Button, 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Add, Category } from '@mui/icons-material';
import CategoryModal from './CategoryModal';

/**
 * Composant de gestion des catégories (Admin) - Version complète
 * Intégration totale avec le modal automatique
 */
const CategoryManager = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔄 Récupération des catégories
  const { 
    data: categories = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.all(),
    staleTime: 5 * 60 * 1000,
  });

  // 🗑️ Mutation suppression
  const deleteMutation = useMutation({
    mutationFn: (id) => categoriesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      setSelectedCategory(null);
    },
  });

  const handleDelete = (category) => {
    if (window.confirm(`Supprimer la catégorie "${category.name}" ? Cette action est irréversible.`)) {
      deleteMutation.mutate(category.id);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  // Statistiques automatiques
  const stats = {
    total: categories.length,
    active: categories.filter(cat => cat.is_active).length,
    inactive: categories.filter(cat => !cat.is_active).length,
  };

  if (isLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <Box textAlign="center">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des catégories...
        </Typography>
      </Box>
    </Box>
  );

  if (error) return (
    <Box p={3}>
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Réessayer
          </Button>
        }
      >
        Erreur lors du chargement des catégories: {error.message}
      </Alert>
    </Box>
  );

  return (
    <Box p={3}>
      {/* En-tête avec statistiques */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
            Gestion des Catégories
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {stats.total} catégories • {stats.active} actives • {stats.inactive} inactives
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleCreate}
          size="large"
        >
          Nouvelle Catégorie
        </Button>
      </Box>

      {/* Tableau des catégories */}
      <Card elevation={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Produits</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Création</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow 
                  key={category.id} 
                  hover
                  sx={{ 
                    opacity: category.is_active ? 1 : 0.7,
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {category.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 300 }}>
                      {category.description || 'Aucune description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${category.product_count || 0} produits`}
                      variant="outlined"
                      size="small"
                      color={category.product_count > 0 ? "primary" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={category.is_active ? 'Active' : 'Inactive'}
                      color={category.is_active ? 'success' : 'default'}
                      size="small"
                      variant={category.is_active ? "filled" : "outlined"}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="textSecondary">
                      {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(category)}
                        size="small"
                        title="Modifier"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(category)}
                        size="small"
                        disabled={deleteMutation.isLoading || (category.product_count || 0) > 0}
                        title={
                          (category.product_count || 0) > 0 
                            ? "Impossible de supprimer une catégorie avec des produits" 
                            : "Supprimer"
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Message si aucune catégorie */}
        {categories.length === 0 && (
          <Box textAlign="center" py={6}>
            <Category sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Aucune catégorie créée
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Commencez par créer votre première catégorie pour organiser vos produits.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={handleCreate}
              size="large"
            >
              Créer la première catégorie
            </Button>
          </Box>
        )}
      </Card>

      {/* Modal de création/édition */}
      <CategoryModal 
        open={showModal}
        onClose={handleModalClose}
        category={selectedCategory}
      />

      {/* Indicateur de suppression */}
      {deleteMutation.isLoading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Suppression de la catégorie en cours...
        </Alert>
      )}
    </Box>
  );
};

export default CategoryManager;