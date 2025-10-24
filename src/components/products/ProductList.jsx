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
  Label,
  Person,
  Edit,
  Delete
} from '@mui/icons-material';
import CategoryFilter from './CategoryFilter';
import { useAuthContext } from '../../contexts/AuthContext';

/**
 * Liste des produits avec gestion intelligente des rôles :
 * - Acheteurs : Voir TOUS les produits
 * - Vendeurs/Admin : Voir uniquement LEURS produits
 */
const ProductList = () => {
  const { user } = useAuthContext();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // 🎯 Détection du rôle pour déterminer quelle API utiliser
  const isBuyer = user?.role === 'buyer';
  const isSellerOrAdmin = user?.role === 'seller' || user?.role === 'admin' || user?.role === 'freelancer';

  // 🔄 Récupération des produits selon le rôle
  const { 
    data: products = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['products', user?.role, filters],
    queryFn: () => {
      if (isBuyer) {
        // ✅ ACHETEUR : Voir TOUS les produits avec filtres
        return productsAPI.all({ ...filters });
      } else {
        // ✅ VENDEUR/ADMIN : Voir uniquement LEURS produits
        return productsAPI.my();
      }
    },
    staleTime: 2 * 60 * 1000,
  });

  // 🎯 Filtrage supplémentaire côté client pour les acheteurs
  const filteredProducts = useMemo(() => {
    if (!isBuyer) {
      // Vendeurs/Admin : Pas de filtrage supplémentaire (déjà filtré par l'API)
      return products;
    }

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
  }, [products, filters, isBuyer]);

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

  // 🛒 Fonction d'achat pour les acheteurs
  const handleBuy = (product) => {
    // Logique d'achat à implémenter
    console.log('Achat du produit:', product);
  };

  // ✏️ Fonction d'édition pour les vendeurs
  const handleEdit = (product) => {
    // Logique d'édition à implémenter
    console.log('Édition du produit:', product);
  };

  // 🗑️ Fonction de suppression pour les vendeurs
  const handleDelete = (product) => {
    // Logique de suppression à implémenter
    console.log('Suppression du produit:', product);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {isBuyer ? 'Chargement de la boutique...' : 'Chargement de vos produits...'}
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
      {/* En-tête avec informations selon le rôle */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          Accueil
        </Link>
        <Typography color="text.primary">
          {isBuyer ? 'Boutique' : 'Mes Produits'}
        </Typography>
      </Breadcrumbs>

      <Box display="flex" gap={3} flexDirection={{ xs: 'column', lg: 'row' }}>
        {/* Sidebar des filtres - UNIQUEMENT pour les acheteurs */}
        {isBuyer && (
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
        )}

        {/* Contenu principal */}
        <Box flex={1}>
          {/* En-tête des résultats */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <div>
              <Typography variant="h4" component="h1">
                {isBuyer ? 'Boutique' : 'Mes Produits'}
                {filteredProducts.length > 0 && (
                  <Typography variant="h6" component="span" color="textSecondary" sx={{ ml: 1 }}>
                    ({filteredProducts.length})
                  </Typography>
                )}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                {isBuyer 
                  ? 'Découvrez tous les produits disponibles' 
                  : 'Gérez vos produits en vente'
                }
              </Typography>
            </div>

            {/* Bouton d'action selon le rôle */}
            {isSellerOrAdmin && (
              <Button variant="contained" startIcon={<Edit />}>
                Nouveau Produit
              </Button>
            )}
          </Box>

          {/* Grille des produits */}
          {paginatedProducts.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {isBuyer 
                  ? "Aucun produit trouvé" 
                  : "Vous n'avez pas encore de produits"
                }
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {isBuyer 
                  ? "Aucun produit ne correspond à vos critères de recherche." 
                  : "Commencez par créer votre premier produit pour le vendre."
                }
              </Typography>
              {isSellerOrAdmin && (
                <Button variant="outlined" sx={{ mt: 2 }}>
                  Créer mon premier produit
                </Button>
              )}
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard 
                      product={product} 
                      userRole={user?.role}
                      onBuy={handleBuy}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
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

// 🎴 Composant Carte Produit avec actions selon le rôle
const ProductCard = ({ product, userRole, onBuy, onEdit, onDelete }) => {
  const isBuyer = userRole === 'buyer';
  const isSellerOrAdmin = userRole === 'seller' || userRole === 'admin' || userRole === 'freelancer';

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

        {/* Afficher le propriétaire pour les acheteurs */}
        {isBuyer && product.owner && (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Person fontSize="small" color="action" />
            <Typography variant="caption" color="textSecondary">
              Vendu par {product.owner.name || product.owner.email}
            </Typography>
          </Box>
        )}

        {/* Description */}
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.description}
        </Typography>

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

      {/* Actions selon le rôle */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Box display="flex" gap={1}>
          {isBuyer ? (
            // ✅ ACTIONS ACHETEUR
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              fullWidth
              size="small"
              onClick={() => onBuy(product)}
            >
              Acheter
            </Button>
          ) : (
            // ✅ ACTIONS VENDEUR/ADMIN
            <>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                fullWidth
                size="small"
                onClick={() => onEdit(product)}
              >
                Modifier
              </Button>
              <Tooltip title="Supprimer">
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => onDelete(product)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          <Tooltip title="Voir les détails">
            <IconButton size="small" color="primary">
              <Visibility />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

export default ProductList;