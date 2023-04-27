import * as classNames from "classnames";
import { createElementNode, useState } from "../../utils/components";
import styles from './DropDown.module.scss'
import { OptionsType } from "../../type/components.dto";

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

    const valueState = new useState<string>(value, () => {
        render()
    })
    const isShow = new useState(false, () => {
        render()
    })

    const showListDropDown = () => { }

    const wrapper = createElementNode('div', [styles.wrapperDropDown])
    function render() {
        wrapper.innerHTML = ''
        const dropdown = createElementNode("div", [styles.dropdown]);

        const button = createElementNode("button", [styles.dropbtn]);
        button.onclick = () => {
            isShow.update(!isShow.value)
        }
        button.textContent = title;

        const menu = createElementNode('div')
        menu.className = classNames(styles.dropdown_content, {
            [styles.show]: isShow.value
        })
        list.forEach(el => {
            const selected = createElementNode('div', [styles.selectItem])
            const selectedText = createElementNode('p', [styles.selectItemText])
            selectedText.innerText = el.label;
            selected.append(selectedText)
            selected.setAttribute('title', el.label)
            selected.onclick = () => {
                onChange(el.value)
            }
            menu.appendChild(selected);
        })



        dropdown.appendChild(button);
        dropdown.appendChild(menu);

        wrapper.appendChild(dropdown);


    }
    render()
    return wrapper

}

export default DropDown