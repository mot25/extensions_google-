import { api } from '@/shared/config/Api';

export const deleteViewerApi = async (
  entityId: string,
  viewerId: string
): Promise<any> => {
  const response = await api.delete(
    `/api/structure/entities/${entityId}/viewers/${viewerId}`
  );
  return response.data;
};
