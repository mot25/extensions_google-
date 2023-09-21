import React from 'react';

import { CopyViewer, PasteViewer } from '@/pages';
import { PageNavigatorType } from '@/type/components.dto';

export const objRoutePage: PageNavigatorType = {
  1: <CopyViewer />,
  2: <PasteViewer />
};
