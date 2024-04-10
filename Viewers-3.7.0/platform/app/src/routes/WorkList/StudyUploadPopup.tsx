import { Button, Modal, ProgressLoadingBar } from '@ohif/ui';
import React, { useState } from 'react';
import DragAndDrop from './DragAndDrop';

const StudyUploadPopup = ({ onComplete }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // null indique qu'aucun upload n'est en cours
  const [filesCounter, setFilesCounter] = useState(null); // gère le comptage des fichiers traités/total

  const handleFilesDrop = (files) => {
    // Déclenchez l'upload de tous les fichiers, comme avant
    // Après le dernier upload, appelez onComplete
    for (let i = 0; i < files.length; i++) {
        uploadFileToServer(files[i], files.length, i).then(() => {
            if (i === files.length - 1) {
                onComplete(); // Appelez onComplete après le dernier fichier
            }
        });
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
      // update de la barre de progression et du compteur de fichiers
      const updatedIndex = currentIndex + 1;
      setUploadProgress((updatedIndex / totalFiles) * 100);
      setFilesCounter(`${updatedIndex}/${totalFiles}`);

      // reset les états à la fin de l'upload
      if (currentIndex === totalFiles - 1) {
        setTimeout(() => {
          setUploadProgress(null);
          setFilesCounter(null);
        }, 2000); // cache la barre et le compteur après 2 secondes
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier:", error);
      setUploadProgress(null); // cache la barre et le compteur en cas d'erreur
      setFilesCounter(null);
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
          {/* affiche la barre de progression et le compteur de fichiers seulement s'ils ne sont pas null */}
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
    </>
  );
};

export default StudyUploadPopup;
