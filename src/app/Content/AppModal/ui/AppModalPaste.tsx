import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ModalWrapperContent } from '@/app/Layout';
import { LoaderModalContent } from '@/entities';
import { CloseModal } from '@/features';
import { setEntitiesForPaste, setViewerForPaste } from '@/shared/model/slice';
import { ViewerType } from '@/shared/type';
import { NavigationContentScreen } from '@/widgets';

import styles from './AppModalPaste.module.scss';

chrome.runtime.sendMessage({
  action: 'getEntities',
  payload: window.location.origin
});

export const AppModalPaste = () => {
  const dispatch = useDispatch();
  const getPostEntitiesForPasteInsert = () => {
    chrome.runtime.onMessage.addListener(function (request) {
      if (request.action === 'postEntitiesForPasteInsert') {
        dispatch(setEntitiesForPaste(request.payload));
      }
    });
  };

  const getViewersStateFromStorage = () => {
    chrome.storage.local.get(['viewersState'], function (result) {
      const allView = result.viewersState && JSON.parse(result.viewersState);
      const saveViewersStorage: ViewerType[] = Array.isArray(allView)
        ? allView
        : [];
      dispatch(setViewerForPaste(saveViewersStorage));
    });
  };
  const subscribeViewersStateFromStorage = () => {
    chrome.storage.onChanged.addListener(changes => {
      for (const [, { newValue }] of Object.entries(changes)) {
        if (!newValue) return;
        const viewers = JSON.parse(newValue);
        dispatch(setViewerForPaste(viewers));
      }
    });
  };
  // chrome
  useEffect(() => {
    getPostEntitiesForPasteInsert();
    getViewersStateFromStorage();
    subscribeViewersStateFromStorage();
  }, []);

  return (
    <ModalWrapperContent>
      <div className={classNames(styles.modal)}>
        <CloseModal />
        <div className={styles.wrapperModal}>
          <LoaderModalContent />
          <NavigationContentScreen />
        </div>
      </div>
    </ModalWrapperContent>
  );
};
