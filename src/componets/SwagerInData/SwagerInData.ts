import { createElementNode, useState } from '../../utils/components'
import { InputCustom } from '../InputCustom'
import styles from './SwagerInData.module.scss'

const SwagerInData = () => {
    const $wrapper = createElementNode('div', [styles.wrapper])
    type InitValueType = {
        ObjectId: string;
        Url: string;
        Token: string;
    };
    const initValue: InitValueType = {
        ObjectId: '',
        Url: '',
        Token: ""
    }
    const valueData = new useState<InitValueType>(initValue)

    const changeValue = (key: keyof InitValueType, value: string) => valueData.update({ ...valueData.value, [key]: value })
    Object.keys(initValue).forEach((key) => {
        const keyName = key as keyof InitValueType
        const $wrapperInput = createElementNode('div', [styles.wrapperInput])
        const Input = InputCustom({
            onChange: (str) => changeValue(keyName, str),
            placeholder: keyName,
            value: ''
        })
        $wrapperInput.append(Input)
        $wrapper.append($wrapperInput)
    })
    return $wrapper
}
export default SwagerInData