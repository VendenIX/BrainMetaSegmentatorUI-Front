import React, { useEffect } from 'react';
import SegmentationButton from './SegmentationButton';

const ButtonPanelComponent = ({ servicesManager }) => {
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
      
      // Ici, vous pouvez intégrer l'appel API pour la segmentation en utilisant `studyInstanceUID`
      // Exemple:
      fetch(`http://localhost:5000/segmentation/${studyInstanceUID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert("Segmentation and RTStruct upload completed successfully");
      })
      .catch(error => {
        console.error('There was an error during segmentation or RTStruct upload:', error);
        alert("Failed to complete segmentation or RTStruct upload");
      });
    }
  };

  return (
    <div className="text-white w-full text-center">
      <SegmentationButton onSegmentation={performSegmentation} />
    </div>
  );
};

export default ButtonPanelComponent;
