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
        // const response = await api.put(`https://pdm-kueg.io.neolant.su/api/structure/${id}/viewers`, config, {
        //     headers: {
        //         Accept: 'application/json, text/plain, */*',
        //         'Content-Type': 'application/json'
        //     }
        // })
        const json_data = JSON.stringify(config);
        const content_length = json_data.length;

        const response = await fetch(`https://pdm-kueg.io.neolant.su/api/structure/entities/${id}/viewers`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*',
                'Host': 'pdm-kueg.io.neolant.su',
                'Content-Length': content_length.toString()
            },
            body: JSON.stringify(config)
        }).then(_ => _.json())
        return response
    }
}
/**
 * 
 * fetch("https://pdm-kueg.io.neolant.su/api/structure/entities/13b0270d-6c82-ec11-8dab-8700fbc43b08/viewers", {
  "headers": {
    "accept": "application/json, text/plain, *",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://pdm-kueg.io.neolant.su/structure/entities?id=13b0270d-6c82-ec11-8dab-8700fbc43b08&mode=1&viewer=ccfd2ee6-015e-4c49-883c-ea8f489feaf0",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"Caption\":\"React По специалисту\",\"Icon\":\"icon-document\",\"Settings\":{\"SendParams\":true,\"Url\":\"https://localhost:5001/staff222\"},\"Id\":\"ccfd2ee6-015e-4c49-883c-ea8f489feaf0\",\"Name\":\"VIEWER_EXTERNAL\"}",
  "method": "PUT",
  "mode": "cors",
  "credentials": "include"
});
 */
// fetch("https://pdm-kueg.io.neolant.su/api/structure/13b0270d-6c82-ec11-8dab-8700fbc43b08/viewers", {
//   "headers": {
//     "accept": "application/json, text/plain, */*",
//     "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
//     "content-type": "application/json",
//     "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin"
//   },
//   "referrer": "https://pdm-kueg.io.neolant.su/structure/entities?id=13b0270d-6c82-ec11-8dab-8700fbc43b08&mode=1&viewer=ccfd2ee6-015e-4c49-883c-ea8f489feaf0",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "{\"Caption\":\"React По специалисту\",\"Icon\":\"icon-document\",\"Attributes\":[],\"Name\":\"VIEWER_EXTERNAL\",\"Settings\":{\"SendParams\":true,\"Url\":\"https://localhost:5001/staff\"},\"Id\":\"ccfd2ee6-015e-4c49-883c-ea8f489feaf0\"}",
//   "method": "PUT",
//   "mode": "cors",
//   "credentials": "include"
// });