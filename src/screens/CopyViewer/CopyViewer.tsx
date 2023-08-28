import { ManagerViewersService } from '@/services/ManagerViewers.service';
import { EntitiesType, ViewerType } from '@/type/entities.dto';
import JSAlert from 'js-alert';
import React, { useEffect } from 'react';

import styles from './CopyViewer.module.scss';
// eslint-disable-next-line max-len
import { ViewerForCopyOrDelete } from '@/components/complex/ViewerForCopyOrDelete';

type Props = {
  entitiesFromPaste: EntitiesType[];
  viewerForPaste: ViewerType[];
  addStateViewers: (view: ViewerType) => void;
};

const OneScreenCopyModal = ({
  entitiesFromPaste,
  viewerForPaste,
  addStateViewers
}: Props) => {
  // const [viewersState, setViewersState] = useState<ViewerType[]>();
  // const [loadDelete, setLoadDelete] = useState<DeleteProgressType[]>([]);

  const entities: EntitiesType = entitiesFromPaste.find(
    (_: EntitiesType) => _.isCurrent
  );
  const deleteViewer = (viewer: ViewerType) => {
    const alert = new JSAlert(
      `Вы хотите удалить ${viewer.Caption}`,
      'Выберите опции для удаления'
    );
    alert.addButton('Удалить в текущем классе').then(async function () {
      await ManagerViewersService.deleteViewer(entities.Id, viewer.Id);
    });
    alert.addButton('Удалить во вложенных классах').then(() => {
      entitiesFromPaste.forEach(entity => {
        const viewerDelete = entity?.Viewers?.find(
          V => V?.Caption === viewer?.Caption
        );
        if (viewerDelete?.Id !== undefined) {
          // await ManagerViewersService.deleteViewer(
          //   entity.Id,
          //   viewerDelete?.Id
          // ).then(() => {
          //   // setLoadDelete(prev => {
          //   //   return prev.map(delViewer => {
          //   //     if (delViewer.idDeleting === viewerDelete.Caption) {
          //   //       delViewer.delete = delViewer.delete + 1;
          //   //     }
          //   //     return delViewer;
          //   //   });
          //   // });
          // });
        }
      });
    });
    alert.show();
  };

  useEffect(() => {
    // setViewersState(entities?.Viewers || []);
  }, [entities]);

  return (
    <div>
      <h4 style={{ fontWeight: 'bold' }}>
        Выберите вид для копирование/удаления
      </h4>
      <ul className={styles.wrapperItem}>
        {entities?.Viewers?.map((viewer, index) => {
          const isHave = !!~viewerForPaste.findIndex(
            _ => _?.Caption === viewer?.Caption
          );
          return (
            <ViewerForCopyOrDelete
              isHave={isHave}
              viewer={viewer}
              deleteViewer={deleteViewer}
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
