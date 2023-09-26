import { api } from '@/shared/config/Api';
import { ViewerAttrServiceType } from '@/shared/type/attribute.dto';
import { joinParamArrayApi } from '@/shared/utils/utils';

export class AttributesService {
  static async setAttrViewer({
    idAttrs,
    idEntity,
    idViewer
  }: ViewerAttrServiceType) {
    const response = await api.put(
      // eslint-disable-next-line max-len
      `/api/structure/entities/${idEntity}/viewers/${idViewer}/attributes?${joinParamArrayApi(
        idAttrs,
        'ids'
      )}`
    );
    return response;
  }
  static async deleteAttrForViewer({
    idAttrs,
    idEntity,
    idViewer
  }: ViewerAttrServiceType) {
    const response = await api.delete(
      // eslint-disable-next-line max-len
      `/api/structure/entities/${idEntity}/viewers/${idViewer}/attributes?${joinParamArrayApi(
        idAttrs,
        'ids'
      )}`
    );
    return response;
  }
  static async setAttrForEntity({
    idAttrs,
    idEntity
  }: Omit<ViewerAttrServiceType, 'idViewer'>) {
    const response = await api.post(
      `api/structure/entities/${idEntity}/attributes?${joinParamArrayApi(
        idAttrs,
        'ids'
      )}`
    );
    return response;
  }
}
