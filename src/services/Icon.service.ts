import { api } from "../config/Api";
import { IconType } from "../type/icon.dto";

export class IconService {
    static async getIcons() : Promise<IconType[]> {
        const response = await api.get('https://pdm-kueg.io.neolant.su/api/icons')
        return response.data
    }
}