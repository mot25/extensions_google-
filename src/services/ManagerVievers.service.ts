import { api } from '@/shared/config/Api';

export class ManagerVieversService {
    static async deleteViewer(entitiId: string, viewerId: string): Promise<any> {
        const response = await api.delete(`/api/structure/entities/${entitiId}/viewers/${viewerId}`)
        return response.data
    }
}