import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import { entitiesAllSelector } from '@/shared/model/slice';

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
