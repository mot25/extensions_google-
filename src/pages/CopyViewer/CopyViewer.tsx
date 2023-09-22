import React from 'react';
import { useSelector } from 'react-redux';

import { ViewerForCopyOrDelete } from '@/widgets/ViewerForCopyOrDelete';
// eslint-disable-next-line max-len
import { EntitiesType, ViewerType } from '@/type/entities.dto';

import { entitiesAllSelector } from '@/shared/model/slice/entitiesSlice/entitiesSlice';
import styles from './CopyViewer.module.scss';

const OneScreenCopyModal = () => {
  const entitiesFromPaste = useSelector(entitiesAllSelector);
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
  const entity: EntitiesType = entitiesFromPaste.find(
    (_: EntitiesType) => _.isCurrent
  );

  return (
    <div>
      <h4 style={{ fontWeight: 'bold' }}>
        Выберите вид для копирование/удаления
      </h4>
      <ul className={styles.wrapperItem}>
        {entity?.Viewers?.map((viewer, index) => {
          const isHave = !!~viewerForPaste.findIndex(
            _ => _?.Caption === viewer?.Caption
          );
          return (
            <ViewerForCopyOrDelete
              isHave={isHave}
              viewer={viewer}
              entity={entity}
              addStateViewers={viewer =>
                addStateViewers({
                  ...viewer,
                  order: index + 1
                })
              }
              key={viewer.Id}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default OneScreenCopyModal;
