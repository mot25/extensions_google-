import { usageSelector } from '@/shared/lib/hooks';
import { entitiesAllSelector } from '@/shared/model/slice';

const entitiesFromPaste = usageSelector(entitiesAllSelector);

export const getEntityInEntitiesForPaste = () =>
  entitiesFromPaste.find(_ => _.isCurrent);
