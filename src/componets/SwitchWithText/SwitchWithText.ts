import * as classNames from "classnames";
import { createElementNode, useState } from "../../utils/components";
import styles from './SwitchWithText.module.scss'

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

    const valueState = new useState<boolean>(!!value, () => {
        render()
    })


    const wrapper = createElementNode('div', [styles.wrapperButton])
    function render() {
        wrapper.innerHTML = ''
        const label = createElementNode('label', [styles.switch])
        const input = createElementNode('input') as HTMLInputElement
        input.onclick = (e: any) => {
            valueState.update(!valueState.value)
            onChange(valueState.value)
        }
        input.setAttribute('type', 'checkbox')
        input.checked = valueState.value

        const span = createElementNode('span')
        span.className = classNames(styles.slider, {
            [styles.round]: isRounded
        })
        label.append(input)
        label.append(span)
        wrapper.append(label)
    }
    render()
    return wrapper

}

export default SwitchWithText