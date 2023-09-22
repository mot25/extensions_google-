import JSAlert from 'js-alert';

import { usageSelector } from '@/shared/lib/hooks';
import { entitiesAllSelector } from '@/shared/model/slice';
import { EntitiesType, ViewerType } from '@/shared/type';

import { deleteViewerApi } from '../api';

const entitiesFromPaste = usageSelector(entitiesAllSelector);

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
      await deleteViewerApi(entity.Id, viewerDelete?.Id).then(cb);
    }
  });
};
export const deleteInCurrentEntity = async (
  entity: EntitiesType,
  viewer: ViewerType,
  cb: VoidFunction
) => {
  cb();
  await deleteViewerApi(entity.Id, viewer.Id);
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
    deleteInNestedEntity(entitiesFromPaste, viewer, nestedDeleteEntities);
  });
  alert.show();
};
