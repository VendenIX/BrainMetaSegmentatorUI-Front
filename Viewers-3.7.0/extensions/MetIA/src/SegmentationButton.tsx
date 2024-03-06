import React from 'react';

const SegmentationButton = ({ onSegmentation }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onSegmentation}
    >
      Perform Segmentation and Upload RTStruct
    </button>
  );
};

export default SegmentationButton;
