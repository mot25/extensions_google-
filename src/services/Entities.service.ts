import axios from "axios"
import { EntitiesType } from "../type/entities.dto"
import { api } from "../config/Api"
import { LRUCache } from "lru-cache";
// import LRU from 'lru-cache';

const cache = new LRUCache({ max: 5000 });

export class EntitiesService {
    static async getEntities(): Promise<EntitiesType[]> {
        const value = cache.get('getEntities') as string | undefined
        if (value) {
            return JSON.parse(value) as EntitiesType[]
        }
        const response: Promise<EntitiesType[]> = await fetch('https://pdm-kueg.io.neolant.su/api/structure/entities')
            .then(_ => _.json())
        cache.set('getEntities', JSON.stringify(response));
        return response
    }
}