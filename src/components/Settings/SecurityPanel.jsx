// 📁 src/components/Settings/SecurityPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Alert,
  Snackbar,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
  AccessTime as AccessTimeIcon,
  Backup as BackupIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// ✅ IMPORT DES SERVICES API CONFIGURÉS
import { adminAPI } from '../../services/api';

const SecurityPanel = () => {
  // États pour les paramètres de sécurité
  const [securitySettings, setSecuritySettings] = useState({
    two_factor_auth: false,
    session_timeout: 30,
    password_policy: {
      min_length: 8,
      require_uppercase: true,
      require_numbers: true,
      require_special_chars: false
    },
    login_attempts: {
      max_attempts: 5,
      lockout_duration: 30
    },
    backup_settings: {
      auto_backup: true,
      backup_frequency: 'daily',
      retain_days: 30
    }
  });

  // États pour l'UI
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeSessions, setActiveSessions] = useState([]);

  // Charger les paramètres au montage du composant
  useEffect(() => {
    loadSecuritySettings();
    loadActiveSessions();
  }, []);

  // 📡 CHARGE LES PARAMÈTRES DE SÉCURITÉ AVEC L'API CONFIGURÉE
  const loadSecuritySettings = async () => {
    setLoading(true);
    try {
      // ✅ UTILISATION DE L'API CONFIGURÉE
      const response = await adminAPI.settings.get();
      const settingsData = response.data;
      
      // Adapter la structure des données selon votre backend
      if (settingsData.security) {
        setSecuritySettings(settingsData.security);
      } else {
        setSecuritySettings(settingsData);
      }
      
      showSnackbar('Paramètres de sécurité chargés avec succès', 'success');
    } catch (error) {
      console.error('Erreur chargement paramètres sécurité:', error);
      showSnackbar('Erreur lors du chargement des paramètres', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 📡 CHARGE LES SESSIONS ACTIVES (FONCTIONNALITÉ AVANCÉE)
  const loadActiveSessions = async () => {
    try {
      // ✅ SIMULATION - À ADAPTER SELON VOTRE BACKEND
      // Pour l'instant, on utilise des données mock
      const mockSessions = [
        {
          id: '1',
          user_email: 'admin@example.com',
          ip_address: '192.168.1.100',
          created_at: new Date().toISOString(),
          last_activity: new Date().toISOString()
        },
        {
          id: '2', 
          user_email: 'user@example.com',
          ip_address: '192.168.1.101',
          created_at: new Date(Date.now() - 30 * 60000).toISOString(),
          last_activity: new Date().toISOString()
        }
      ];
      setActiveSessions(mockSessions);
      
    } catch (error) {
      console.error('Erreur chargement sessions actives:', error);
    }
  };

  // 💾 SAUVEGARDE LES PARAMÈTRES DE SÉCURITÉ AVEC L'API CONFIGURÉE
  const saveSecuritySettings = async () => {
    setSaving(true);
    try {
      // ✅ UTILISATION DE L'API CONFIGURÉE
      await adminAPI.settings.update({
        security: securitySettings
      });

      showSnackbar('Paramètres de sécurité sauvegardés avec succès', 'success');
    } catch (error) {
      console.error('Erreur sauvegarde paramètres sécurité:', error);
      showSnackbar('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 🔧 SAUVEGARDE DES PARAMÈTRES SYSTÈME (FONCTIONNALITÉ AVANCÉE)
  const saveSystemSettings = async () => {
    try {
      // ✅ SIMULATION - À IMPLÉMENTER SELON VOS BESOINS
      showSnackbar('Paramètres système sauvegardés (simulation)', 'success');
    } catch (error) {
      console.error('Erreur sauvegarde paramètres système:', error);
      showSnackbar('Erreur lors de la sauvegarde système', 'error');
    }
  };

  // 💾 LANCE UNE SAUVEGARDE MANUELLE (FONCTIONNALITÉ AVANCÉE)
  const triggerBackup = async () => {
    try {
      // ✅ SIMULATION - À IMPLÉMENTER SELON VOS BESOINS
      showSnackbar('Sauvegarde manuelle lancée (simulation)', 'success');
    } catch (error) {
      console.error('Erreur sauvegarde manuelle:', error);
      showSnackbar('Erreur lors de la sauvegarde', 'error');
    }
  };

  // 🔐 TERMINE UNE SESSION (FONCTIONNALITÉ AVANCÉE)
  const terminateSession = async (sessionId) => {
    try {
      // ✅ SIMULATION - À IMPLÉMENTER SELON VOTRE BACKEND
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      showSnackbar('Session terminée avec succès', 'success');
    } catch (error) {
      console.error('Erreur terminaison session:', error);
      showSnackbar('Erreur lors de la terminaison', 'error');
    }
  };

  // 🎯 GESTIONNAIRE DE SNACKBAR
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 🔄 GESTIONNAIRES DE CHANGEMENT
  const handleTwoFactorChange = (event) => {
    setSecuritySettings(prev => ({
      ...prev,
      two_factor_auth: event.target.checked
    }));
  };

  const handleSessionTimeoutChange = (event) => {
    setSecuritySettings(prev => ({
      ...prev,
      session_timeout: parseInt(event.target.value) || 30
    }));
  };

  const handlePasswordPolicyChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      password_policy: {
        ...prev.password_policy,
        [field]: value
      }
    }));
  };

  const handleLoginAttemptsChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      login_attempts: {
        ...prev.login_attempts,
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleBackupSettingsChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      backup_settings: {
        ...prev.backup_settings,
        [field]: value
      }
    }));
  };

  // 🎨 FORMATAGE DE LA DATE
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Chargement des paramètres de sécurité...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="primary" />
          Paramètres de Sécurité
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez les paramètres de sécurité et les sauvegardes du système
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Colonne gauche - Paramètres de sécurité */}
        <Grid item xs={12} md={8}>
          {/* Authentification à deux facteurs */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VpnKeyIcon color="primary" />
                Authentification
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.two_factor_auth}
                    onChange={handleTwoFactorChange}
                    color="primary"
                  />
                }
                label="Authentification à deux facteurs (2FA) obligatoire"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Délai d'expiration de session (minutes)"
                type="number"
                value={securitySettings.session_timeout}
                onChange={handleSessionTimeoutChange}
                fullWidth
                sx={{ mb: 2 }}
                helperText="Durée d'inactivité avant déconnexion automatique"
                inputProps={{ min: 1, max: 1440 }}
              />
            </CardContent>
          </Card>

          {/* Politique de mot de passe */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockIcon color="primary" />
                Politique de Mot de Passe
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Longueur minimale"
                    type="number"
                    value={securitySettings.password_policy.min_length}
                    onChange={(e) => handlePasswordPolicyChange('min_length', parseInt(e.target.value) || 8)}
                    fullWidth
                    inputProps={{ min: 6, max: 128 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.password_policy.require_uppercase}
                        onChange={(e) => handlePasswordPolicyChange('require_uppercase', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Majuscules requises"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.password_policy.require_numbers}
                        onChange={(e) => handlePasswordPolicyChange('require_numbers', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Chiffres requis"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.password_policy.require_special_chars}
                        onChange={(e) => handlePasswordPolicyChange('require_special_chars', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Caractères spéciaux"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tentatives de connexion */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sécurité des Connexions
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Tentatives de connexion max"
                    type="number"
                    value={securitySettings.login_attempts.max_attempts}
                    onChange={(e) => handleLoginAttemptsChange('max_attempts', e.target.value)}
                    fullWidth
                    helperText="Nombre d'échecs avant blocage"
                    inputProps={{ min: 1, max: 20 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Durée de blocage (minutes)"
                    type="number"
                    value={securitySettings.login_attempts.lockout_duration}
                    onChange={(e) => handleLoginAttemptsChange('lockout_duration', e.target.value)}
                    fullWidth
                    helperText="Durée du blocage après échecs"
                    inputProps={{ min: 1, max: 1440 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Sauvegarde automatique */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BackupIcon color="primary" />
                Sauvegarde Automatique
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.backup_settings.auto_backup}
                    onChange={(e) => handleBackupSettingsChange('auto_backup', e.target.checked)}
                    color="primary"
                  />
                }
                label="Sauvegarde automatique activée"
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Fréquence de sauvegarde"
                    value={securitySettings.backup_settings.backup_frequency}
                    onChange={(e) => handleBackupSettingsChange('backup_frequency', e.target.value)}
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="hourly">Chaque heure</option>
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuelle</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Conservation (jours)"
                    type="number"
                    value={securitySettings.backup_settings.retain_days}
                    onChange={(e) => handleBackupSettingsChange('retain_days', parseInt(e.target.value) || 30)}
                    fullWidth
                    helperText="Nombre de jours de conservation"
                    inputProps={{ min: 1, max: 365 }}
                  />
                </Grid>
              </Grid>

              <Button
                variant="outlined"
                startIcon={<BackupIcon />}
                onClick={triggerBackup}
                sx={{ mt: 2 }}
              >
                Sauvegarde Manuelle
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Colonne droite - Sessions actives et actions */}
        <Grid item xs={12} md={4}>
          {/* Sessions actives */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="primary" />
                Sessions Actives ({activeSessions.length})
              </Typography>

              {activeSessions.length > 0 ? (
                <List dense>
                  {activeSessions.map((session) => (
                    <ListItem
                      key={session.id}
                      secondaryAction={
                        <Button
                          size="small"
                          color="error"
                          onClick={() => terminateSession(session.id)}
                          disabled={session.user_email === 'admin@example.com'} // Empêcher de se déconnecter soi-même
                        >
                          Terminer
                        </Button>
                      }
                    >
                      <ListItemIcon>
                        <LockIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={session.user_email || 'Utilisateur'}
                        secondary={
                          <>
                            <Typography variant="caption" display="block">
                              IP: {session.ip_address}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Début: {formatDate(session.created_at)}
                            </Typography>
                            {session.last_activity && (
                              <Typography variant="caption" display="block">
                                Activité: {formatDate(session.last_activity)}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Aucune session active
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions Rapides
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={saveSecuritySettings}
                  disabled={saving}
                  fullWidth
                >
                  {saving ? 'Sauvegarde...' : 'Sauvegarder Tout'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadSecuritySettings}
                  fullWidth
                >
                  Actualiser
                </Button>

                <Button
                  variant="outlined"
                  onClick={saveSystemSettings}
                  fullWidth
                >
                  Paramètres Système
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar de notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SecurityPanel;
