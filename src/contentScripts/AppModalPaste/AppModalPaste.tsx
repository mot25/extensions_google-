/* eslint-disable max-lines */
import IconClose from '@/assets/icon/IconClose.svg';
import IconPaste from '@/assets/icon/IconPaste.svg';
import IconPlus from '@/assets/icon/IconPlus.svg';
import { CopyViewer } from '@/screens/CopyViewer';
import { PasteViewer } from '@/screens/PasteViewer';
import { IconService } from '@/services/Icon.service';
import { MenuLeftNavbar, PageNavigatorType } from '@/type/components.dto';
import { EntitiesType, ViewerType } from '@/type/entities.dto';
import { IconType } from '@/type/icon.dto';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import styles from './AppModalPaste.module.scss';

const leftMenuConfig: MenuLeftNavbar[] = [
  {
    id: 1,
    label: 'Виды в текущем классе',
    title: <IconPlus />
  },
  {
    id: 2,
    label: 'Копировать',
    title: <IconPaste />
  }
];

chrome.runtime.sendMessage({
  action: 'getEntities',
  payload: window.location.origin
});

const AppModalPaste = () => {
  const refModalWrapper = useRef<HTMLDivElement>(null);

  const [entitiesFromPaste, setEntitiesFromPaste] = useState<EntitiesType[]>(
    []
  );

  const [currentRightPage, setCurrentRightPage] = useState<number>(1);
  const [icons, setIcons] = useState<IconType[]>([]);
  const [viewerForPaste, setViewerForPaste] = useState<ViewerType[]>([]);

  const changeOrderViewerInEntities = (id: string, order: number) => {
    const newViewers = viewerForPaste.map(item => {
      if (item.Id === id) item.order = order;
      return item;
    });
    setViewerForPaste(newViewers);
  };
  const removeExtensionsFromPage = () => {
    refModalWrapper.current.classList.toggle(styles.modalWrapper__active);
    const nodes = document.querySelectorAll('#rootContentEntry');
    nodes.forEach(element => {
      element.remove();
    });
    // eslint-disable-next-line no-console
    console.log('extensions remove');
  };
  const fetchIcons = async () => {
    setIcons(await IconService.getIcons());
  };
  const addStateViewers = (view: ViewerType) => {
    chrome.storage.local.get(['viewersState'], function (result) {
      const allView = result.viewersState && JSON.parse(result.viewersState);
      const saveViewersStorage = Array.isArray(allView) ? allView : [];
      saveViewersStorage.push(view);
      chrome.storage.local.set({
        viewersState: JSON.stringify(saveViewersStorage)
      });
    });
  };
  const deleteView = (id: string) => {
    chrome.storage.local.get(['viewersState'], function (result) {
      const allView = result.viewersState && JSON.parse(result.viewersState);
      const saveViewersStorage = allView.filter((item: any) => item.Id !== id);

      chrome.storage.local.set({
        viewersState: JSON.stringify(saveViewersStorage)
      });
    });
  };
  const changeSelectedToggleiewer = (id: string) => {
    setViewerForPaste(prev =>
      prev.map(item => {
        if (item.Id === id) item.isSelected = !item?.isSelected;
        return item;
      })
    );
  };

  const objRoutePage: PageNavigatorType = {
    1: (
      <CopyViewer
        addStateViewers={addStateViewers}
        entitiesFromPaste={entitiesFromPaste}
        viewersForPaste={viewerForPaste}
      />
    ),
    2: (
      <PasteViewer
        deleteView={deleteView}
        changeOrderViewerInEntities={changeOrderViewerInEntities}
        changeSelectedToggleiewer={changeSelectedToggleiewer}
        icons={icons}
        viewerForPaste={viewerForPaste}
        entitiesFromPaste={entitiesFromPaste}
        setViewerForPaste={setViewerForPaste}
      />
    )
  };

  useEffect(() => {
    fetchIcons();
  }, []);

  // chrome
  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request) {
      if (request.action === 'postEntitiesForPasteInsert') {
        setEntitiesFromPaste(request.payload);
      }
    });
    chrome.storage.local.get(['viewersState'], function (result) {
      const allView = result.viewersState && JSON.parse(result.viewersState);
      const saveViewersStorage: ViewerType[] = Array.isArray(allView)
        ? allView
        : [];
      setViewerForPaste(saveViewersStorage);
    });
    chrome.storage.onChanged.addListener(changes => {
      for (const [, { newValue }] of Object.entries(changes)) {
        if (!newValue) return;
        const viewers = JSON.parse(newValue);
        setViewerForPaste(viewers);
      }
    });
    chrome.runtime.onMessage.addListener(function (request) {
      if (request.actions === 'isShowModal') {
        if (request.payload) {
          refModalWrapper.current.classList.add(styles.modalWrapper__active);
        } else {
          refModalWrapper.current.classList.remove(styles.modalWrapper__active);
        }
      }
    });
  }, []);

  return (
    <div
      ref={refModalWrapper}
      className={classNames(styles.modalWrapper, styles.modalWrapper__active)}
    >
      <div className={classNames(styles.modal)}>
        <div
          onClick={() => {
            setTimeout(removeExtensionsFromPage, 1000);
          }}
          className={styles.top}
        >
          <IconClose />
        </div>
        <div className={styles.wrapperModal}>
          <div
            className={classNames(styles.modalLoading, {
              [styles.modalLoading__show]: !entitiesFromPaste?.length
            })}
          >
            {!entitiesFromPaste?.length ? 'Загрузка...' : null}
          </div>
          <div className={styles.wrapperLeft}>
            <ul className={styles.navbar__menu}>
              {leftMenuConfig.map((item, indexCategory) => {
                return (
                  <li
                    key={item.id}
                    onClick={() => setCurrentRightPage(item.id)}
                    className={styles.navbar__item}
                  >
                    <div
                      className={classNames(styles.navbar__link, {
                        [styles.navbar__link__active]:
                          indexCategory + 1 === currentRightPage
                      })}
                    >
                      <div className={styles.navbar__link_img}>
                        {item.title}
                      </div>
                      <span>{item.label}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.wrapperRight}>
            {objRoutePage[currentRightPage]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppModalPaste;
