import classNames from 'classnames';
import React, { useEffect } from 'react';

import { ModalWrapperContent } from '@/app/Layout';
import { LoaderModalContent } from '@/entities';
import { CloseModal } from '@/features';
import { NavigationContentScreen } from '@/widgets';

import {
  getPostEntitiesForPasteInsert,
  getViewersStateFromStorage,
  subscribeViewersStateFromStorage
} from '../model';
import styles from './AppModalPaste.module.scss';

chrome.runtime.sendMessage({
  action: 'getEntities',
  payload: window.location.origin
});

export const AppModalPaste = () => {
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
