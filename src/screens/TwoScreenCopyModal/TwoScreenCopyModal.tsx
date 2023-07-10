import JSAlert from 'js-alert';
import React, { useState } from 'react';

import { DropDown } from '../../componets/DropDown';
import { SwitchWithText } from '../../componets/SwitchWithText';
import { SwitchRenderListType, TypePasteViewers } from '../../type/components.dto';
import { RequestForPasteViewerType, ViewerType } from '../../type/entities.dto';
import { IconType } from '../../type/icon.dto';
import styles from './TwoScreenCopyModal.module.scss';

type Props = {
    glViewerForPaste: ViewerType[]
    changeSelectedToggleiewer: (id: string) => void
    deleteView: (id: string) => void
    changeOrderViewerInEntities: (id: string, order: number) => void
    glIcons: IconType[]
    pasteViewers: (data: TypePasteViewers) => void

}

const TwoScreenCopyModal = ({
    glViewerForPaste,
    changeSelectedToggleiewer,
    deleteView,
    changeOrderViewerInEntities,
    glIcons,
    pasteViewers
}: Props) => {
    const [configPasteEntities, setConfigPasteEntities] = useState<SwitchRenderListType[]>([
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
    ])
    const [settingForPaste, setSettingForPaste] = useState<Array<SwitchRenderListType & { id: keyof Omit<RequestForPasteViewerType['Settings'], 'Url'> }>>([
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
    ])
    const [glValueIdIcon, setGlValueIdIcon] = useState<string>('')
    const [urlValue, setUrlValue] = useState('https://')

    const titleIconSelect = glIcons.find(ic => ic.Id === glValueIdIcon)?.Name


    const changeValueSettingForPaste = (id: string, value: boolean) => {
        setSettingForPaste(settingForPaste?.map(_ => {
            if (_.id === id) _.value = value;
            return _
        }))
    }
    const changeValueConfigPaste = (id: string, value: boolean) => {
        setConfigPasteEntities(configPasteEntities?.map(_ => {
            if (_.id === id) _.value = value;
            return _
        }))
    }
    const pasteViewerInEntitie = () => {
        pasteViewers({
            glViewerForPaste: glViewerForPaste,
            configPasteEntities: configPasteEntities,
            glValueIcons: glValueIdIcon,
            settingForPaste: settingForPaste,
            urlValue: urlValue,
        })
        // modalWrapepr.classList.remove(styles.modalWrapper__active)
        const alert = new JSAlert("Страница будет перезагружена", "Новые виды были вставлены");
        alert.show();
        // window.location.reload()
    }
    return (
        <div className={styles.wrapperPageTwo}>
            <div className={styles.wrapperViewersForPaste}>
                <ul className={styles.viewer_types}>
                    {glViewerForPaste.map((el) => {
                        return <li
                            key={el.Id}
                        >
                            <p className={styles.name}>{el.Caption}</p>
                            <input
                                type="checkbox"
                                checked={el.isSelected}
                                onChange={() => changeSelectedToggleiewer(el.Id)}
                            />
                            <input
                                type='number'
                                value={el.order}
                                min={1}
                                onChange={(e) => changeOrderViewerInEntities(el.Id, +e.target?.value)}
                            />
                            <button
                                onClick={() => deleteView(el.Id)}
                            >Удалить из памяти</button>
                        </li>
                    })}
                </ul>
                <div className={styles.wrapperListConfig}>
                    {configPasteEntities.map((switchEl) => {
                        return <div
                            key={switchEl.id}
                            className={styles.rowSwitch}>
                            <SwitchWithText
                                onChange={(check) => {
                                    changeValueConfigPaste(switchEl.id, check);
                                }}
                                text={switchEl.text}
                                value={switchEl.value}
                                isRounded
                            />
                        </div>
                    })}
                </div>
                <div className={styles.wrapperDropDownIcon}>
                    <DropDown
                        onChange={(idIcon) => setGlValueIdIcon(idIcon)}
                        title='Выберите иконку'
                        list={glIcons.map(icon => ({ label: icon.Name, value: icon.Id }))}
                    />
                    <div className={styles.wrapperSelectTitleIcon}>
                        {titleIconSelect ? <>
                            <span>Вы выбрали иконку:</span> {titleIconSelect}
                        </> : ''}
                    </div>
                </div>
                <div className={styles.wrapperSettinWithView}>
                    <div className={styles.rowSwitchSetting}>
                        {settingForPaste.map(switchEl => <SwitchWithText
                            key={switchEl.id}
                            onChange={(check) => changeValueSettingForPaste(switchEl.id, check)}
                            text={switchEl.text}
                            value={switchEl.value}
                            isRounded
                        />)}
                    </div>
                    <div className={styles.inputSettingUrlWrapper}>
                        <input
                            type="text"
                            className={styles.inputSettingUrl}
                            placeholder='URL контента'
                            value={urlValue}
                            onChange={e => setUrlValue(e.target.value)}
                        />

                    </div>
                </div>
            </div>
            <button
                className={styles.reload}
                onClick={pasteViewerInEntitie}
            >Коппировать</button>
        </div>
    )
}

export default TwoScreenCopyModal