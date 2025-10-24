import React, { useState, useEffect } from 'react';
import { categoriesAPI, tagsAPI } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  Chip,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ExpandMore,
  Category,
  Label,
  FilterList,
  Clear
} from '@mui/icons-material';

/**
 * Composant de filtrage avancé des produits par catégories et tags
 * Fonctionnalités :
 * - Filtrage multi-catégories
 * - Sélection de tags multiples
 * - Réinitialisation automatique
 * - Interface responsive
 */
const CategoryFilter = ({ 
  onFiltersChange, 
  initialFilters = {} 
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState('');

  // 🔄 Récupération des catégories et tags
  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.all(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { 
    data: tags = [], 
    isLoading: tagsLoading,
    error: tagsError
  } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsAPI.all(),
    staleTime: 10 * 60 * 1000,
  });

  // 🎯 Application automatique des filtres initiaux
  useEffect(() => {
    if (initialFilters.categories) {
      setSelectedCategories(initialFilters.categories);
    }
    if (initialFilters.tags) {
      setSelectedTags(initialFilters.tags);
    }
    if (initialFilters.priceRange) {
      setPriceRange(initialFilters.priceRange);
    }
  }, [initialFilters]);

  // 🔄 Diffusion automatique des changements de filtres
  useEffect(() => {
    const filters = {
      categories: selectedCategories,
      tags: selectedTags,
      priceRange,
      search: searchTerm.trim() || undefined
    };

    onFiltersChange(filters);
  }, [selectedCategories, selectedTags, priceRange, searchTerm, onFiltersChange]);

  // ✅ Gestion sélection catégories
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // 🏷️ Gestion sélection tags
  const handleTagToggle = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // 🗑️ Réinitialisation automatique des filtres
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange([0, 1000]);
    setSearchTerm('');
  };

  // 📊 Calcul des statistiques de filtres
  const activeFiltersCount = 
    selectedCategories.length + 
    selectedTags.length + 
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    (searchTerm ? 1 : 0);

  const isLoading = categoriesLoading || tagsLoading;
  const error = categoriesError || tagsError;

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Erreur lors du chargement des filtres: {error.message}
      </Alert>
    );
  }

  return (
    <Card elevation={1} sx={{ p: 2 }}>
      {/* En-tête avec indicateur de filtres actifs */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2">
          <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
          Filtres
          {activeFiltersCount > 0 && (
            <Chip 
              label={activeFiltersCount} 
              size="small" 
              color="primary" 
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        
        {activeFiltersCount > 0 && (
          <Button 
            startIcon={<Clear />}
            onClick={handleClearFilters}
            size="small"
            color="inherit"
          >
            Tout effacer
          </Button>
        )}
      </Box>

      {/* Recherche texte */}
      <TextField
        fullWidth
        label="Rechercher dans les produits..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
        size="small"
      />

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <>
          {/* Filtre par prix */}
          <Accordion defaultExpanded sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">
                Fourchette de prix
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={priceRange}
                  onChange={(_, newValue) => setPriceRange(newValue)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value} €`}
                  min={0}
                  max={1000}
                  step={10}
                  color="primary"
                />
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="caption">
                    {priceRange[0]} €
                  </Typography>
                  <Typography variant="caption">
                    {priceRange[1]} €
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Filtre par catégories */}
          <Accordion defaultExpanded sx={{ mt: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Category sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle1">
                  Catégories
                  {selectedCategories.length > 0 && (
                    <Chip 
                      label={selectedCategories.length} 
                      size="small" 
                      color="primary" 
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {categories
                  .filter(category => category.is_active)
                  .map((category) => (
                    <FormControlLabel
                      key={category.id}
                      control={
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          size="small"
                        />
                      }
                      label={
                        <Box display="flex" justifyContent="space-between" width="100%">
                          <Typography variant="body2">
                            {category.name}
                          </Typography>
                          {category.product_count > 0 && (
                            <Chip 
                              label={category.product_count} 
                              size="small" 
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  ))}
              </FormGroup>
              
              {categories.filter(cat => cat.is_active).length === 0 && (
                <Typography variant="body2" color="textSecondary" textAlign="center" py={2}>
                  Aucune catégorie active disponible
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Filtre par tags */}
          <Accordion defaultExpanded sx={{ mt: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Label sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle1">
                  Tags
                  {selectedTags.length > 0 && (
                    <Chip 
                      label={selectedTags.length} 
                      size="small" 
                      color="primary" 
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                <FormGroup>
                  {tags.map((tag) => (
                    <FormControlLabel
                      key={tag.id}
                      control={
                        <Checkbox
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => handleTagToggle(tag.id)}
                          size="small"
                        />
                      }
                      label={
                        <Box display="flex" justifyContent="space-between" width="100%">
                          <Typography variant="body2">
                            {tag.name}
                          </Typography>
                          {tag.usage_count > 0 && (
                            <Chip 
                              label={tag.usage_count} 
                              size="small" 
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  ))}
                </FormGroup>
              </Box>
              
              {tags.length === 0 && (
                <Typography variant="body2" color="textSecondary" textAlign="center" py={2}>
                  Aucun tag disponible
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Affichage des filtres actifs */}
          {(selectedCategories.length > 0 || selectedTags.length > 0) && (
            <>
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Filtres actifs:
              </Typography>
              
              <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                {/* Catégories sélectionnées */}
                {selectedCategories.map(categoryId => {
                  const category = categories.find(c => c.id === categoryId);
                  return category ? (
                    <Chip
                      key={categoryId}
                      label={category.name}
                      size="small"
                      onDelete={() => handleCategoryToggle(categoryId)}
                      color="primary"
                      variant="outlined"
                    />
                  ) : null;
                })}
                
                {/* Tags sélectionnés */}
                {selectedTags.map(tagId => {
                  const tag = tags.find(t => t.id === tagId);
                  return tag ? (
                    <Chip
                      key={tagId}
                      label={tag.name}
                      size="small"
                      onDelete={() => handleTagToggle(tagId)}
                      color="secondary"
                      variant="outlined"
                    />
                  ) : null;
                })}
              </Box>
            </>
          )}
        </>
      )}
    </Card>
  );
};

export default CategoryFilter;