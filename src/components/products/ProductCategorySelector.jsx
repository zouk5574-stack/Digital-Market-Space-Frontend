import React from 'react';
import { categoriesAPI, tagsAPI } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { Category, Label } from '@mui/icons-material';

/**
 * Sélecteur de catégories et tags pour les produits
 * Utilisation dans les formulaires de création/édition de produits
 */
const ProductCategorySelector = ({ 
  selectedCategories = [],
  selectedTags = [],
  onCategoriesChange,
  onTagsChange,
  maxCategories = 3,
  maxTags = 5
}) => {
  // 🔄 Récupération des données
  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.all(),
  });

  const { 
    data: tags = [], 
    isLoading: tagsLoading,
    error: tagsError
  } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsAPI.all(),
  });

  const isLoading = categoriesLoading || tagsLoading;
  const error = categoriesError || tagsError;

  if (error) {
    return (
      <Alert severity="error">
        Erreur lors du chargement des catégories et tags: {error.message}
      </Alert>
    );
  }

  return (
    <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
      {/* Sélecteur de catégories */}
      <FormControl fullWidth size="small">
        <InputLabel>
          <Category sx={{ mr: 1, fontSize: 18 }} />
          Catégories ({selectedCategories.length}/{maxCategories})
        </InputLabel>
        <Select
          multiple
          value={selectedCategories}
          onChange={(e) => onCategoriesChange(e.target.value)}
          input={<OutlinedInput label={`Catégories (${selectedCategories.length}/${maxCategories})`} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((categoryId) => {
                const category = categories.find(c => c.id === categoryId);
                return category ? (
                  <Chip 
                    key={categoryId} 
                    label={category.name} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ) : null;
              })}
            </Box>
          )}
          disabled={isLoading}
        >
          {categories
            .filter(category => category.is_active)
            .map((category) => (
              <MenuItem 
                key={category.id} 
                value={category.id}
                disabled={
                  selectedCategories.length >= maxCategories && 
                  !selectedCategories.includes(category.id)
                }
              >
                <Checkbox checked={selectedCategories.includes(category.id)} />
                <ListItemText 
                  primary={category.name}
                  secondary={`${category.product_count || 0} produits`}
                />
              </MenuItem>
            ))}
        </Select>
        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
          Sélectionnez jusqu'à {maxCategories} catégories
        </Typography>
      </FormControl>

      {/* Sélecteur de tags */}
      <FormControl fullWidth size="small">
        <InputLabel>
          <Label sx={{ mr: 1, fontSize: 18 }} />
          Tags ({selectedTags.length}/{maxTags})
        </InputLabel>
        <Select
          multiple
          value={selectedTags}
          onChange={(e) => onTagsChange(e.target.value)}
          input={<OutlinedInput label={`Tags (${selectedTags.length}/${maxTags})`} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((tagId) => {
                const tag = tags.find(t => t.id === tagId);
                return tag ? (
                  <Chip 
                    key={tagId} 
                    label={tag.name} 
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ) : null;
              })}
            </Box>
          )}
          disabled={isLoading}
        >
          {tags.map((tag) => (
            <MenuItem 
              key={tag.id} 
              value={tag.id}
              disabled={
                selectedTags.length >= maxTags && 
                !selectedTags.includes(tag.id)
              }
            >
              <Checkbox checked={selectedTags.includes(tag.id)} />
              <ListItemText 
                primary={tag.name}
                secondary={tag.category_id ? `Catégorie: ${categories.find(c => c.id === tag.category_id)?.name}` : 'Sans catégorie'}
              />
            </MenuItem>
          ))}
        </Select>
        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
          Sélectionnez jusqu'à {maxTags} tags
        </Typography>
      </FormControl>
    </Box>
  );
};

export default ProductCategorySelector;