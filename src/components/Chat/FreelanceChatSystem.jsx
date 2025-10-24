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
  Snackbar
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const FreelanceChatSystem = () => {
  // États pour la messagerie
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const messagesEndRef = useRef(null);

  // 📡 CHARGE LES CONVERSATIONS FREELANCE
  const loadFreelanceConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}${CHAT.CONVERSATIONS}?type=freelance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        
        if (data.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversations[0]);
        }
      } else {
        throw new Error('Erreur lors du chargement des conversations');
      }
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      showSnackbar('Erreur lors du chargement des conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 📡 CHARGE LES MESSAGES D'UNE CONVERSATION
  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}${CHAT.MESSAGES(conversationId)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      showSnackbar('Erreur lors du chargement des messages', 'error');
    }
  };

  // 📤 ENVOIE UN NOUVEAU MESSAGE
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}${CHAT.SEND_MESSAGE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversation_id: selectedConversation.id,
          mission_id: selectedConversation.mission_id,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage.message]);
        setNewMessage('');
        scrollToBottom();
        showSnackbar('Message envoyé', 'success');
      } else {
        throw new Error('Erreur lors de l\'envoi du message');
      }
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
  }, [selectedConversation]);

  // 📥 RECHARGE LES MESSAGES QUAND ON CHANGE DE CONVERSATION
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // 🎨 FORMATAGE DE LA DATE
  const formatMessageTime = (timestamp) => {
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
    return message.sender_id === 'current_user_id'; // À adapter selon votre auth
  };

  if (loading && conversations.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Chargement des conversations...</Typography>
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
        Communication texte avec votre client/prestataire
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
              {conversations.map((conversation) => (
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
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" noWrap>
                          {conversation.other_user_name}
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
                          {conversation.mission_title}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
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
                        {selectedConversation.other_user_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mission: {selectedConversation.mission_title}
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
                        key={message.id}
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
                            borderRadius: 2
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
                            {formatMessageTime(message.created_at)}
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
                        {sending ? 'Envoi...' : 'Envoyer'}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                  Sélectionnez une conversation de mission
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

// Import des endpoints
import { CHAT } from '../../services/endpoints';

export default FreelanceChatSystem;