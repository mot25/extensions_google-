import { createElementNode } from '../../utils/components';
import styles from './InputCustom.module.scss';

type Props = {
    placeholder?: string
    value: string
    onChange: (value: string) => void
}
const InputCustom = ({ placeholder, value, onChange }: Props) => {
    const $wrapper = createElementNode('label', [styles.input])
    const $input = createElementNode('input', [styles.input__field])
    $input.setAttribute('type', "text")
    $input.setAttribute('placeholder', " ")
    $input.setAttribute('value', value)
    // @ts-ignore
    $input.onchange = e => onChange(e.target.value)
    const $labelPlaceHolder = createElementNode('span', [styles.input__label])
    $labelPlaceHolder.innerText = placeholder
    $wrapper.appendChild($input)
    $wrapper.appendChild($labelPlaceHolder)
    return $wrapper
}

export default InputCustom