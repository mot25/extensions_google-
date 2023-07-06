import './popup.scss';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { createElementNode } from '../utils/components';
import { SwagerInData } from '../componets/SwagerInData';
import { ButtonInPopupAnim } from '../componets/ButtonInPopupAnim';
import { api } from '../config/Api';
import { gsap } from 'gsap';
import { App } from './comonents/App';



ReactDOM.render(<App />, document.getElementById('root'));
