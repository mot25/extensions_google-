import React, { useState } from 'react';

import { OptionsType } from '@/type/components.dto';

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
          data-testid="btn_title"
          onClick={() => setIsShow(!isShow)}
          className={styles.dropBtn}
        >
          {title}
        </button>
        <div
          data-testid="listOptions"
          style={{
            visibility: isShow ? 'visible' : 'hidden'
          }}
          className={styles.dropdown_content}
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
