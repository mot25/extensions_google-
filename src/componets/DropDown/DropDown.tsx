import React, { useState } from 'react';

import { OptionsType } from '../../type/components.dto';
import styles from './DropDown.module.scss';
import classNames from 'classnames';

type Props = {
    list: OptionsType[]
    onChange: (id: string) => void
    value?: string
    title: string
}



const DropDown = ({
    onChange,
    list,
    value,
    title
}: Props) => {

    const [valueState, setValueState] = useState<string>(value)
    const [isShow, setIsShow] = useState(false)


    return (
        <div className={styles.wrapperDropDown}>
            <div className={styles.dropdown}>
                <button
                    onClick={() => setIsShow(!isShow)}
                    className={styles.dropbtn}
                >{title}</button>
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
                            <div
                                className={styles.selectItemText}
                            >
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )

}

export default DropDown