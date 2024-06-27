import { Modal, Button } from '@ohif/ui';
import React from 'react';

const ConfirmDeletionPopup = ({ isOpen, onClose, onConfirm, message, isProcessing, isFinished }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmation de suppression"
      closeButton={!isProcessing} // Désactive le bouton de fermeture pendant le traitement
      shouldCloseOnEsc={!isProcessing}
      shouldCloseOnOverlayClick={!isProcessing}
    >
      <div className="p-4">
        <p>{message}</p>
        <div className="flex justify-end space-x-2 mt-4">
          {isProcessing ? (
            <Button variant="contained" disabled>
              Traitement...
            </Button>
          ) : isFinished ? (
            <Button variant="outlined" onClick={onClose}>
              Fermer
            </Button>
          ) : (
            <>
              <Button variant="outlined" onClick={onClose}>
                Annuler
              </Button>
              <Button variant="contained" color="secondary" onClick={onConfirm}>
                Supprimer
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeletionPopup;
