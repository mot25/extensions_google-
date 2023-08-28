import { EntitiesType, ViewerType } from '@/type/entities.dto';
import React, { useEffect, useState } from 'react';

import styles from './CopyViewer.module.scss';
// eslint-disable-next-line max-len
import { ViewerForCopyOrDelete } from '@/components/complex/ViewerForCopyOrDelete';

type Props = {
  entitiesFromPaste: EntitiesType[];
  viewersForPaste: ViewerType[];
  addStateViewers: (view: ViewerType) => void;
};

const OneScreenCopyModal = ({
  entitiesFromPaste,
  viewersForPaste: viewerForPaste,
  addStateViewers
}: Props) => {
  const entity: EntitiesType = entitiesFromPaste.find(
    (_: EntitiesType) => _.isCurrent
  );

  const [_entitiesFromPaste, _setEntitiesFromPaste] = useState<EntitiesType[]>(
    []
  );

  const removeListViewer = (id: string) => {
    _setEntitiesFromPaste(prev => prev.filter(_ => _.Id !== id));
  };
  useEffect(
    () => _setEntitiesFromPaste(entitiesFromPaste),
    [entitiesFromPaste]
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
              removeListViewer={removeListViewer}
              entitiesFromPaste={_entitiesFromPaste}
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
