import axios from "axios"

export class ManagerVieversService {
    static async deleteViewer(entitiId: string,viewerId: string): Promise<any> {        
        const response = await axios.delete(`https://pdm-kueg.io.neolant.su/api/structure/entities/${entitiId}/viewers/${viewerId}`)
        return response.data
    }
}