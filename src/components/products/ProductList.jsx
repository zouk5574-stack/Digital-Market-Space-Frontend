import React, { useState, useMemo } from 'react';
import { productsAPI } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Rating,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Share,
  Visibility,
  Category,
  Label
} from '@mui/icons-material';
import CategoryFilter from './CategoryFilter';

/**
 * Liste complète des produits avec filtrage avancé
 * Intégration totale du système de catégories et tags
 */
const ProductList = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // 🔄 Récupération des produits avec filtres
  const { 
    data: products = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsAPI.all({ ...filters }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // 🎯 Application des filtres aux produits
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtre par catégories
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        product.categories?.some(cat => filters.categories.includes(cat.id))
      );
    }

    // Filtre par tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags?.some(tag => filters.tags.includes(tag.id))
      );
    }

    // Filtre par prix
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
      );
    }

    // Filtre par recherche texte
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [products, filters]);

  // 📄 Pagination automatique
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // 🔄 Réinitialisation de la page quand les filtres changent
  React.useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Chargement des produits...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Réessayer
            </Button>
          }
        >
          Erreur lors du chargement des produits: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* En-tête avec fil d'ariane */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          Accueil
        </Link>
        <Typography color="text.primary">Produits</Typography>
        {filters.categories && filters.categories.length > 0 && (
          <Typography color="text.primary">
            {filters.categories.length} catégorie(s) sélectionnée(s)
          </Typography>
        )}
      </Breadcrumbs>

      <Box display="flex" gap={3} flexDirection={{ xs: 'column', lg: 'row' }}>
        {/* Sidebar des filtres */}
        <Box width={{ xs: '100%', lg: 300 }} flexShrink={0}>
          <CategoryFilter 
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />
          
          {/* Statistiques des résultats */}
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Résultats de recherche
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {filteredProducts.length} produit(s) trouvé(s)
              {filters.search && ` pour "${filters.search}"`}
            </Typography>
          </Card>
        </Box>

        {/* Contenu principal */}
        <Box flex={1}>
          {/* En-tête des résultats */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Nos Produits
              {filteredProducts.length > 0 && (
                <Typography variant="h6" component="span" color="textSecondary" sx={{ ml: 1 }}>
                  ({filteredProducts.length})
                </Typography>
              )}
            </Typography>
          </Box>

          {/* Grille des produits */}
          {paginatedProducts.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Aucun produit trouvé
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {products.length === 0 
                  ? "Aucun produit n'est disponible pour le moment." 
                  : "Aucun produit ne correspond à vos critères de recherche."
                }
              </Typography>
              {(filters.categories?.length > 0 || filters.tags?.length > 0 || filters.search) && (
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => setFilters({})}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// 🎴 Composant Carte Produit
const ProductCard = ({ product }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      {/* Image du produit */}
      <CardMedia
        component="img"
        height="200"
        image={product.image_url || '/placeholder-product.jpg'}
        alt={product.title}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Titre et prix */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h2" sx={{ 
            fontWeight: 'bold',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.title}
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {product.price} €
          </Typography>
        </Box>

        {/* Description */}
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.description}
        </Typography>

        {/* Rating */}
        <Box display="flex" alignItems="center" mb={2}>
          <Rating value={product.rating || 0} readOnly size="small" />
          <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
            ({product.review_count || 0})
          </Typography>
        </Box>

        {/* Catégories */}
        {product.categories && product.categories.length > 0 && (
          <Box mb={1}>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Category sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight="medium">
                Catégories:
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {product.categories.slice(0, 2).map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
              {product.categories.length > 2 && (
                <Chip
                  label={`+${product.categories.length - 2}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <Box mb={2}>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Label sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight="medium">
                Tags:
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {product.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              ))}
              {product.tags.length > 3 && (
                <Chip
                  label={`+${product.tags.length - 3}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            fullWidth
            size="small"
          >
            Acheter
          </Button>
          
          <Tooltip title="Voir les détails">
            <IconButton size="small" color="primary">
              <Visibility />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Ajouter aux favoris">
            <IconButton size="small" color="secondary">
              <Favorite />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Partager">
            <IconButton size="small">
              <Share />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

export default ProductList;