import JSAlert from 'js-alert';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { entitiesAllSelector } from '@/shared/model/slice';
import { EntitiesType, ViewerType } from '@/shared/type';
import { Progress } from '@/shared/ui/Progress';
import { SimpleButton } from '@/shared/ui/SimpleButton';
import { getPercent } from '@/shared/utils/utils';

import { deleteInCurrentEntity, deleteInNestedEntity } from '../model';
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
      await deleteInCurrentEntity(entity, viewer, () => {
        setIsDeleting(true);
        setCountDelete(1);
        allEntity.current = 1;
      });
    });
    alert.addButton('Удалить во вложенных классах').then(() => {
      setIsDeleting(true);
      deleteInNestedEntity(entitiesFromPaste, viewer, () => {
        setCountDelete(prev => prev + 1);
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
      <span
        data-testid="Caption"
        className={styles.name}
      >
        {viewer.Caption}
      </span>
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
        bg={isHave ? 'rgb(211, 211, 211)' : 'rgb(76, 175, 80)'}
        onClick={() => addStateViewers(viewer)}
        disabled={isHave}
        text="Запомнить вид"
      />
    </li>
  );
};

export default ViewerForCopyOrDelete;
