import { api } from '@/shared/config/Api';
import { IconType } from '../type/icon.dto';

export const getIcons = async (): Promise<IconType[]> => {
  const response = await api.get('/api/icons');
  return response.data;
};
