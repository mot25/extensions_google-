import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { RootStoreType, createStore } from '@/store';

type Props = {
  initState: RootStoreType;
} & PropsWithChildren;
const StoreProvider = ({ initState, children }: Props) => {
  return <Provider store={createStore(initState)}>{children}</Provider>;
};
export default StoreProvider;
