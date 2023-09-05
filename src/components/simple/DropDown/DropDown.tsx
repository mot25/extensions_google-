import { OptionsType } from '@/type/components.dto';
import classNames from 'classnames';
import React, { useState } from 'react';

import styles from './DropDown.module.scss';

type Props = {
  list: OptionsType[];
  onChange: (id: string) => void;
  title: string;
};

const DropDown = ({ onChange, list, title }: Props) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className={styles.wrapperDropDown}>
      <div className={styles.dropdown}>
        <button
          onClick={() => setIsShow(!isShow)}
          className={styles.dropBtn}
        >
          {title}
        </button>
        <div
          className={classNames(styles.dropdown_content, {
            [styles.show]: isShow
          })}
        >
          {list.map((item, i) => (
            <div
              key={i}
              onClick={() => onChange(item.value)}
              title={item.label}
              className={styles.selectItem}
            >
              <div className={styles.selectItemText}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropDown;
