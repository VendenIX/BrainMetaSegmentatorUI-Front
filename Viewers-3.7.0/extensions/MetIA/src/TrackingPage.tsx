import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link,useNavigate} from 'react-router-dom';
import { ServicesManager, hotkeys, utils } from '@ohif/core';
import { useAppConfig } from '@state';

import {
  AboutModal,
  Button,
  EmptyStudies,
  Header,
  Icon,
  LegacyButton,
  LoadingIndicatorProgress,
  StudyListExpandedRow,
  StudyListFilter,
  StudyListPagination,
  StudyListTable,
  TooltipClipboard,
  UserPreferences,
  useModal,
  ButtonGroup
} from '@ohif/ui';

import i18n from '@ohif/i18n';

const TrackingPage = ({ servicesManager, extensionManager, hotkeysManager }) => {
    const { show, hide } = useModal();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const hotkeyDefinitions = hotkeysManager.getValidHotkeyDefinitions();
    const currentLanguage = i18n.language;
    const versionNumber = process.env.VERSION_NUMBER;
    const commitHash = process.env.COMMIT_HASH;
    const [appConfig] = useAppConfig();
    const menuOptions = [
      {
        title: t('Header:About'),
        icon: 'info',
        onClick: () =>
          show({
            content: AboutModal,
            title: 'About OHIF Viewer',
            contentProps: { versionNumber: versionNumber, commitHash: commitHash },
          }),
      },
      {
        title: t('Header:Preferences'),
        icon: 'settings',
        onClick: () =>
          show({
            title: t('UserPreferencesModal:User Preferences'),
            content: UserPreferences,
            contentProps: {
              hotkeyDefaults: hotkeysManager.getValidHotkeyDefinitions(),
              hotkeyDefinitions,
              onCancel: hide,
              currentLanguage: currentLanguage,
              availableLanguages: i18n.options.languages,
              defaultLanguage: i18n.options.fallbackLng,
              onSubmit: state => {
                if (state.language.value !== currentLanguage) {
                  i18n.changeLanguage(state.language.value);
                }
                hotkeysManager.setHotkeys(state.hotkeyDefinitions);
                hide();
              },
              onReset: () => hotkeysManager.restoreDefaultBindings(),
            },
          }),
      },
    ];

  if (appConfig.oidc) {
    menuOptions.push({
      icon: 'power-off',
      title: t('Header:Logout'),
      onClick: () => {
        navigate(`/logout?redirect_uri=${encodeURIComponent(window.location.href)}`);
      },
    });
  }

  const API_URL = 'http://localhost:5000';

// Récupérer toutes les études
  const getEtudes = () => {
    console.log("getEtudes");
    return fetch(`${API_URL}/followup-etudes`)
        .then(response => response.json())
        .catch(error => console.error(`Erreur lors de la récupération des études : ${error}`));
};


// Récupérer toutes les études d'un patient
  const getEtudesFromPatient = (idPatient) => {
    console.log(`Fetching studies for patient ${idPatient}...`);
    return fetch(`${API_URL}/followup-etudes?idPatient=${idPatient}`)
        .then(response => response.json())
        .then(data => {
            console.log(`Studies for patient ${idPatient} retrieved:`, data);
            return data;
        })
        .catch(error => console.error(`Error fetching studies for patient ${idPatient}: ${error}`));
}


// Récupérer toutes les métastases d'une étude
const getMetastasesFromEtude = (idEtude) => {
  console.log(`Fetching metastases for study ${idEtude}...`);
  return fetch(`${API_URL}/followup-metastases?idEtude=${idEtude}`)
      .then(response => response.json())
      .then(data => {
          console.log(`Metastases for study ${idEtude} retrieved:`, data);
          return data;
      })
      .catch(error => console.error(`Error fetching metastases for study ${idEtude}: ${error}`));
};

// Récupérer toutes les informations des patients
const getPatients = () => {
  console.log("Fetching patients...");
  return fetch(`${API_URL}/followup-patients`)
      .then(response => response.json())
      .then(data => {
          console.log("Patients retrieved:", data);
          return data;
      })
      .catch(error => console.error(`Error fetching patients: ${error}`));
};

  return (
    <div className="flex h-screen flex-col">
      <Header
        isSticky
        menuOptions={menuOptions}
        isReturnEnabled={true}
        onClickReturnButton={() => navigate('/')}
      />
      <div className="tracking-page p-4">
        <h1 className="text-xl font-bold">Tracking Page</h1>
        <p>This is the tracking page for our application.</p>
        <Button onClick={() => console.log(getMetastasesFromEtude(3))}>Click me</Button>
      </div>
    </div>
  );
};

export default TrackingPage;
