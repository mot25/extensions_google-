import { api } from '@/shared/config/Api';

export const ß = async (entityId: string, viewerId: string): Promise<any> => {
  const response = await api.delete(
    `/api/structure/entities/${entityId}/viewers/${viewerId}`
  );
  return response.data;
};
