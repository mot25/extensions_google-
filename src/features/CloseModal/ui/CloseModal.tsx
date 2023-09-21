import { removeExtensionsFromPage } from '@/shared/utils/utils';
import React from 'react';
import IconClose from '../assets/icon/IconClose.svg';
import styles from './CloseModal.module.scss';

export const CloseModal = () => {
  return (
    <div
      onClick={removeExtensionsFromPage}
      className={styles.top}
    >
      <IconClose />
    </div>
  );
};
