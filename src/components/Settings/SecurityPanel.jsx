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
  Chip
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

  // 📡 CHARGE LES PARAMÈTRES DE SÉCURITÉ DEPUIS LE BACKEND
  const loadSecuritySettings = async () => {
    setLoading(true);
    try {
      // Utilisation directe de l'endpoint SETTINGS.SECURITY
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}${SETTINGS.SECURITY}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSecuritySettings(data.settings);
        showSnackbar('Paramètres de sécurité chargés avec succès', 'success');
      } else {
        throw new Error('Erreur lors du chargement des paramètres');
      }
    } catch (error) {
      console.error('Erreur chargement paramètres sécurité:', error);
      showSnackbar('Erreur lors du chargement des paramètres', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 📡 CHARGE LES SESSIONS ACTIVES
  const loadActiveSessions = async () => {
    try {
      // Endpoint fictif - à adapter selon votre backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin/sessions/active`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setActiveSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Erreur chargement sessions actives:', error);
    }
  };

  // 💾 SAUVEGARDE LES PARAMÈTRES DE SÉCURITÉ
  const saveSecuritySettings = async () => {
    setSaving(true);
    try {
      // Utilisation de l'endpoint SETTINGS.SECURITY en PUT
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}${SETTINGS.SECURITY}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(securitySettings)
      });

      if (response.ok) {
        showSnackbar('Paramètres de sécurité sauvegardés avec succès', 'success');
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur sauvegarde paramètres sécurité:', error);
      showSnackbar('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 🔧 SAUVEGARDE DES PARAMÈTRES SYSTÈME
  const saveSystemSettings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}${SETTINGS.SYSTEM}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          maintenance_mode: false,
          debug_mode: false,
          // Autres paramètres système...
        })
      });

      if (response.ok) {
        showSnackbar('Paramètres système sauvegardés', 'success');
      }
    } catch (error) {
      console.error('Erreur sauvegarde paramètres système:', error);
    }
  };

  // 💾 LANCE UNE SAUVEGARDE MANUELLE
  const triggerBackup = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}${SETTINGS.BACKUP}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        showSnackbar('Sauvegarde manuelle lancée avec succès', 'success');
      }
    } catch (error) {
      console.error('Erreur sauvegarde manuelle:', error);
      showSnackbar('Erreur lors de la sauvegarde', 'error');
    }
  };

  // 🔐 TERMINE UNE SESSION
  const terminateSession = async (sessionId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
        showSnackbar('Session terminée avec succès', 'success');
      }
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Chargement des paramètres de sécurité...</Typography>
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
                            <div>IP: {session.ip_address}</div>
                            <div>Début: {new Date(session.created_at).toLocaleString()}</div>
                            {session.last_activity && (
                              <div>Activité: {new Date(session.last_activity).toLocaleString()}</div>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
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
                  startIcon={<SaveIcon />}
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

// Import des endpoints (assurez-vous que SETTINGS est importé)
import { SETTINGS } from '../../services/endpoints';

export default SecurityPanel;