import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { AppModalPaste } from '@/app/Content/AppModal';
import { createStore } from '@/app/appStore';
import { createElementNode } from '@/shared/utils/components';

const documentBody = document.body;

const namePointApp = 'rootContentEntry';

const pointApp = createElementNode('div');

pointApp.setAttribute('id', namePointApp);

documentBody.appendChild(pointApp);
const root = createRoot(pointApp);
root.render(
  <Provider store={createStore()}>
    <AppModalPaste />
  </Provider>
);
