// src/components/freelance/MissionCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFreelanceApi } from '../../hooks/useApi';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import ApplicationModal from './ApplicationModal';

const MissionCard = ({ mission, showActions = true }) => {
  const { user } = useAuth();
  const { actions: freelanceActions } = useFreelanceApi();
  const [loading, setLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const isBuyer = user?.role === 'ACHETEUR';
  const isSeller = user?.role === 'VENDEUR';
  const isOwner = mission.buyer_id === user?.id;

  const handleAcceptApplication = async (applicationId) => {
    setLoading(true);
    try {
      // Cette action va initier l'escrow Fedapay
      const result = await freelanceActions.acceptApplication(applicationId);
      
      if (result.checkout_url) {
        // Redirection vers Fedapay pour sécuriser les fonds
        window.location.href = result.checkout_url;
      }
    } catch (error) {
      console.error('Erreur acceptation candidature:', error);
      alert('Erreur lors de l\'initialisation de l\'escrow');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateDelivery = async (missionId) => {
    setLoading(true);
    try {
      // Déblocage des fonds escrow vers le vendeur
      await freelanceActions.validateDelivery(missionId);
      alert('Livraison validée ! Les fonds ont été transférés au vendeur.');
    } catch (error) {
      console.error('Erreur validation livraison:', error);
      alert('Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { color: 'bg-yellow-100 text-yellow-800', label: '🔍 Ouverte' },
      'pending_payment': { color: 'bg-blue-100 text-blue-800', label: '⏳ Paiement en attente' },
      'in_progress': { color: 'bg-green-100 text-green-800', label: '⚡ En cours' },
      'awaiting_validation': { color: 'bg-orange-100 text-orange-800', label: '📦 En attente de validation' },
      'completed': { color: 'bg-gray-100 text-gray-800', label: '✅ Terminée' }
    };

    const config = statusConfig[status] || statusConfig.open;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {mission.title}
            </h3>
            {getStatusBadge(mission.status)}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">
              {mission.budget} XOF
            </div>
            <div className="text-sm text-gray-500">
              Budget maximum
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          {mission.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
          <div>
            <strong>Catégorie:</strong> {mission.category}
          </div>
          <div>
            <strong>Délai:</strong> {mission.deadline ? new Date(mission.deadline).toLocaleDateString() : 'Non spécifié'}
          </div>
          <div>
            <strong>Candidatures:</strong> {mission.applications?.length || 0}
          </div>
          <div>
            <strong>Prix final:</strong> {mission.final_price ? `${mission.final_price} XOF` : 'À négocier'}
          </div>
        </div>

        {/* Actions selon le rôle et le statut */}
        {showActions && (
          <div className="border-t pt-4">
            {isSeller && mission.status === 'open' && (
              <Button
                variant="primary"
                onClick={() => setShowApplyModal(true)}
                fullWidth
              >
                📝 Postuler à cette mission
              </Button>
            )}

            {isOwner && mission.status === 'open' && mission.applications?.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Candidatures à valider:</h4>
                {mission.applications.slice(0, 3).map(application => (
                  <div key={application.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Proposition: {application.proposed_price} XOF</div>
                      <div className="text-sm text-gray-600">{application.proposal}</div>
                    </div>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleAcceptApplication(application.id)}
                      disabled={loading}
                    >
                      {loading ? <Loader size="small" /> : 'Accepter'}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {isOwner && mission.status === 'awaiting_validation' && (
              <Button
                variant="success"
                onClick={() => handleValidateDelivery(mission.id)}
                disabled={loading}
                fullWidth
              >
                {loading ? <Loader size="small" /> : '✅ Valider la livraison et débloquer les fonds'}
              </Button>
            )}

            {mission.status === 'pending_payment' && (
              <div className="text-center py-2 text-blue-600">
                ⏳ En attente de sécurisation des fonds via Fedapay
              </div>
            )}

            {mission.status === 'in_progress' && isOwner && (
              <div className="text-center py-2 text-green-600">
                ⚡ Mission en cours - Fonds sécurisés chez Fedapay
              </div>
            )}

            {/* Indicateur escrow */}
            {(mission.status === 'in_progress' || mission.status === 'awaiting_validation') && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                <div className="flex items-center text-sm text-blue-700">
                  <span className="mr-2">🔒</span>
                  <span>
                    <strong>Fonds sécurisés:</strong> {mission.final_price} XOF en attente chez Fedapay
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de candidature */}
      <ApplicationModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        mission={mission}
        onApply={async (applicationData) => {
          try {
            await freelanceActions.applyToMission(applicationData);
            setShowApplyModal(false);
            alert('Candidature envoyée avec succès !');
          } catch (error) {
            console.error('Erreur candidature:', error);
            alert('Erreur lors de l\'envoi de la candidature');
          }
        }}
      />
    </>
  );
};

export default MissionCard;
