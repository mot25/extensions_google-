// import classNames from 'classnames';

import { createElementNode } from "../../utils/components"
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppModalPaste } from "../componets/AppModalPaste";




const documentBody = document.body
const namePointApp = 'rootContentEntry'
const pointApp = createElementNode('div')
pointApp.setAttribute('id', namePointApp)
documentBody.appendChild(pointApp)
const root = createRoot(pointApp);
root.render(<AppModalPaste />);




