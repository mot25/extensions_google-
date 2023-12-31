import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { createStore } from '@/app/appStore';

export const StoreProviderContent = ({ children }: PropsWithChildren) => {
  return <Provider store={createStore()}>{children}</Provider>;
};
