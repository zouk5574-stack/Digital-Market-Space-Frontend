// 📁 src/components/Chat/FreelanceChatSystem.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  Paper,
  Chip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// ✅ IMPORT DES SERVICES API CONFIGURÉS
import { chatAPI } from '../../services/api';

const FreelanceChatSystem = ({ missionId }) => {
  // États pour la messagerie
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const messagesEndRef = useRef(null);

  // 📡 CHARGE LES CONVERSATIONS FREELANCE AVEC L'API CONFIGURÉE
  const loadFreelanceConversations = async () => {
    setLoading(true);
    try {
      // ✅ UTILISATION DE L'API CONFIGURÉE
      const response = await chatAPI.conversations();
      const conversationsData = response.data;
      
      // Filtrer les conversations liées aux missions si missionId est fourni
      const filteredConversations = missionId 
        ? conversationsData.filter(conv => conv.mission_id === missionId)
        : conversationsData;
      
      setConversations(filteredConversations || []);
      
      // Sélectionner la première conversation par défaut
      if (filteredConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(filteredConversations[0]);
      }
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      showSnackbar('Erreur lors du chargement des conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 📡 CHARGE LES MESSAGES D'UNE CONVERSATION AVEC L'API CONFIGURÉE
  const loadMessages = async (conversationId) => {
    try {
      // ✅ UTILISATION DE L'API CONFIGURÉE
      const response = await chatAPI.messages(conversationId);
      setMessages(response.data || []);
      
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      showSnackbar('Erreur lors du chargement des messages', 'error');
    }
  };

  // 📤 ENVOIE UN NOUVEAU MESSAGE AVEC L'API CONFIGURÉE
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      // ✅ UTILISATION DE L'API CONFIGURÉE
      const response = await chatAPI.sendMessage({
        conversation_id: selectedConversation.id,
        mission_id: selectedConversation.mission_id,
        content: newMessage.trim()
      });

      const sentMessage = response.data;
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      scrollToBottom();
      showSnackbar('Message envoyé', 'success');
    } catch (error) {
      console.error('Erreur envoi message:', error);
      showSnackbar('Erreur lors de l\'envoi du message', 'error');
    } finally {
      setSending(false);
    }
  };

  // 🔄 SCROLL AUTOMATIQUE VERS LE BAS
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 🎯 GESTIONNAIRE DE SNACKBAR
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 👥 SÉLECTION D'UNE CONVERSATION
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  // 🔄 RECHARGE AUTOMATIQUE
  useEffect(() => {
    loadFreelanceConversations();
    
    const interval = setInterval(() => {
      if (selectedConversation) {
        loadMessages(selectedConversation.id);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedConversation, missionId]);

  // 📥 RECHARGE LES MESSAGES QUAND ON CHANGE DE CONVERSATION
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // 🎨 FORMATAGE DE LA DATE
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return 'Date inconnue';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 👤 DÉTERMINE SI LE MESSAGE EST DE L'UTILISATEUR COURANT
  const isOwnMessage = (message) => {
    // Cette logique dépend de votre système d'authentification
    // À adapter selon votre implémentation
    const currentUser = JSON.parse(localStorage.getItem('userData'));
    return message.sender_id === currentUser?.id;
  };

  if (loading && conversations.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Chargement des conversations...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: '80vh' }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WorkIcon color="primary" />
        Messagerie Mission
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {missionId ? 'Communication pour cette mission' : 'Communication avec vos clients/prestataires'}
      </Typography>

      <Card sx={{ height: 'calc(100% - 100px)' }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Colonne gauche - Liste des conversations */}
          <Box sx={{ width: 350, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Conversations Actives</Typography>
              <Chip 
                label={`${conversations.length} mission(s)`} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Box>
            
            <List sx={{ flex: 1, overflow: 'auto' }}>
              {conversations.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Aucune conversation active
                  </Typography>
                </Box>
              ) : (
                conversations.map((conversation) => (
                  <ListItem
                    key={conversation.id}
                    button
                    selected={selectedConversation?.id === conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="success"
                        variant="dot"
                        invisible={!conversation.is_online}
                      >
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" noWrap>
                            {conversation.other_user_name || 'Utilisateur'}
                          </Typography>
                          {conversation.unread_count > 0 && (
                            <Chip
                              label={conversation.unread_count}
                              size="small"
                              color="error"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {conversation.last_message_content || 'Aucun message'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {conversation.mission_title || 'Mission'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Box>

          {/* Colonne droite - Messages */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {/* En-tête de la conversation */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6">
                        {selectedConversation.other_user_name || 'Utilisateur'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mission: {selectedConversation.mission_title || 'Non spécifiée'}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Mission active"
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                {/* Zone des messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
                  {messages.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Aucun message échangé
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Commencez la conversation maintenant
                      </Typography>
                    </Box>
                  ) : (
                    messages.map((message) => (
                      <Box
                        key={message.id || message._id}
                        sx={{
                          display: 'flex',
                          justifyContent: isOwnMessage(message) ? 'flex-end' : 'flex-start',
                          mb: 2
                        }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            maxWidth: '70%',
                            bgcolor: isOwnMessage(message) ? 'primary.main' : 'background.paper',
                            color: isOwnMessage(message) ? 'primary.contrastText' : 'text.primary',
                            borderRadius: 2,
                            boxShadow: 1
                          }}
                        >
                          <Typography variant="body1">{message.content}</Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block', 
                              mt: 0.5,
                              color: isOwnMessage(message) ? 'primary.contrastText' : 'text.secondary',
                              opacity: 0.8
                            }}
                          >
                            {formatMessageTime(message.created_at || message.timestamp)}
                          </Typography>
                        </Paper>
                      </Box>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Zone de saisie texte */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <form onSubmit={sendMessage}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Tapez votre message texte..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sending}
                        size="small"
                        multiline
                        maxRows={3}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!newMessage.trim() || sending}
                        startIcon={<SendIcon />}
                        sx={{ minWidth: '100px' }}
                      >
                        {sending ? <CircularProgress size={20} /> : 'Envoyer'}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {conversations.length === 0 ? 'Aucune conversation disponible' : 'Sélectionnez une conversation'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {conversations.length === 0 ? 'Les conversations apparaîtront ici lorsque vous aurez des missions actives' : 'Choisissez une conversation pour commencer à discuter'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Card>

      {/* Snackbar de notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FreelanceChatSystem;
