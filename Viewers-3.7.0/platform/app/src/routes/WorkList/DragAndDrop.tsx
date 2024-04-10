import React from 'react';

const DragAndDrop = ({ onDrop }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 p-10 text-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      Glissez et déposez des fichiers DICOM ici ou cliquez pour sélectionner des fichiers.
    </div>
  );
};

export default DragAndDrop;
