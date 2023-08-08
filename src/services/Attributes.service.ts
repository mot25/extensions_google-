import { api } from "@/shared/config/Api";
import { joinParamArrayApi } from "@/shared/utils/utils";
import { ViewerAttrServiceType } from "@/type/attribute.dto";

export class AttributesService {
    static async setAttrViewer({ idAttrs, idEntity, idViewer }: ViewerAttrServiceType) {
        const response = api.put(`/api/structure/entities/${idEntity}/viewers/${idViewer}/attributes?${joinParamArrayApi(idAttrs, 'ids')}`)
        return response
    }
    static async deleteAttrFromViewer({ idAttrs, idEntity, idViewer }: ViewerAttrServiceType) {
        const response = api.delete(`/api/structure/entities/${idEntity}/viewers/${idViewer}/attributes?${joinParamArrayApi(idAttrs, 'ids')}`)
        return response
    }
}
