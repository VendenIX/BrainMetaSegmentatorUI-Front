import { Modal, ProgressLoadingBar } from '@ohif/ui';
import React, { useState, useRef, useEffect } from 'react';
import DragAndDrop from './DragAndDrop';

const StudyUploadPopup = ({ isOpen, onClose, onComplete }) => {
  const [uploadProgress, setUploadProgress] = useState(null);
  const [filesCounter, setFilesCounter] = useState(null);
  const isMounted = useRef(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleFilesDrop = async (files) => {
    await handleFileUpload(Array.from(files));
  };

  const handleFilesSelection = async (event) => {
    const files = event.target.files;
    await handleFileUpload(Array.from(files));
  };

  const handleFileUpload = async (files) => {
    setIsUploading(true);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file);
    });

    try {
      const response = await fetch('http://localhost:5000/uploadDicom', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (isMounted.current) {
        onComplete();
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des fichiers:", error);
      if (isMounted.current) {
        setIsUploading(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajouter des études"
      closeButton={true}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div>
        <DragAndDrop onDrop={handleFilesDrop} isUploading={isUploading} />
        {uploadProgress !== null && (
          <>
            <ProgressLoadingBar progress={uploadProgress} />
            <div style={{ color: 'lightblue', textAlign: 'center' }}>
              {filesCounter}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

const styles = {
  fileInput: {
    display: 'block',
    marginTop: '10px',
    padding: '10px',
    border: '1px solid #30363D',
    borderRadius: '4px',
    backgroundColor: '#0D1117',
    color: '#CCCCCC',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    backgroundColor: '#1E1E1E', // un fond plus foncé
    color: '#CCCCCC', // texte gris clair pour contraste
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px', // Bords arrondis
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // ombre légère pour du relief
    marginTop: '20px',
    overflowX: 'auto' // pour la gestion du débordement sur l'axe X
  },
  title: {
    color: '#58A6FF', // bleu clair
    textAlign: 'center',
    marginBottom: '20px' // espace sous le titre
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#CCCCCC' // texte de la table en gris clair
  },
  header: {
    backgroundColor: '#0D1117', // fond d'en-tête plus foncé
    padding: '10px',
    textAlign: 'left',
    color: '#58A6FF', // texte de l'en-tête en bleu
    borderBottom: '2px solid #30363D' // ligne de séparation
  },
  row: {
    backgroundColor: '#161B22', // alternance de couleur pour les rangées
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#30363D' // couleur au survol
    }
  },
  cell: {
    padding: '10px',
    borderBottom: '1px solid #30363D' // ligne de séparation plus subtile
  }
};

export default StudyUploadPopup;
