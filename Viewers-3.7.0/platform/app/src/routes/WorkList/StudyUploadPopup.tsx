import { Button, Modal, ProgressLoadingBar } from '@ohif/ui';
import React, { useState } from 'react';
import DragAndDrop from './DragAndDrop';

const StudyUploadPopup = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // null indique qu'aucun upload n'est en cours

  const handleFilesDrop = (files) => {
    // init la progression à 0 au début de l'upload
    setUploadProgress(0);
    for (let i = 0; i < files.length; i++) {
      uploadFileToServer(files[i], files.length, i);
    }
  };

  const uploadFileToServer = async (file, totalFiles, currentIndex) => {
    const formData = new FormData();
    formData.append('file', file);
    console.log("Envoi du fichier:", file.name);
    
    try {
      const response = await fetch('http://localhost:5000/uploadDicom', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      
      console.log("Upload réussi:", result);

      // update la progression en fonction du nombre de fichiers traités
      setUploadProgress(((currentIndex + 1) / totalFiles) * 100);

      // Si c'est le dernier fichier, on reset la progression après un court délai
      if (currentIndex === totalFiles - 1) {
        setTimeout(() => setUploadProgress(null), 2000); // cache la barre après 2 secondes
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier:", error);
      setUploadProgress(null); // cache la barre en cas d'erreur
    }
  };

  return (
    <>
      <Button onClick={() => setModalIsOpen(true)}>Ajouter des études</Button>
      <Modal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        title="Ajouter des études"
        closeButton={true}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <div>
          <DragAndDrop onDrop={handleFilesDrop} />
          {/* affichage de la barre de progression uniquement si uploadProgress n'est pas null */}
          {uploadProgress !== null && <ProgressLoadingBar progress={uploadProgress} />}
        </div>
      </Modal>
    </>
  );
};

export default StudyUploadPopup;
