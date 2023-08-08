import React, { useState } from 'react'
import styles from './Switch.module.scss'
import classNames from 'classnames'

type Props = {
    onChange: (isCheck: boolean) => void
    value?: boolean
    isRounded?: boolean

}

const Switch = ({ onChange, isRounded, value }: Props) => {

    const [valueState, setValueState] = useState<boolean>(!!value)

    return (
        <label className={styles.switch}>
            <input
                onChange={() => {
                    setValueState(!valueState)
                    onChange(valueState)
                }}
                type="checkbox"
                defaultChecked={valueState}
            />
            <span className={classNames(styles.slider, {
                [styles.round]: isRounded
            })}></span>
        </label>
    )
}

export default Switch