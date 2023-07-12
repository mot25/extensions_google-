import classNames from "classnames";
import styles from './SwitchWithText.module.scss'
import React, { useState } from "react";

type Props = {
    text: string
    onChange: (isCheck: boolean) => void
    value?: boolean
    isRounded?: boolean
    bold?: boolean
}

const SwitchWithText = ({
    onChange,
    text,
    value,
    isRounded,
    bold
}: Props) => {

    const [valueState, setValueState] = useState<boolean>(!!value)


    return (
        <div className={styles.wrapperButton}>
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
            <p style={{
                fontWeight: bold ? 'bold' : 'normal'
            }} className={styles.labelText}>{text}</p>
        </div>
    )
}

export default SwitchWithText