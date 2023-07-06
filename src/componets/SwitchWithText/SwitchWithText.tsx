import classNames from "classnames";
import { createElementNode } from "../../utils/components";
import styles from './SwitchWithText.module.scss'
import React, { useState } from "react";

type Props = {
    text: string
    onChange: (isCheck: boolean) => void
    value?: boolean
    isRounded?: boolean
}




const SwitchWithText = ({
    onChange,
    text,
    value,
    isRounded
}: Props) => {

    const [valueState, setValueState] = useState<boolean>(!!value)


    // const wrapper = createElementNode('div', [styles.wrapperButton])
    // function render() {
    //     wrapper.innerHTML = ''
    //     const label = createElementNode('label', [styles.switch])
    //     const input = createElementNode('input') as HTMLInputElement
    //     input.onclick = (e: any) => {
    //         valueState.update(!valueState.value)
    //         onChange(valueState.value)
    //     }
    //     input.setAttribute('type', 'checkbox')
    //     input.checked = valueState.value

    //     const span = createElementNode('span')
    //     span.className = classNames(styles.slider, {
    //         [styles.round]: isRounded
    //     })
    //     label.append(input)
    //     label.append(span)
    //     wrapper.append(label)
    //     const labelText = createElementNode('p', [styles.labelText])
    //     labelText.innerText = text
    //     wrapper.append(labelText)
    // }
    // render()
    // return wrapper
    return (
        <div className={styles.wrapperButton}>
            <label className={styles.switch}>
                <input onClick={() => {
                    setValueState(!valueState)
                    onChange(valueState)
                }} type="checkbox"
                    checked={valueState}
                />
                <span className={classNames(styles.slider, {
                    [styles.round]: isRounded
                })}></span>
            </label>
            <p className={styles.labelText}>{text}</p>
        </div>
    )
}

export default SwitchWithText