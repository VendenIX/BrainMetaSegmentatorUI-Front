import React, { useEffect } from 'react';

const ButtonPanelComponent = ({ servicesManager }) => {
  useEffect(() => {
    // Ici, vous pouvez accéder aux services via servicesManager et récupérer les données nécessaires
    // Exemple: Accéder à un service fictif 'currentStudyService' qui stocke l'ID de l'étude courante
    // Cette partie du code dépend de comment votre application et services sont structurés
    const hangingProtocolService = servicesManager.services.HangingProtocolService;

    if (hangingProtocolService && hangingProtocolService.activeStudy) {
      // Récupérer l'ID de l'étude active
      const studyInstanceUID = hangingProtocolService.activeStudy.StudyInstanceUID;
      console.log(`StudyInstanceUID courant: ${studyInstanceUID}`);
    }
  }, [servicesManager]);

  return (
    <div className="text-white w-full text-center">
      <button>Cliquez moi</button>
    </div>
  );
};

export default ButtonPanelComponent;
