import React, { useState } from 'react';

import { LeftNavigationContentScreen } from '@/features/LeftNavigationContentScreen/ui/LeftNavigationContentScreen';

import { objRoutePage } from '../constant';
import styles from './NavigationContentScreen.module.scss';

export const NavigationContentScreen = () => {
  const [currentRightPage, setCurrentRightPage] = useState<number>(1);

  return (
    <>
      <LeftNavigationContentScreen
        currentRightPage={currentRightPage}
        setCurrentRightPage={setCurrentRightPage}
      />
      <div className={styles.wrapperRight}>
        {objRoutePage[currentRightPage]}
      </div>
    </>
  );
};
