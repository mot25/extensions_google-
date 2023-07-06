import './popup.scss';

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './comonents/App';



const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);