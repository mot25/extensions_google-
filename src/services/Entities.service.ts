import { api } from '../config/Api';
import { EntitiesType, RequestForPasteViewerType } from '../type/entities.dto';

export class EntitiesService {
    static async getEntities(baseUrl: string
        ): Promise<EntitiesType[]> {
        const response: Promise<EntitiesType[]> = await fetch(baseUrl + '/api/structure/entities')
            .then(_ => _.json())
        return response
    }
    static async pasteViewerInEntities(id: string, config: RequestForPasteViewerType) {
        const response = await api.post(`/api/structure/entities/${id}/viewers`, config)
        return response.data
    }
    static async changeViewerInEntities(id: string, config: Required<RequestForPasteViewerType>) {
        const response = await api.put(`/api/structure/entities/${id}/viewers`, config, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*'
            }
        })
        return response.data
    }
    static async changeOrderPosition(id: string, positionOrders: Record<string, number>): Promise<any> {
        const response = await api.put(`/api/structure/entities/${id}/viewers/order`, positionOrders, {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            }
        })
        return response.data
    }
}
