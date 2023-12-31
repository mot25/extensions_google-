import React from 'react';

import { WrapperNeumorphism } from '@/shared/ui/WrapperNeumorphism';

import styles from './ErrorNeumorphism.module.scss';

type Props = {
  errorsCopy: string[];
};

export const ErrorNeumorphism = ({ errorsCopy }: Props) => {
  return (
    <WrapperNeumorphism>
      <div className={styles.wrapperError}>
        <h2>Ошибки</h2>
        {errorsCopy.map((textError, i) => {
          return (
            <div
              key={i}
              className={styles.wrapperTextError}
            >
              <span>{textError}</span>
            </div>
          );
        })}
      </div>
    </WrapperNeumorphism>
  );
};
