import { Modal, Button } from '@ohif/ui';
import React from 'react';

const ConfirmDeletionPopup = ({ isOpen, onClose, onConfirm, message, isProcessing, isFinished }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmation de suppression"
      closeButton={true}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div className="p-4">
        <p>{message}</p>
        <div className="flex justify-end space-x-2 mt-4">
          {isFinished ? (
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
          {isProcessing && (
            <Button variant="contained" disabled>
              Traitement...
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeletionPopup;
