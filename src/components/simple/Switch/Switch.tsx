import React from 'react';
import styles from './Switch.module.scss';
import classNames from 'classnames';

type Props = {
  onChange: (isCheck: boolean) => void;
  value?: boolean;
  isRounded?: boolean;
};

const Switch = ({ onChange, isRounded, value }: Props) => {
  return (
    <label className={styles.switch}>
      <input
        onChange={() => onChange(!value)}
        type="checkbox"
        defaultChecked={value}
      />
      <span
        className={classNames(styles.slider, {
          [styles.round]: isRounded
        })}
      ></span>
    </label>
  );
};

export default Switch;
