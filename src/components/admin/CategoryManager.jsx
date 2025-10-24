import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CategoryModal from './CategoryModal';
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
import { Edit, Delete, Add } from '@mui/icons-material';

/**
 * Composant de gestion des catégories (Admin)
 * Utilise les endpoints CATEGORIES.BASE et CATEGORIES.BY_ID
 * Relation frontend-backend: 
 * - GET /categories → Liste des catégories
 * - POST /categories → Création catégorie  
 * - PUT /categories/:id → Modification catégorie
 * - DELETE /categories/:id → Suppression catégorie
 */
const CategoryManager = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔄 Récupération des catégories - Utilise CATEGORIES.BASE
  const { 
    data: categories = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.all(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // 🗑️ Mutation suppression - Utilise CATEGORIES.BY_ID
  const deleteMutation = useMutation({
    mutationFn: (id) => categoriesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      // 🎯 Réinitialisation après suppression
      setSelectedCategory(null);
    },
  });

  const handleDelete = (category) => {
    if (window.confirm(`Supprimer la catégorie "${category.name}" ?`)) {
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

  if (isLoading) return (
    <Box display="flex" justifyContent="center" p={3}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Alert severity="error" sx={{ m: 2 }}>
      Erreur lors du chargement des catégories: {error.message}
    </Alert>
  );

  return (
    <Box p={3}>
      <Card elevation={3}>
        <Box p={3}>
          {/* En-tête avec bouton création */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Gestion des Catégories
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={handleCreate}
            >
              Nouvelle Catégorie
            </Button>
          </Box>

          {/* Tableau des catégories */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nom</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Produits</strong></TableCell>
                  <TableCell><strong>Statut</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {category.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {category.description || 'Aucune description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${category.product_count || 0} produits`}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={category.is_active ? 'Active' : 'Inactive'}
                        color={category.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(category)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(category)}
                        size="small"
                        disabled={deleteMutation.isLoading}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Message si aucune catégorie */}
          {categories.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                Aucune catégorie créée
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<Add />}
                onClick={handleCreate}
                sx={{ mt: 2 }}
              >
                Créer la première catégorie
              </Button>
            </Box>
          )}
        </Box>
      </Card>

       //Pour édité les catégories. 
<CategoryModal 
  open={showModal}
  onClose={() => setShowModal(false)}
  category={selectedCategory}
/>
    </Box>
  );
};

export default CategoryManager;