import { api } from "../config/Api";
import { IconType } from "../type/icon.dto";

export class IconService {
    static async getIcons(): Promise<IconType[]> {
        const response = await api.get('/api/icons')
        return response.data
    }
}