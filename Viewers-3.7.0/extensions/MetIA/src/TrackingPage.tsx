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
import PatientList from './PatientList';
import StudyList from './StudyList';
import MetastasisList from './MetastasisList';
import SeriesList from './SeriesList';

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

const [selectedPatient, setSelectedPatient] = useState(null);
const [selectedStudy, setSelectedStudy] = useState(null);
const [selectedSerie, setSelectedSerie] = useState(null);

  return (
    <div className="flex h-screen flex-col">
        <Header
          isSticky
          menuOptions={menuOptions}
          isReturnEnabled={true}
          onClickReturnButton={() => navigate('/')}
        />
        <div className="tracking-page">
          <PatientList onSelectPatient={setSelectedPatient} />
        {selectedPatient && <StudyList onSelectedStudy={setSelectedStudy} patient={selectedPatient} />}
        {selectedStudy && <SeriesList onSelectedSeries={setSelectedSerie} study={selectedStudy} />}
        {selectedSerie && <MetastasisList serie={selectedSerie} />}
        </div>

    </div>
  );
};

export default TrackingPage;
