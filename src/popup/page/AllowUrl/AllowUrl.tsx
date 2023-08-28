import React, { useEffect, useState } from 'react';

import styles from './AllowUrl.module.scss';
import { DropDownEditValues } from '@/components/simple/DropDownEditValues';
import { SimpleButton } from '@/components/simple/SimpleButton';
import { OptionsType } from '@/type/components.dto';
import { RenderWarningTextInPopup } from '@/shared/utils/components';

const AllowUrl = () => {
  const [allowBaseUrl, setAllowBaseUrl] = useState<OptionsType[] | undefined>();

  const changeAllowUrl = (id: string, newUrl: string) => {
    setAllowBaseUrl(prev =>
      prev.map(_ => {
        if (_.value === id) _.label = newUrl;
        return _;
      })
    );
  };
  const deleteAllowUrl = (id: string) => {
    setAllowBaseUrl(prev => prev.filter(_ => _.value !== id));
  };
  const createAllowUrl = async () => {
    const tabs = await chrome.tabs.query({ active: true });
    const currentUrl = new URL(tabs[0].url);
    const isHave = ~allowBaseUrl.findIndex(_ => _.label === currentUrl.origin);
    if (isHave) {
      return new RenderWarningTextInPopup(
        'Такой портал уже есть в списке'
      ).render();
    }
    setAllowBaseUrl(prev => [
      {
        label: currentUrl.origin,
        value: currentUrl.origin
      },
      ...prev
    ]);
  };
  const refreshStorage = async (): Promise<string[]> => {
    if (Array.isArray(allowBaseUrl))
      chrome.storage.sync.set({ allowBaseUrl: allowBaseUrl.map(_ => _.label) });
    const allowUrlsFromStorage = await chrome.storage.sync
      .get(['allowBaseUrl'])
      .then(result => {
        return result.allowBaseUrl;
      });
    return Array.isArray(allowUrlsFromStorage) ? allowUrlsFromStorage : [];
  };
  useEffect(() => {
    refreshStorage();
  }, [allowBaseUrl]);
  useEffect(() => {
    refreshStorage().then(url => {
      setAllowBaseUrl(url.map(_ => ({ label: _, value: _ })));
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <SimpleButton
        onClick={createAllowUrl}
        text={'Добавить текущий портал'}
      />
      <DropDownEditValues
        deleteValue={deleteAllowUrl}
        onChange={changeAllowUrl}
        values={allowBaseUrl || []}
      />
    </div>
  );
};

export default AllowUrl;
