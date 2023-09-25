import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  entitiesAllSelector,
  viewerForPasteSelector
} from '@/shared/model/slice';
import { EntitiesType, ViewerType } from '@/shared/type';
import { ViewerForCopyOrDelete } from '@/widgets/ViewerForCopyOrDelete';

import { addStateViewers, getEntityInEntitiesForPaste } from '../model';
import styles from './CopyViewer.module.scss';

const OneScreenCopyModal = () => {
  const viewerForPaste = useSelector(viewerForPasteSelector);
  const [entity, setEntity] = useState<EntitiesType>();
  const entitiesAll = useSelector(entitiesAllSelector);

  useEffect(() => {
    setEntity(getEntityInEntitiesForPaste(entitiesAll));
  }, [entitiesAll]);
  return (
    <div>
      <h4 style={{ fontWeight: 'bold' }}>
        Выберите вид для копирование/удаления
      </h4>
      <ul className={styles.wrapperItem}>
        {entity?.Viewers?.map((viewer: ViewerType, index: number) => {
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
