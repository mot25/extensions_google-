import React, { CSSProperties } from 'react';

import styles from './InputCustom.module.scss';

type Props = {
    placeholder?: string
    value: string
    onChange: (value: string) => void
    addStyle?: CSSProperties
}
const InputCustom = ({ placeholder, value, onChange, addStyle }: Props) => {

    return (
        <label
            style={addStyle}
            className={styles.input}
        >
            <input
                type='text'
                style={addStyle}
                placeholder=' '
                value={value}
                onChange={e => onChange(e.target.value)}
            />
            <span className={styles.input__label} >{placeholder}</span>
        </label>
    )
}

export default InputCustom