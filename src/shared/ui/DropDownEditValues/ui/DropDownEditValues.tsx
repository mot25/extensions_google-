import React from 'react';

import { InputWithUnderLineColor } from '@/shared/ui/InputWithUnderLineColor';

import { OptionsType } from '../../DropDown/type';
import IconDelete from '../assets/icon/Icon_delete.svg';
import styles from './DropDownEditValues.module.scss';

type Props = {
  values: OptionsType[];
  onChange: (id: string, name: string) => void;
  deleteValue: (id: string) => void;
};

export const DropDownEditValues = ({
  deleteValue,
  onChange,
  values
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <div
        data-testid="list_Option"
        className={styles.dropDownWrapper}
      >
        {values.map(opt => {
          return (
            <div
              key={opt.value}
              className={styles.dropDown__inner}
            >
              <InputWithUnderLineColor
                addStyle={{
                  flex: 1
                }}
                onChange={value => onChange(opt.value, value)}
                value={opt.label}
              />
              <div
                data-deleteValue={opt.label}
                onClick={() => deleteValue(opt.value)}
                className={styles.delete}
              >
                <IconDelete />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
