import { createReportAsync } from '@ohif/extension-default';
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SegmentationGroupTable, LegacyButtonGroup, LegacyButton } from '@ohif/ui';

import callInputDialog from './callInputDialog';
import callColorPickerDialog from './colorPickerDialog';
import { useTranslation } from 'react-i18next';
import { HangingProtocol } from 'platform/core/src/types';
import { forEach } from 'platform/core/src/utils/hierarchicalListUtils';

export default function PanelSegmentation({
  servicesManager,
  commandsManager,
  extensionManager,
  configuration,
}) {
  const { segmentationService, viewportGridService, uiDialogService } = servicesManager.services;

  const { t } = useTranslation('PanelSegmentation');

  const [selectedSegmentationId, setSelectedSegmentationId] = useState(null);
  const [segmentationConfiguration, setSegmentationConfiguration] = useState(
    segmentationService.getConfiguration()
  );

  const [segmentations, setSegmentations] = useState(() => segmentationService.getSegmentations());

  useEffect(() => {
    // ~~ Subscription
    const added = segmentationService.EVENTS.SEGMENTATION_ADDED;
    const updated = segmentationService.EVENTS.SEGMENTATION_UPDATED;
    const removed = segmentationService.EVENTS.SEGMENTATION_REMOVED;
    const subscriptions = [];

    [added, updated, removed].forEach(evt => {
      const { unsubscribe } = segmentationService.subscribe(evt, () => {
        const segmentations = segmentationService.getSegmentations();
        setSegmentations(segmentations);
        setSegmentationConfiguration(segmentationService.getConfiguration());
      });
      subscriptions.push(unsubscribe);
    });

    return () => {
      subscriptions.forEach(unsub => {
        unsub();
      });
    };
  }, []);

  const getToolGroupIds = segmentationId => {
    const toolGroupIds = segmentationService.getToolGroupIdsWithSegmentation(segmentationId);

    return toolGroupIds;
  };

  const onSegmentationAdd = async () => {
    commandsManager.runCommand('createEmptySegmentationForViewport');
  };

  const onSegmentationClick = (segmentationId: string) => {
    segmentationService.setActiveSegmentationForToolGroup(segmentationId);
  };

  const onSegmentationDelete = (segmentationId: string) => {
    segmentationService.remove(segmentationId);
  };

  const onSegmentAdd = segmentationId => {
    segmentationService.addSegment(segmentationId);
  };

  const onSegmentClick = (segmentationId, segmentIndex) => {
    console.log("j'ai cliqué sur une ROI d'id", segmentationId, "et d'index", segmentIndex);
    segmentationService.setActiveSegment(segmentationId, segmentIndex);

    const toolGroupIds = getToolGroupIds(segmentationId);

    toolGroupIds.forEach(toolGroupId => {
      // const toolGroupId =
      segmentationService.setActiveSegmentationForToolGroup(segmentationId, toolGroupId);
      segmentationService.jumpToSegmentCenter(segmentationId, segmentIndex, toolGroupId);
    });
  };

  /*
  const onSegmentEdit = (segmentationId, segmentIndex) => {
    console.log("j'ai cliqué sur renommer la roi d'id", segmentationId, "et d'index", segmentIndex);
    const hangingProtocolService = servicesManager.services.DisplaySetService.activeDisplaySets;
    let SOPInstanceUID = null;
    console.log(servicesManager.services);
    hangingProtocolService.forEach(element => {
      if (element.Modality == "RTSTRUCT"){
        console.log(element.SOPInstanceUID);
        SOPInstanceUID = element.SOPInstanceUID;
      }
    });
    const segmentation = segmentationService.getSegmentation(segmentationId);

    const segment = segmentation.segments[segmentIndex];
    const { label } = segment;

    callInputDialog(uiDialogService, label, (label, actionId) => {
      if (label === '') {
        return;
      }

      segmentationService.setSegmentLabel(segmentationId, segmentIndex, label);

      console.log("je devrais donc sur l'api faire un renommage de la roi d'id", segmentationId, "et d'index", segmentIndex, "en ", label);
    });
  };
*/
  const onSegmentEdit = (segmentationId, segmentIndex) => {
    console.log("j'ai cliqué sur renommer la roi d'id", segmentationId, "et d'index", segmentIndex);

    const hangingProtocolService = servicesManager.services.DisplaySetService.activeDisplaySets;
    let StudyInstanceUID = null;
    let ROINumber = null;
    console.log(servicesManager.services);

    // Récupérer le SOPInstanceUID
    hangingProtocolService.forEach(element => {
      if (element.Modality == "RTSTRUCT") {
        console.log(element.StudyInstanceUID);
        StudyInstanceUID = element.StudyInstanceUID;
        ROINumber = segmentIndex;
      }
    });

    if (!StudyInstanceUID || !ROINumber) {
      console.error('StudyInstanceUID not found');
      return;
    }

    const segmentation = segmentationService.getSegmentation(segmentationId);
    const segment = segmentation.segments[segmentIndex];
    const { label } = segment;

    callInputDialog(uiDialogService, label, (newLabel, actionId) => {
      if (newLabel === '') {
        return;
      }
      segmentationService.setSegmentLabel(segmentationId, segmentIndex, newLabel); //on ment à l'utilisatuer provisoirement pour le moment
      // Faire l'appel à l'API pour renommer la ROI
      fetch('http://localhost:5000/rename-roi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          study_instance_uid: StudyInstanceUID,
          roi_number: ROINumber,
          new_name: newLabel,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log("ROI renamed successfully");
          //segmentationService.setSegmentLabel(segmentationId, segmentIndex, newLabel);
          //On pourrait try de le mettre ici mais faudrait retirer le téléchargement des dicoms obligatoire et donc revoir le code
        } else {
          console.error("Error renaming ROI:", data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  };

  const onSegmentationEdit = segmentationId => {
    const segmentation = segmentationService.getSegmentation(segmentationId);
    const { label } = segmentation;

    callInputDialog(uiDialogService, label, (label, actionId) => {
      if (label === '') {
        return;
      }

      segmentationService.addOrUpdateSegmentation(
        {
          id: segmentationId,
          label,
        },
        false, // suppress event
        true // notYetUpdatedAtSource
      );
    });
  };

  const onSegmentColorClick = (segmentationId, segmentIndex) => {
    const segmentation = segmentationService.getSegmentation(segmentationId);

    const segment = segmentation.segments[segmentIndex];
    const { color, opacity } = segment;

    const rgbaColor = {
      r: color[0],
      g: color[1],
      b: color[2],
      a: opacity / 255.0,
    };

    callColorPickerDialog(uiDialogService, rgbaColor, (newRgbaColor, actionId) => {
      if (actionId === 'cancel') {
        return;
      }

      segmentationService.setSegmentRGBAColor(segmentationId, segmentIndex, [
        newRgbaColor.r,
        newRgbaColor.g,
        newRgbaColor.b,
        newRgbaColor.a * 255.0,
      ]);
    });
  };

  const onSegmentDelete = (segmentationId, segmentIndex) => {
    segmentationService.removeSegment(segmentationId, segmentIndex);
  };

  const onToggleSegmentVisibility = (segmentationId, segmentIndex) => {
    const segmentation = segmentationService.getSegmentation(segmentationId);
    const segmentInfo = segmentation.segments[segmentIndex];
    const isVisible = !segmentInfo.isVisible;
    const toolGroupIds = getToolGroupIds(segmentationId);

    // Todo: right now we apply the visibility to all tool groups
    toolGroupIds.forEach(toolGroupId => {
      segmentationService.setSegmentVisibility(
        segmentationId,
        segmentIndex,
        isVisible,
        toolGroupId
      );
    });
  };

  const onToggleSegmentLock = (segmentationId, segmentIndex) => {
    segmentationService.toggleSegmentLocked(segmentationId, segmentIndex);
  };

  const onToggleSegmentationVisibility = segmentationId => {
    segmentationService.toggleSegmentationVisibility(segmentationId);
  };

  const _setSegmentationConfiguration = useCallback(
    (segmentationId, key, value) => {
      segmentationService.setConfiguration({
        segmentationId,
        [key]: value,
      });
    },
    [segmentationService]
  );

  const onSegmentationDownload = segmentationId => {
    commandsManager.runCommand('downloadSegmentation', {
      segmentationId,
    });
  };

  const storeSegmentation = async segmentationId => {
    const datasources = extensionManager.getActiveDataSource();

    const displaySetInstanceUIDs = await createReportAsync({
      servicesManager,
      getReport: () =>
        commandsManager.runCommand('storeSegmentation', {
          segmentationId,
          dataSource: datasources[0],
        }),
      reportType: 'Segmentation',
    });

    // Show the exported report in the active viewport as read only (similar to SR)
    if (displaySetInstanceUIDs) {
      // clear the segmentation that we exported, similar to the storeMeasurement
      // where we remove the measurements and prompt again the user if they would like
      // to re-read the measurements in a SR read only viewport
      segmentationService.remove(segmentationId);

      viewportGridService.setDisplaySetsForViewport({
        viewportId: viewportGridService.getActiveViewportId(),
        displaySetInstanceUIDs,
      });
    }
  };

  const onSegmentationDownloadRTSS = segmentationId => {
    commandsManager.runCommand('downloadRTSS', {
      segmentationId,
    });
  };

  return (
    <>
      <div className="ohif-scrollbar flex min-h-0 flex-auto select-none flex-col justify-between overflow-auto">
        <SegmentationGroupTable
          title={t('Segmentations')}
          segmentations={segmentations}
          disableEditing={configuration.disableEditing}
          activeSegmentationId={selectedSegmentationId || ''}
          onSegmentationAdd={onSegmentationAdd}
          onSegmentationClick={onSegmentationClick}
          onSegmentationDelete={onSegmentationDelete}
          onSegmentationDownload={onSegmentationDownload}
          onSegmentationDownloadRTSS={onSegmentationDownloadRTSS}
          storeSegmentation={storeSegmentation}
          onSegmentationEdit={onSegmentationEdit}
          onSegmentClick={onSegmentClick}
          onSegmentEdit={onSegmentEdit}
          onSegmentAdd={onSegmentAdd}
          onSegmentColorClick={onSegmentColorClick}
          onSegmentDelete={onSegmentDelete}
          onToggleSegmentVisibility={onToggleSegmentVisibility}
          onToggleSegmentLock={onToggleSegmentLock}
          onToggleSegmentationVisibility={onToggleSegmentationVisibility}
          showDeleteSegment={true}
          segmentationConfig={{ initialConfig: segmentationConfiguration }}
          setRenderOutline={value =>
            _setSegmentationConfiguration(selectedSegmentationId, 'renderOutline', value)
          }
          setOutlineOpacityActive={value =>
            _setSegmentationConfiguration(selectedSegmentationId, 'outlineOpacity', value)
          }
          setRenderFill={value =>
            _setSegmentationConfiguration(selectedSegmentationId, 'renderFill', value)
          }
          setRenderInactiveSegmentations={value =>
            _setSegmentationConfiguration(
              selectedSegmentationId,
              'renderInactiveSegmentations',
              value
            )
          }
          setOutlineWidthActive={value =>
            _setSegmentationConfiguration(selectedSegmentationId, 'outlineWidthActive', value)
          }
          setFillAlpha={value =>
            _setSegmentationConfiguration(selectedSegmentationId, 'fillAlpha', value)
          }
          setFillAlphaInactive={value =>
            _setSegmentationConfiguration(selectedSegmentationId, 'fillAlphaInactive', value)
          }
        />
      </div>
    </>
  );
}

PanelSegmentation.propTypes = {
  commandsManager: PropTypes.shape({
    runCommand: PropTypes.func.isRequired,
  }),
  servicesManager: PropTypes.shape({
    services: PropTypes.shape({
      segmentationService: PropTypes.shape({
        getSegmentation: PropTypes.func.isRequired,
        getSegmentations: PropTypes.func.isRequired,
        toggleSegmentationVisibility: PropTypes.func.isRequired,
        subscribe: PropTypes.func.isRequired,
        EVENTS: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
