import { api } from "@/shared/config/Api";
import { joinParamArrayApi } from "@/shared/utils/utils";
import { ViewerAttrServiceType } from "@/type/attribute.dto";

export class AttributesService {
    static async setAttrViewer({ idAttrs, idEntity, idViewer }: ViewerAttrServiceType) {
        const response = api.put(`/api/structure/entities/${idEntity}/viewers/${idViewer}/attributes?${joinParamArrayApi(idAttrs, 'ids')}`)
        return response
    }
    static async deleteAttrForViewer({ idAttrs, idEntity, idViewer }: ViewerAttrServiceType) {
        const response = api.delete(`/api/structure/entities/${idEntity}/viewers/${idViewer}/attributes?${joinParamArrayApi(idAttrs, 'ids')}`)
        return response
    }
    static async setAttrForEntity({ idAttrs, idEntity }: Omit<ViewerAttrServiceType, 'idViewer'>) {
        const response = api.post(`api/structure/entities/${idEntity}/attributes?${joinParamArrayApi(idAttrs, 'ids')}`)
        return response
    }
}
