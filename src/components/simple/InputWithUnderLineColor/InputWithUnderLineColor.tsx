import classNames from 'classnames';
import React, { CSSProperties } from 'react';
import styles from './InputWithUnderLineColor.module.scss';
type Props = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  addStyle?: CSSProperties;
  size?: 's' | 'b';
};

const InputWithUnderLineColor = ({
  onChange,
  placeholder,
  value,
  addStyle,
  size = 'b'
}: Props) => {
  return (
    <div
      style={addStyle}
      className={styles.formControl}
    >
      <input
        className={classNames(styles.input, {
          [styles.input__small]: size === 's'
        })}
        placeholder={placeholder}
        required
        onChange={e => onChange(e.target.value)}
        value={value}
        type="text"
      />
      <span className={classNames(styles.inputBorder, styles.inputBorderAlt)} />
    </div>
  );
};

export default InputWithUnderLineColor;
