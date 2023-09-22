import React, { useState } from 'react';

import ArrowBack from '@/shared/assets/icon/Icon_arrowLeft.svg';
import { SimpleButton } from '@/shared/ui/SimpleButton';

import { AllowUrl } from '../../AllowUrl';
import { addHotReload } from '../model';
import styles from './Setting.module.scss';

const Setting = () => {
  const pageRoute = {
    addPortal: <AllowUrl />
  };
  type keyPageType = keyof typeof pageRoute | '';
  const [selectPage, setSelectPage] = useState<keyPageType>('');

  return (
    <div className={styles.wrapper}>
      <div className={styles.head}>
        {selectPage && (
          <div
            className={styles.left}
            onClick={() => setSelectPage('')}
          >
            <ArrowBack />
          </div>
        )}
        <h1>Настройки</h1>
      </div>
      {selectPage ? (
        pageRoute[selectPage] || <AllowUrl />
      ) : (
        <div>
          <SimpleButton
            onClick={() => setSelectPage('addPortal')}
            text="Посмотреть настройки расширения"
          />
          <SimpleButton
            onClick={addHotReload}
            text="Добавить хот релоад "
          />
        </div>
      )}
    </div>
  );
};

export default Setting;
