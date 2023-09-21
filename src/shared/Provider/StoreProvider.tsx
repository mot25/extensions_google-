import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { RootStoreType, createStore } from '@/store';

type Props = {
  initState: RootStoreType;
} & PropsWithChildren;
const StoreProviderTest = ({ initState, children }: Props) => {
  return <Provider store={createStore(initState)}>{children}</Provider>;
};
export default StoreProviderTest;
