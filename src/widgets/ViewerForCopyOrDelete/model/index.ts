import { EntitiesType, ViewerType } from '@/shared/type';

import { deleteViewerApi } from '../api';

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
