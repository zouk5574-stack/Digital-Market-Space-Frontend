import React, { useState, useEffect } from 'react';
import { tagsAPI, categoriesAPI } from '../../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  Chip,
  TextField,
  Grid,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Add, Delete, Label, Category, Search } from '@mui/icons-material';

/**
 * Système complet de gestion des tags
 * Fonctionnalités :
 * - Création automatique de tags
 * - Association aux catégories
 * - Recherche et filtrage
 * - Gestion en temps réel
 */
const TagSystem = () => {
  const queryClient = useQueryClient();
  const [newTagName, setNewTagName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(null);

  // 🔄 Récupération des tags et catégories
  const { 
    data: tags = [], 
    isLoading: tagsLoading, 
    error: tagsError 
  } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsAPI.all(),
    staleTime: 5 * 60 * 1000,
  });

  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.all(),
    staleTime: 5 * 60 * 1000,
  });

  // ➕ Mutation création de tag
  const createMutation = useMutation({
    mutationFn: (tagData) => tagsAPI.create(tagData),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags']);
      setNewTagName('');
      setSelectedCategory('');
    },
  });

  // 🗑️ Mutation suppression de tag
  const deleteMutation = useMutation({
    mutationFn: (id) => tagsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags']);
      setDeleteDialog(null);
    },
  });

  // 🏷️ Création automatique de tag
  const handleCreateTag = (e) => {
    e.preventDefault();
    
    if (!newTagName.trim()) {
      return;
    }

    const tagData = {
      name: newTagName.trim(),
      category_id: selectedCategory || null,
    };

    createMutation.mutate(tagData);
  };

  // 🔍 Filtrage des tags
  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || tag.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 📊 Statistiques automatiques
  const stats = {
    total: tags.length,
    withoutCategory: tags.filter(tag => !tag.category_id).length,
    withCategory: tags.filter(tag => tag.category_id).length,
  };

  const isLoading = tagsLoading || categoriesLoading;
  const error = tagsError;

  if (isLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <Box textAlign="center">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement du système de tags...
        </Typography>
      </Box>
    </Box>
  );

  if (error) return (
    <Box p={3}>
      <Alert severity="error">
        Erreur lors du chargement des tags: {error.message}
      </Alert>
    </Box>
  );

  return (
    <Box p={3}>
      {/* En-tête avec statistiques */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            <Label sx={{ mr: 1, verticalAlign: 'middle' }} />
            Gestion des Tags
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {stats.total} tags • {stats.withCategory} catégorisés • {stats.withoutCategory} non catégorisés
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Colonne gauche : Création et filtres */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Add sx={{ mr: 1, verticalAlign: 'middle' }} />
              Nouveau Tag
            </Typography>

            {/* Formulaire de création */}
            <Box component="form" onSubmit={handleCreateTag}>
              <TextField
                fullWidth
                label="Nom du tag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                margin="normal"
                required
                disabled={createMutation.isLoading}
                helperText="Nom unique pour le tag"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Catégorie associée</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Catégorie associée"
                >
                  <MenuItem value="">Aucune catégorie</MenuItem>
                  {categories
                    .filter(cat => cat.is_active)
                    .map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!newTagName.trim() || createMutation.isLoading}
                startIcon={createMutation.isLoading ? <CircularProgress size={16} /> : <Add />}
                sx={{ mt: 2 }}
              >
                {createMutation.isLoading ? 'Création...' : 'Créer le Tag'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Filtres */}
            <Typography variant="h6" gutterBottom>
              <Search sx={{ mr: 1, verticalAlign: 'middle' }} />
              Filtres
            </Typography>

            <TextField
              fullWidth
              label="Rechercher un tag"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Filtrer par catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Filtrer par catégorie"
              >
                <MenuItem value="">Toutes les catégories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Card>
        </Grid>

        {/* Colonne droite : Liste des tags */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <Box p={2} sx={{ backgroundColor: 'action.hover' }}>
              <Typography variant="h6">
                Tags ({filteredTags.length})
              </Typography>
            </Box>

            {filteredTags.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Label sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Aucun tag trouvé
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {tags.length === 0 
                    ? "Commencez par créer votre premier tag" 
                    : "Aucun tag ne correspond aux filtres"
                  }
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredTags.map((tag, index) => (
                  <React.Fragment key={tag.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip 
                              label={tag.name}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            {tag.category_id && (
                              <Chip 
                                icon={<Category />}
                                label={
                                  categories.find(cat => cat.id === tag.category_id)?.name || 'Catégorie'
                                }
                                size="small"
                                variant="outlined"
                                color="secondary"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="textSecondary">
                            Créé le {tag.created_at ? new Date(tag.created_at).toLocaleDateString() : 'N/A'}
                            {tag.usage_count !== undefined && ` • Utilisé ${tag.usage_count} fois`}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          color="error"
                          onClick={() => setDeleteDialog(tag)}
                          disabled={deleteMutation.isLoading}
                          title="Supprimer le tag"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < filteredTags.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={Boolean(deleteDialog)}
        onClose={() => setDeleteDialog(null)}
      >
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le tag <strong>"{deleteDialog?.name}"</strong> ?
          </Typography>
          {deleteDialog?.usage_count > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Ce tag est utilisé {deleteDialog.usage_count} fois. Sa suppression peut affecter les produits associés.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>
            Annuler
          </Button>
          <Button 
            onClick={() => deleteMutation.mutate(deleteDialog.id)}
            color="error"
            variant="contained"
            disabled={deleteMutation.isLoading}
            startIcon={deleteMutation.isLoading ? <CircularProgress size={16} /> : <Delete />}
          >
            {deleteMutation.isLoading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Indicateurs de chargement */}
      {createMutation.isLoading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Création du tag en cours...
        </Alert>
      )}

      {deleteMutation.isLoading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Suppression du tag en cours...
        </Alert>
      )}
    </Box>
  );
};

export default TagSystem;