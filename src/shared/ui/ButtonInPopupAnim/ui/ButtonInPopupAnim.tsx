import classNames from 'classnames';
import React from 'react';

import styles from './ButtonInPopupAnim.module.scss';

type Props = { text: string; onClick: () => void };

export const ButtonInPopupAnim = ({ onClick, text }: Props) => {
  return (
    <div
      data-testid="btn"
      onClick={onClick}
      className={classNames(styles.buttonActions)}
    >
      <div>{text}</div>
    </div>
  );
};
