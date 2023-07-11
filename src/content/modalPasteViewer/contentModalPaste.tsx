import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { createElementNode } from '../../utils/components';
import { AppModalPaste } from '../componets/AppModalPaste';

const documentBody = document.body

const namePointApp = 'rootContentEntry'

const pointApp = createElementNode('div')

pointApp.setAttribute('id', namePointApp)

documentBody.appendChild(pointApp)

const root = createRoot(pointApp);
root.render(<AppModalPaste />);




