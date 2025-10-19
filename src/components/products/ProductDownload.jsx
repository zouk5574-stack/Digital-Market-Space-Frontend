// src/components/products/ProductDownload.jsx
import React, { useState, useEffect } from 'react';
import { useFilesApi, useProductsApi } from '../../hooks/useApi';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

const ProductDownload = ({ product, order }) => {
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  
  const { actions: filesActions } = useFilesApi();
  const { actions: productsActions } = useProductsApi();

  // Vérifier si l'utilisateur a le droit de télécharger
  const canDownload = order && order.status === 'completed';

  // Récupérer les fichiers du produit
  const fetchProductFiles = async () => {
    if (!canDownload) return;

    setLoading(true);
    setError(null);
    
    try {
      // Récupérer les fichiers associés au produit
      // Supposons que l'API retourne les fichiers dans product.files ou via une route spécifique
      const productDetails = await productsActions.getProductById(product.id);
      const productFiles = productDetails.files || [];
      
      if (productFiles.length > 0) {
        setFiles(productFiles);
        
        // Générer les URLs signées pour tous les fichiers
        const urls = [];
        for (const file of productFiles) {
          try {
            const signedUrl = await filesActions.getSignedUrl(file.id);
            urls.push({
              id: file.id,
              name: file.filename,
              url: signedUrl.url,
              size: file.size_bytes,
              type: file.content_type
            });
          } catch (fileError) {
            console.error(`Erreur fichier ${file.id}:`, fileError);
          }
        }
        
        setDownloadUrls(urls);
        
        if (urls.length === 0) {
          setError('Aucun fichier disponible pour le moment');
        }
      } else {
        setError('Aucun fichier disponible pour ce produit');
      }
    } catch (err) {
      console.error('Erreur récupération fichiers:', err);
      setError('Erreur lors de la récupération des fichiers');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl, fileName) => {
    if (fileUrl) {
      // Créer un lien temporaire pour le téléchargement
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('video')) return '🎬';
    if (fileType.includes('zip') || fileType.includes('archive')) return '📦';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (canDownload) {
      fetchProductFiles();
    }
  }, [canDownload, product.id]);

  if (!canDownload) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Le téléchargement sera disponible après confirmation du paiement
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Statut actuel: <strong>{order?.status || 'En attente'}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        📥 Télécharger votre achat
      </h3>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader />
          <span className="ml-2 text-gray-600">Chargement des fichiers...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {downloadUrls.length > 0 && !loading && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-green-700 font-medium">
                  Votre achat est prêt !
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {downloadUrls.length} fichier(s) disponible(s)
                </p>
              </div>
            </div>
          </div>

          {/* Liste des fichiers */}
          <div className="space-y-3">
            {downloadUrls.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getFileIcon(file.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleDownload(file.url, file.name)}
                >
                  📥 Télécharger
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Important:</strong> Les liens de téléchargement expirent dans 1h30
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Téléchargez et sauvegardez vos fichiers rapidement
                </p>
              </div>
            </div>
          </div>

          {/* Bouton de regénération */}
          <div className="flex justify-center">
            <Button
              variant="secondary"
              onClick={fetchProductFiles}
              size="small"
            >
              🔄 Regénérer les liens
            </Button>
          </div>
        </div>
      )}

      {!downloadUrls.length && !loading && !error && (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">
            Aucun fichier disponible pour le moment
          </p>
          <Button
            variant="secondary"
            onClick={fetchProductFiles}
          >
            🔍 Vérifier à nouveau
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductDownload;
