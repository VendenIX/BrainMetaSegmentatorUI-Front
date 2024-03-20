import React, { useEffect, useState } from 'react';
import SegmentationButton from './SegmentationButton';

const ButtonPanelComponent = ({ servicesManager }) => {
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const hangingProtocolService = servicesManager.services.HangingProtocolService;

    if (hangingProtocolService && hangingProtocolService.activeStudy) {
      const studyInstanceUID = hangingProtocolService.activeStudy.StudyInstanceUID;
      console.log(servicesManager.services);
      console.log(`StudyInstanceUID courant: ${studyInstanceUID}`);
    }
  }, [servicesManager]);

  const performSegmentation = () => {
    const hangingProtocolService = servicesManager.services.HangingProtocolService;
    if (hangingProtocolService && hangingProtocolService.activeStudy) {
      const studyInstanceUID = hangingProtocolService.activeStudy.StudyInstanceUID;
      
      fetch(`http://localhost:5000/segmentation/${studyInstanceUID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMessage({ text: 'Operation successful', type: 'success' });
      })
      .catch(error => {
        console.error('There was an error during segmentation or RTStruct upload:', error);
        setMessage({ text: 'Failed to complete segmentation or RTStruct upload', type: 'error' });
      });
    }
  };

  return (
    <div className="text-white w-full text-center">
      <SegmentationButton onSegmentation={performSegmentation} />
      {message.text && (
        <div style={{ color: message.type === 'success' ? 'green' : 'red' }}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ButtonPanelComponent;
