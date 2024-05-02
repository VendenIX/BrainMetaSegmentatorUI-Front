import React, { useState, useEffect } from 'react';
import { Button, Icon } from '@ohif/ui';

const SegmentationButton = ({ onSegmentation, isLoading }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime + 1); // incremente chaque seconde
      }, 1000);
    } else {
      setTimer(0); // remet a zero le timer lorsque le chargement est terminé
    }
    
    return () => clearInterval(interval); // pour clean l'intervalle
  }, [isLoading]);

  // pour le formatage du temps en HH:MM:SS
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // style pour l'animation de l'icone de chargement
  const iconStyle = {
    animation: 'spin 1s linear infinite'
  };

  return (
    <div>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 8px;
          }
          .loading-text {
            margin-left: 8px;
          }
          .timer-text {
            margin-top: 4px;
            color: #AAA;
          }
        `}
      </style>
      <Button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onSegmentation}
        disabled={isLoading}
      >
        Perform MetIA Segmentation
      </Button>
      {isLoading && (
        <div className="loading-container">
          <Icon name="icon-transferring" style={iconStyle} />
          <span className="loading-text">Loading...</span>
        </div>
      )}
      {isLoading && (
        <div className="timer-text">
          Time elapsed: {formatTime(timer)}
        </div>
      )}
    </div>
  );
};

export default SegmentationButton;
