// 📁 src/pages/freelance/MissionDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Chat as ChatIcon,
  ArrowBack as ArrowBackIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// ✅ IMPORT DES SERVICES API CONFIGURÉS
import { freelanceAPI } from '../../services/api';
import FreelanceChatSystem from '../../components/Chat/FreelanceChatSystem';

const MissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMissionDetails();
  }, [id]);

  // ✅ UTILISATION DE L'API CONFIGURÉE AVEC AXIOS
  const loadMissionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ APPEL DIRECT VIA L'API CONFIGURÉE
      const response = await freelanceAPI.missions.getById(id);
      setMission(response.data);
      
    } catch (error) {
      console.error('Erreur chargement mission:', error);
      
      // ✅ GESTION D'ERREUR AVEC LE SYSTÈME EXISTANT
      if (error.response?.status === 404) {
        setError('Mission non trouvée');
      } else if (error.response?.status === 403) {
        setError('Vous n\'avez pas accès à cette mission');
      } else {
        setError('Impossible de charger les détails de la mission');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'default',
      'in_progress': 'primary',
      'completed': 'success',
      'cancelled': 'error',
      'waiting_payment': 'warning'
    };
    return statusColors[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'pending': 'En attente',
      'in_progress': 'En cours',
      'completed': 'Terminée',
      'cancelled': 'Annulée',
      'waiting_payment': 'Paiement en attente'
    };
    return statusTexts[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // ✅ STRUCTURE DE DONNÉES ATTENDUE BASÉE SUR VOTRE BACKEND
  const mockMissionData = {
    id: id,
    title: "Mission Développement Web",
    description: "Création d'un site e-commerce responsive",
    detailed_description: "Développement complet d'un site e-commerce avec gestion des produits, panier, et système de paiement. Le site doit être responsive et optimisé pour le SEO.",
    status: "in_progress",
    client_name: "Client Entreprise",
    client_email: "client@entreprise.com",
    budget: 1500,
    deadline: "2024-02-15",
    created_at: "2024-01-10",
    start_date: "2024-01-15",
    skills_required: ["React", "Node.js", "MongoDB", "Responsive Design"],
    deliverables: "Site e-commerce fonctionnel, documentation technique, formation utilisateur",
    deliveries: [
      {
        id: 1,
        delivered_at: "2024-01-20",
        notes: "Première version du frontend",
        status: "approved"
      }
    ]
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement de la mission...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          variant="contained"
        >
          Retour
        </Button>
      </Box>
    );
  }

  if (!mission) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Aucune donnée de mission disponible
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Retour
        </Button>
      </Box>
    );
  }

  // ✅ UTILISATION DES DONNÉES RÉELLES OU MOCK POUR LE DÉVELOPPEMENT
  const missionData = mission || mockMissionData;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          color="inherit" 
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Accueil
        </Link>
        <Link 
          color="inherit" 
          onClick={() => navigate('/seller')}
          sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Mes Missions
        </Link>
        <Typography color="text.primary">Détails Mission</Typography>
      </Breadcrumbs>

      {/* Bouton retour */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Retour
      </Button>

      {/* En-tête de la mission */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkIcon color="primary" />
              {missionData.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {missionData.description}
            </Typography>
          </Box>
          <Chip 
            label={getStatusText(missionData.status)} 
            color={getStatusColor(missionData.status)}
            variant="filled"
            size="large"
          />
        </Box>

        {/* Informations rapides */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MoneyIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Budget
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {missionData.budget} €
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Échéance
                </Typography>
                <Typography variant="h6">
                  {formatDate(missionData.deadline)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Client
                </Typography>
                <Typography variant="h6">
                  {missionData.client_name}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              startIcon={<ChatIcon />}
              onClick={() => setChatOpen(true)}
              fullWidth
              size="large"
              disabled={missionData.status === 'cancelled' || missionData.status === 'completed'}
            >
              Messagerie
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Détails de la mission */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📋 Description Détaillée
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                {missionData.detailed_description || missionData.description}
              </Typography>

              {/* Compétences requises */}
              {missionData.skills_required && missionData.skills_required.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    🛠️ Compétences Requises
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {missionData.skills_required.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        variant="outlined" 
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Livrables attendus */}
              {missionData.deliverables && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    🎯 Livrables Attendus
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {missionData.deliverables}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Historique des livraisons */}
          {missionData.deliveries && missionData.deliveries.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  📦 Historique des Livraisons
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {missionData.deliveries.map((delivery, index) => (
                  <Box key={delivery.id || index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Livraison #{index + 1} - {formatDate(delivery.delivered_at)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {delivery.notes}
                    </Typography>
                    <Chip 
                      label={delivery.status === 'approved' ? 'Approuvée' : delivery.status} 
                      size="small" 
                      color={delivery.status === 'approved' ? 'success' : 'primary'}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar - Informations et actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 100 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚀 Actions Rapides
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Bouton messagerie */}
              <Button
                variant="contained"
                startIcon={<ChatIcon />}
                onClick={() => setChatOpen(true)}
                fullWidth
                sx={{ mb: 2 }}
                disabled={missionData.status === 'cancelled' || missionData.status === 'completed'}
              >
                Ouvrir la messagerie
              </Button>

              {/* Informations mission */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  📊 Informations Mission
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Statut:</Typography>
                  <Chip 
                    label={getStatusText(missionData.status)} 
                    size="small" 
                    color={getStatusColor(missionData.status)}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Date création:</Typography>
                  <Typography variant="body2">
                    {formatDate(missionData.created_at)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Début:</Typography>
                  <Typography variant="body2">
                    {missionData.start_date ? formatDate(missionData.start_date) : 'À définir'}
                  </Typography>
                </Box>
              </Box>

              {/* Contact client */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  👤 Contact Client
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {missionData.client_name}
                </Typography>
                {missionData.client_email && (
                  <Typography variant="body2" color="primary" sx={{ wordBreak: 'break-all' }}>
                    {missionData.client_email}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal de chat */}
      <Dialog
        fullScreen
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      >
        <FreelanceChatSystem missionId={id} />
      </Dialog>
    </Box>
  );
};

export default MissionDetails;