import { EntitiesType } from '@/shared/type';

export const getEntityInEntitiesForPaste = (entities: EntitiesType[]) =>
  entities.find(_ => _.isCurrent);
