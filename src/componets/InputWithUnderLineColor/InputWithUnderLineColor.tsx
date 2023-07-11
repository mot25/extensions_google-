import React, { CSSProperties } from 'react'
import styles from './InputWithUnderLineColor.module.scss'
import classNames from 'classnames'
type Props = {
    placeholder?: string
    value: string
    onChange: (value: string) => void
    addStyle?: CSSProperties
}

const InputWithUnderLineColor = ({
    onChange,
    placeholder,
    value,
    addStyle
}: Props) => {
    return (
        <div style={addStyle} className={styles.formControl}>
            <input
                className={classNames(styles.input, styles.inputAlt)}
                placeholder={placeholder}
                required
                onChange={(e) => onChange(e.target.value)}
                value={value}
                type="text"
            />
            <span
                className={classNames(styles.inputBorder, styles.inputBorderAlt)}
            />
        </div>
    )
}

export default InputWithUnderLineColor