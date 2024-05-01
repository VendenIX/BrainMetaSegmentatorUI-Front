import React from 'react';
import { Button } from '@ohif/ui';


const SegmentationButton = ({ onSegmentation }) => {
  return (
    <Button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onSegmentation}
    >
      Perform MetIA Segmentation
    </Button>
  );
};

export default SegmentationButton;
