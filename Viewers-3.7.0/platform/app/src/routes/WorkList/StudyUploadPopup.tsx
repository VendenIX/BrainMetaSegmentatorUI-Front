import { Modal } from '@ohif/ui';
import React, { useState, useRef, useEffect } from 'react';
import DragAndDrop from './DragAndDrop';

const StudyUploadPopup = ({ isOpen, onClose, onComplete }) => {
  const [filesCounter, setFilesCounter] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const isMounted = useRef(true); // Définition de isMounted

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleFilesDrop = async (files) => {
    await handleFileUpload(Array.from(files));
  };

  const handleFileUpload = async (files) => {
    setIsUploading(true);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file);
    });

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch('http://localhost:5000/uploadDicom', {
        method: 'POST',
        body: formData,
        signal,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onComplete();
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Erreur lors de l'envoi des fichiers:", error);
      }
    } finally {
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
        <div style={{ color: 'lightblue', textAlign: 'center' }}>
          {filesCounter}
        </div>
      </div>
    </Modal>
  );
};

export default StudyUploadPopup;