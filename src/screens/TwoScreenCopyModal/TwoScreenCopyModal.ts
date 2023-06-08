import { DropDown } from "../../componets/DropDown";
import { SwitchWithText } from "../../componets/SwitchWithText";
import { SwitchRenderListType, TypePasteViewers } from "../../type/components.dto";
import { RequestForPasteViewerType, ViewerType } from "../../type/entities.dto";
import { IconType } from "../../type/icon.dto";
import { useState, createElementNode } from "../../utils/components";
import styles from './TwoScreenCopyModal.module.scss'
import JSAlert from 'js-alert';
type Props = {
    deleteView: (id: string) => void
    changeSelectedToggleiewer: (id: string) => void
    glViewerForPaste: useState<ViewerType[]>
    glIcons: useState<IconType[]>
    modalWrapepr: HTMLElement
    pasteViewers: (data: TypePasteViewers) => void
    changeOrderViewerInEntities: (id: string, order: number) => void
}
const renderPageTwo = async ({
    changeSelectedToggleiewer,
    changeOrderViewerInEntities,
    glViewerForPaste,
    deleteView,
    glIcons,
    modalWrapepr,
    pasteViewers
}: Props) => {

    const configPasteEntities = new useState<SwitchRenderListType[]>([
        {
            id: '2',
            text: 'Коппировать во все вложенные',
        },
        {
            id: '3',
            text: 'Применить настройки',
        },
        {
            id: '4',
            text: 'Заменить иконку для новых классов',
        },
        {
            id: '5',
            text: 'Перезатирать существующию икноку при изменение',
        }
    ], () => renderConfigPaste)

    const changeValueConfigPaste = (id: string, value: boolean) => {
        configPasteEntities.update(configPasteEntities.value.map(_ => {
            if (_.id === id) _.value = value;
            return _
        }))
    }


    const wrapperPageTwo = createElementNode('div', [styles.wrapperPageTwo])

    const wrapperViewersForPaste = createElementNode('div', [styles.wrapperViewersForPaste])

    const renderStateViewer = () => {
        const ul = createElementNode('ul', [styles.viewer_types])
        glViewerForPaste.value.forEach(el => {
            const li = document.createElement("li");
            const nameP = createElementNode('p', [styles.name])
            nameP.textContent = el.Caption;

            const checkPaste = document.createElement('input')
            checkPaste.setAttribute('type', 'checkbox')
            if (el.isSelected) {
                checkPaste.setAttribute('checked', 'true')
            } else {
                checkPaste.removeAttribute('checked')
            }
            checkPaste.onclick = () => {
                changeSelectedToggleiewer(el.Id)
            }
            const deleteButton = createElementNode('button', [styles.deleteViewer])
            deleteButton.innerText = 'Удалить из памяти'
            deleteButton.onclick = () => {
                deleteView(el.Id)
            }

            const orderInput = createElementNode('input', [styles.orderInput])
            orderInput.setAttribute('type', 'number')
            orderInput.setAttribute('value', el.order.toString())
            orderInput.setAttribute('min', "1")
            orderInput.onchange = (e) => {
                // @ts-ignore
                changeOrderViewerInEntities(el.Id, e.target?.value);
            }



            li.appendChild(nameP);
            li.append(checkPaste);
            li.append(orderInput);
            li.append(deleteButton);

            ul.appendChild(li);
        })
        return ul
    }
    wrapperViewersForPaste.append(renderStateViewer())


    const renderConfigPaste = (): any => {
        const wrapperList = createElementNode('div', [styles.wrapperListConfig])
        wrapperList.innerHTML = ''
        configPasteEntities.value.forEach((switchEl) => {
            const rowSwitch = createElementNode('div', [styles.rowSwitch]);
            const listSwitchs = SwitchWithText({
                onChange: (check) => {
                    changeValueConfigPaste(switchEl.id, check);
                },
                text: switchEl.text,
                value: switchEl.value,
                isRounded: true,
            });
            rowSwitch.append(listSwitchs)
            wrapperList.append(rowSwitch)
        })
        wrapperViewersForPaste.append(wrapperList)
    }
    renderConfigPaste()

    const glValueIcons = new useState<string>('', () => {
        renderDropDown()
    })
    const wrapperDropDownIcon = createElementNode('div', [styles.wrapperDropDownIcon])
    function renderDropDown() {
        wrapperDropDownIcon.innerHTML = ''
        wrapperDropDownIcon.append(DropDown({
            title: 'Выберите иконку',
            list: glIcons.value.map(icon => ({ label: icon.Name, value: icon.Id })),
            onChange: (idIcon) => glValueIcons.update(idIcon),
        }))
        const wrapperTitleDropDown = createElementNode('div', [styles.wrapperSelectTitleIcon])
        const title = glIcons.value.find(ic => ic.Id === glValueIcons.value)?.Name
        wrapperTitleDropDown.innerHTML = title ? `
      <span>Вы выбрали иконку:</span> ${title}
      ` : ''
        wrapperDropDownIcon.append(wrapperTitleDropDown)
    }
    renderDropDown()
    const settingForPaste = new useState<Array<SwitchRenderListType & { id: keyof Omit<RequestForPasteViewerType['Settings'], 'Url'> }>>([
        {
            id: 'SendParams',
            text: 'Передавать данные внешнему сервису',
        },
        {
            id: 'hideInStructureOfObject',
            text: 'Скрывать в структуре объектов',
        },
        {
            id: 'hideInViewingModel',
            text: 'Скрывать в модели',
        },
        {
            id: 'viewMode',
            text: 'Только для чтения',
        },
        {
            id: 'hideEmptyFields',
            text: 'Скрывать пустые поля',
        },
    ], () => renderSettinWithView)
    const changeValueSettingForPaste = (id: string, value: boolean) => {
        settingForPaste.update(settingForPaste.value.map(_ => {
            if (_.id === id) _.value = value;
            return _
        }))
    }
    const wrapperSettinWithView = createElementNode('div', [styles.wrapperSettinWithView])
    function renderSettinWithView() {
        wrapperSettinWithView.innerHTML = ''
        const rowSwitch = createElementNode('div', [styles.rowSwitchSetting]);
        settingForPaste.value.forEach((switchEl) => {
            const listSwitchs = SwitchWithText({
                onChange: (check) => {
                    changeValueSettingForPaste(switchEl.id, check);
                },
                text: switchEl.text,
                value: switchEl.value,
                isRounded: true,
            });
            rowSwitch.append(listSwitchs)
        })
        wrapperSettinWithView.append(rowSwitch)
    }
    renderSettinWithView()
    const urlValue = new useState('https://', () => {
        renderInput()
    })
    const inputSettingUrlWrapper = createElementNode('div', [styles.inputSettingUrlWrapper]);
    function renderInput() {
        inputSettingUrlWrapper.innerHTML = ''
        const inputSettingUrl = createElementNode('input', [styles.inputSettingUrl]);
        inputSettingUrl.setAttribute('placeholder', 'URL контента')
        inputSettingUrl.setAttribute('type', 'text')
        inputSettingUrl.setAttribute('value', urlValue.value)
        inputSettingUrl.onchange = (e) => {
            // @ts-ignore
            urlValue.update(e.target?.value);
        }
        inputSettingUrlWrapper.append(inputSettingUrl)
    }
    renderInput()
    wrapperSettinWithView.append(inputSettingUrlWrapper)
    wrapperViewersForPaste.append(wrapperDropDownIcon)
    wrapperViewersForPaste.append(wrapperSettinWithView)
    wrapperPageTwo.appendChild(wrapperViewersForPaste)

    const button = createElementNode('button', [styles.reload])
    button.innerText = 'Коппировать'
    button.onclick = async () => {
        await pasteViewers({
            glViewerForPaste: glViewerForPaste.value,
            configPasteEntities: configPasteEntities.value,
            glValueIcons: glValueIcons.value,
            settingForPaste: settingForPaste.value,
            urlValue: urlValue.value,
        })
        modalWrapepr.classList.remove(styles.modalWrapper__active)
        const alert = new JSAlert("Страница будет перезагружена", "Новые виды были вставлены");
        alert.show();
        // window.location.reload()
    }
    wrapperPageTwo.append(button)


    return wrapperPageTwo
}

export default renderPageTwo