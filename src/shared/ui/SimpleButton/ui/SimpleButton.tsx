import classNames from 'classnames';
import React, { CSSProperties, MouseEvent } from 'react';

import styles from './SimpleButton.module.scss';

type Props = {
  onClick: (e: MouseEvent) => void;
  text: string;
  wd?: string;
  bg?: string;
  addStyle?: CSSProperties;
  addClassName?: string;
  disabled?: boolean;
};
const SimpleButton = ({
  onClick,
  text,
  wd = '100%',
  bg,
  addStyle,
  addClassName,
  disabled
}: Props) => {
  return (
    <button
      data-testid="btn"
      style={{
        width: wd,
        backgroundColor: bg,
        ...addStyle
      }}
      disabled={disabled}
      onClick={event => onClick(event)}
      className={classNames(
        styles.button,
        {
          [styles.button__disabled]: disabled
        },
        addClassName
      )}
    >
      <span>{text}</span>
    </button>
  );
};

export default SimpleButton;
