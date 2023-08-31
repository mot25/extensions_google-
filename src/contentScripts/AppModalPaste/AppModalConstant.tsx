import React from 'react';

import IconPaste from '@/assets/icon/IconPaste.svg';
import IconPlus from '@/assets/icon/IconPlus.svg';
import { MenuLeftNavbar } from '@/type/components.dto';

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
