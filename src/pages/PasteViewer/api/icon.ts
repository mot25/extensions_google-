import { api } from '@/shared/config/Api';

export const getIcons = async (): Promise<IconType[]> => {
  const response = await api.get('/api/icons');
  return response.data;
};
