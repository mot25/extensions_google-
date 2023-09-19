import React from 'react';
import { useSelector } from 'react-redux';

import { ViewerForCopyOrDelete } from '@/components/complex/ViewerForCopyOrDelete';
// eslint-disable-next-line max-len
import { entitiesAllSelector } from '@/store/slice/entitiesSlice/entitiesSlice';
import { EntitiesType, ViewerType } from '@/type/entities.dto';

import styles from './CopyViewer.module.scss';

type Props = {
  viewersForPaste: ViewerType[];
  addStateViewers: (view: ViewerType) => void;
};

const OneScreenCopyModal = ({
  viewersForPaste: viewerForPaste,
  addStateViewers
}: Props) => {
  const entitiesFromPaste = useSelector(entitiesAllSelector);

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
