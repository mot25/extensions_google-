import axios from "axios"
import { EntitiesType, RequestForPasteViewerType } from "../type/entities.dto"
import { api } from "../config/Api"
import { LRUCache } from "lru-cache";
export class EntitiesService {
    static async getEntities(): Promise<EntitiesType[]> {
        const response: Promise<EntitiesType[]> = await fetch('https://pdm-kueg.io.neolant.su/api/structure/entities')
            .then(_ => _.json())
        return response
    }
    static async pasteViewerInEntities(id: string, config: RequestForPasteViewerType) {
        const response = await api.post(`https://pdm-kueg.io.neolant.su/api/structure/entities/${id}/viewers`, config)
        return response.data
    }
    static async changeViewerInEntities(id: string, config: Required<RequestForPasteViewerType>) {
        const json_data = JSON.stringify(config);
        const content_length = json_data.length;
        const response = await api.put(`https://pdm-kueg.io.neolant.su/api/structure/entities/${id}/viewers`, config, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*'
            }
        })
        return response.data
    }
    static async changeOrderPosition(id: string, positionOrders: Record<string, number>): Promise<any> {
        const response = await api.put(`https://pdm-kueg.io.neolant.su/api/structure/entities/${id}/viewers/order`, positionOrders, {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            }
        })
        return response.data
    }
}
