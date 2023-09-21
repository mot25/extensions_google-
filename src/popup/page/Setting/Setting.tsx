import React, { useState } from 'react';

import ArrowBack from '@/shared/assets/icon/Icon_arrowLeft.svg';
import { SimpleButton } from '@/shared/ui/SimpleButton';

import { AllowUrl } from '../AllowUrl';
import styles from './Setting.module.scss';

const Setting = () => {
  const pageRoute = {
    addPortal: <AllowUrl />
  };
  type keyPageType = keyof typeof pageRoute | '';
  const [selectPage, setSelectPage] = useState<keyPageType>('');
  const addHotRelaod = () => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        const currentTabId = tabs[0].id;

        await chrome.scripting.executeScript({
          target: { tabId: currentTabId },
          files: ['hotReloadNS.js']
        });
      }
    );
  };
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
            onClick={addHotRelaod}
            text="Добавить хот релоад "
          />
        </div>
      )}
    </div>
  );
};

export default Setting;
