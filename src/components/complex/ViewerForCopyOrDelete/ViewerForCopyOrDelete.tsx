import JSAlert from 'js-alert';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Progress } from '@/components/simple/Progress';
import { SimpleButton } from '@/components/simple/SimpleButton';
import { ManagerViewersService } from '@/services/ManagerViewers.service';
import { getPercent } from '@/shared/utils/utils';
import { entitiesAllSelector } from '@/store/slice/entitiesSlice';
import { EntitiesType, ViewerType } from '@/type/entities.dto';

import styles from './ViewerForCopyOrDelete.module.scss';

type Props = {
  isHave: boolean;
  viewer: ViewerType;
  entity: EntitiesType;
  addStateViewers: (viewer: ViewerType) => void;
};

const ViewerForCopyOrDelete = ({
  isHave,
  viewer,
  addStateViewers,
  entity
}: Props) => {
  const entitiesFromPaste = useSelector(entitiesAllSelector);

  const allEntity = useRef<number>(0);
  const [countDelete, setCountDelete] = useState<number>(0);
  const [idDeleting, setIsDeleting] = useState(false);

  const deleteViewer = (viewer: ViewerType) => {
    const alert = new JSAlert(
      `Вы хотите удалить ${viewer.Caption}`,
      'Выберите опции для удаления'
    );
    alert.addButton('Удалить в текущем классе').then(async () => {
      setIsDeleting(true);
      setCountDelete(1);
      allEntity.current = 1;

      await ManagerViewersService.deleteViewer(entity.Id, viewer.Id);
    });
    alert.addButton('Удалить во вложенных классах').then(() => {
      setIsDeleting(true);
      entitiesFromPaste.forEach(async entity => {
        const viewerDelete = entity?.Viewers?.find(
          V => V?.Caption === viewer?.Caption
        );

        if (viewerDelete?.Id !== undefined) {
          await ManagerViewersService.deleteViewer(
            entity.Id,
            viewerDelete?.Id
          ).then(() => {
            setCountDelete(prev => prev + 1);
          });
        }
      });
    });
    alert.show();
  };

  useEffect(() => {
    allEntity.current = entitiesFromPaste.filter(_entity => {
      const viewers = _entity.Viewers;
      const haveViewer = ~viewers.findIndex(
        _viewer => _viewer.Caption === viewer.Caption
      );
      return !!haveViewer;
    }).length;
  }, [entitiesFromPaste.length]);

  return (
    <li className={styles.item}>
      <span className={styles.name}>{viewer.Caption}</span>
      {idDeleting ? (
        <div className={styles.progressBar}>
          <Progress done={getPercent(countDelete, allEntity.current)} />
        </div>
      ) : (
        <SimpleButton
          wd="150px"
          addStyle={{
            height: '24px'
          }}
          bg="#CC3333"
          addClassName={styles.delete_btn}
          onClick={() => deleteViewer(viewer)}
          text="Удалить"
        />
      )}

      <SimpleButton
        wd="150px"
        addStyle={{
          height: '24px'
        }}
        bg={isHave ? '#d3d3d3' : '#4CAF50'}
        onClick={() => {
          if (isHave) return;
          addStateViewers(viewer);
        }}
        text="Запомнить вид"
      />
    </li>
  );
};

export default ViewerForCopyOrDelete;
