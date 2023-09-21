import React from 'react';

import { entitiesAllSelector } from '@/shared/model/slice';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import styles from './LoaderModalContent.module.scss';

export const LoaderModalContent = () => {
  const entitiesFromPaste = useSelector(entitiesAllSelector);

  return (
    <div
      className={classNames(styles.modalLoading, {
        [styles.modalLoading__show]: !entitiesFromPaste?.length
      })}
    >
      {!entitiesFromPaste?.length ? 'Загрузка...' : null}
    </div>
  );
};
