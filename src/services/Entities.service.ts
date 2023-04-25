import axios from "axios"
import { EntitiesType } from "../type/entities.dto"
import { api } from "../config/Api"
import { LRUCache } from "lru-cache";
// import LRU from 'lru-cache';

const cache = new LRUCache({ max: 5000 });

export class EntitiesService {
    static async getEntities(): Promise<any[]> {
        // const value = cache.get('getEntities') as string | undefined
        // value && console.log("🚀 getEntities ~ value:", JSON.parse(value).length)
        // if (value) {
        //     return JSON.parse(value)
        // }
        const response = await api.get('https://pdm-kueg.io.neolant.su/api/structure/entities')
        cache.set('getEntities', JSON.stringify(response.data));
        return await response.data
    }
}