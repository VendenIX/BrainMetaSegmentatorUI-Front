import React, { useRef } from 'react';

const DragAndDrop = ({ onDrop, isUploading }) => {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onDrop(e.target.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="text-center">
      <button
        onClick={handleClick}
        className={`mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isUploading} // Désactive le bouton pendant l'upload
      >
        {isUploading ? 'Traitement en cours...' : 'Sélectionner des fichiers'}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleChange}
        disabled={isUploading} // Désactive l'input pendant l'upload
      />
      <div
        className={`border-2 border-dashed border-gray-300 p-10 ${isUploading ? 'opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        Glissez et déposez des fichiers DICOM ici.
      </div>
    </div>
  );
};

export default DragAndDrop;