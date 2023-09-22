import JSAlert from 'js-alert';
import { useSelector } from 'react-redux';

import { ManagerViewersService } from '@/services/ManagerViewers.service';
import { entitiesAllSelector } from '@/shared/model/slice';
import { EntitiesType, ViewerType } from '@/type/entities.dto';

const getEntitiesFromPaste = () => {
  return useSelector(entitiesAllSelector);
};

export const deleteInNestedEntity = async (
  entitiesFromPaste: EntitiesType[],
  viewer: ViewerType,
  cb: VoidFunction
) => {
  await entitiesFromPaste.forEach(async entity => {
    const viewerDelete = entity?.Viewers?.find(
      V => V?.Caption === viewer?.Caption
    );

    if (viewerDelete?.Id !== undefined) {
      await ManagerViewersService.deleteViewer(
        entity.Id,
        viewerDelete?.Id
      ).then(cb);
    }
  });
};
export const deleteInCurrentEntity = async (
  entity: EntitiesType,
  viewer: ViewerType,
  cb: VoidFunction
) => {
  cb();
  await ManagerViewersService.deleteViewer(entity.Id, viewer.Id);
};

export const deleteViewer = (
  viewer: ViewerType,
  entity: EntitiesType,
  {
    deleteCurrentClass,
    nestedDeleteEntities
  }: {
    deleteCurrentClass: () => void;
    nestedDeleteEntities: () => void;
  }
) => {
  const alert = new JSAlert(
    `Вы хотите удалить ${viewer.Caption}`,
    'Выберите опции для удаления'
  );
  alert.addButton('Удалить в текущем классе').then(async () => {
    await deleteInCurrentEntity(entity, viewer, deleteCurrentClass);
  });
  alert.addButton('Удалить во вложенных классах').then(() => {
    deleteInNestedEntity(getEntitiesFromPaste(), viewer, nestedDeleteEntities);
  });
  alert.show();
};
