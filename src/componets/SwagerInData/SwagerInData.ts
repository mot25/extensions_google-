import { createElementNode, useState } from '../../utils/components'
import { InputCustom } from '../InputCustom'
import { SimpleButton } from '../SimpleButton'
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
    const fieldFell = async () => {
        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            const currentTabId = tabs[0].id;
            await chrome.scripting.executeScript({
                target: { tabId: currentTabId },
                files: ['fieldSwagger.js']
            })
        })
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: 'dataForInpur',
            payload: valueData.value
        });


    }
    $wrapper.append(SimpleButton({
        text: "Вставить",
        onClick: fieldFell
    }))
    return $wrapper
}
export default SwagerInData