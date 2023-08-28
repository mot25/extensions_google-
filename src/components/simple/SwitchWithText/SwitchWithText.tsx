import classNames from 'classnames';
import styles from './SwitchWithText.module.scss';
import React from 'react';
import Switch from '../Switch/Switch';

type Props = {
  text: string;
  onChange: (isCheck: boolean) => void;
  value?: boolean;
  isRounded?: boolean;
  bold?: boolean;
};

const SwitchWithText = ({
  onChange,
  text,
  value,
  isRounded = true,
  bold
}: Props) => {
  return (
    <div
      className={classNames(styles.wrapperButton, {
        [styles.wrapperButton__bold]: bold
      })}
    >
      <Switch
        onChange={onChange}
        isRounded={isRounded}
        value={value}
      />
      <p className={styles.labelText}>{text}</p>
    </div>
  );
};

export default SwitchWithText;
