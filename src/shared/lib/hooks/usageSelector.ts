import { RootStoreType, storeRedux } from '@/app';

const usageSelector = <TypeState>(
  selector: (state: RootStoreType) => TypeState
): TypeState => {
  return selector(storeRedux.getState());
};
export default usageSelector;
