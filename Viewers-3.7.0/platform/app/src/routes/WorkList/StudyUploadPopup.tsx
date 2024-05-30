import { Modal, ProgressLoadingBar } from '@ohif/ui';
import React, { useState,useRef, useEffect } from 'react';
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

  const handleFilesDrop = (files) => {
    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      uploadFileToServer(files[i], files.length, i).then(() => {
        if (i === files.length - 1) {
          if (isMounted.current) {
            onComplete();  // Appel de onComplete après le dernier fichier
            setIsUploading(false);
          }
        }
      });
    }
  };

  const uploadFileToServer = async (file, totalFiles, currentIndex) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/uploadDicom', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      const updatedIndex = currentIndex + 1;
      if (isMounted.current) {
        setUploadProgress((updatedIndex / totalFiles) * 100);
        setFilesCounter(`${updatedIndex}/${totalFiles}`);
      }

      if (currentIndex === totalFiles - 1) {
        setTimeout(() => {
          if (isMounted.current) {
            setUploadProgress(null);
            setFilesCounter(null);
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier:", error);
      if (isMounted.current) {
        setUploadProgress(null);
        setFilesCounter(null);
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

export default StudyUploadPopup;
