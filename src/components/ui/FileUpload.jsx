// src/components/ui/FileUpload.jsx
import React, { useRef } from 'react';
import Button from './Button';

const FileUpload = ({ onFileSelect, acceptedTypes, maxSize, loading = false }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier la taille du fichier
    if (maxSize && file.size > maxSize) {
      alert(`Fichier trop volumineux. Maximum: ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-center w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        className="hidden"
      />
      
      <div 
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
        onClick={handleClick}
      >
        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        
        <div className="text-sm text-gray-600 text-center">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
          >
            {loading ? 'Upload...' : 'Choisir un fichier'}
          </Button>
          <p className="mt-1 text-xs text-gray-500">
            {acceptedTypes} (Max: {maxSize ? `${maxSize / (1024 * 1024)}MB` : '50MB'})
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
