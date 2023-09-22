import { storeRedux } from '@/app';

const usageDispatch = (action: { payload: any; type: string }): void => {
  storeRedux.dispatch(action);
};
export default usageDispatch;
