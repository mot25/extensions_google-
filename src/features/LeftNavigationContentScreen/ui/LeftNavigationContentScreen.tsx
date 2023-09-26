import classNames from 'classnames';
import React from 'react';

import { leftMenuConfig } from '../constant';
import styles from './LeftNavigationContentScreen.module.scss';

type Props = {
  setCurrentRightPage: (id: number) => void;
  currentRightPage: number;
};

export const LeftNavigationContentScreen = ({
  setCurrentRightPage,
  currentRightPage
}: Props) => {
  return (
    <div>
      <ul className={styles.navbar__menu}>
        {leftMenuConfig.map((item, indexCategory) => {
          return (
            <li
              key={item.id}
              onClick={() => setCurrentRightPage(item.id)}
              className={styles.navbar__item}
            >
              <div
                className={classNames(styles.navbar__link, {
                  [styles.navbar__link__active]:
                    indexCategory + 1 === currentRightPage
                })}
              >
                <div className={styles.navbar__link_img}>{item.title}</div>
                <span>{item.label}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
