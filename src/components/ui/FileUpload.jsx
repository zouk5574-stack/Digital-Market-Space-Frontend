// src/components/ui/FileUpload.jsx
import React, { useRef, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import Button from './Button';

const FileUpload = ({ 
  onFileSelect, 
  onFileRemove,
  acceptedTypes = "*",
  maxSize = 50 * 1024 * 1024, // 50MB par défaut
  loading = false,
  multiple = false,
  currentFile = null
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`Fichier "${file.name}" trop volumineux. Maximum: ${maxSize / (1024 * 1024)}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFileSelect(multiple ? validFiles : validFiles[0]);
    }
    
    // Reset input
    event.target.value = '';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        multiple={multiple}
        className="hidden"
      />
      
      {!currentFile ? (
        <div 
          className={`
            flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-2xl cursor-pointer
            transition-all duration-200
            ${dragActive 
              ? 'border-indigo-400 bg-indigo-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className={`w-12 h-12 mb-4 ${dragActive ? 'text-indigo-500' : 'text-gray-400'}`} />
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">
              Glissez-déposez vos fichiers ici
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ou cliquez pour parcourir
            </p>
            
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              className="bg-white border border-gray-300 hover:bg-gray-50"
            >
              {loading ? 'Chargement...' : 'Sélectionner des fichiers'}
            </Button>
            
            <p className="mt-4 text-xs text-gray-400">
              Formats: {acceptedTypes === "*" ? 'Tous' : acceptedTypes} • 
              Max: {formatFileSize(maxSize)}
              {multiple ? ' • Multiple autorisé' : ''}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <File className="w-8 h-8 text-green-500" />
            <div>
              <p className="font-medium text-green-900">
                {currentFile.name}
              </p>
              <p className="text-sm text-green-700">
                {formatFileSize(currentFile.size)}
              </p>
            </div>
          </div>
          
          {onFileRemove && (
            <Button
              variant="secondary"
              size="small"
              onClick={onFileRemove}
              className="bg-red-100 text-red-700 hover:bg-red-200"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
