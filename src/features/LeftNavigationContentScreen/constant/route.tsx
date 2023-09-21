import React from 'react';

import IconPaste from '@/shared/assets/icon/IconPaste.svg';
import { MenuLeftNavbar } from '@/type/components.dto';

import IconPlus from '../assets/icon/IconPlus.svg';

export const leftMenuConfig: MenuLeftNavbar[] = [
  {
    id: 1,
    label: 'Виды в текущем классе',
    title: <IconPlus />
  },
  {
    id: 2,
    label: 'Копировать',
    title: <IconPaste />
  }
];
