import React from 'react';

import { ButtonInPopupAnim } from '@/shared/ui/ButtonInPopupAnim';

import { showModalPasteInterface } from '../model';

const PasteClass = () => {
  return (
    <div>
      <ButtonInPopupAnim
        onClick={showModalPasteInterface}
        text="Копировать/Вставить"
      />
    </div>
  );
};

export default PasteClass;
