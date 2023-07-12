import JSAlert from 'js-alert';
import React, { useState } from 'react';

import { SwitchRenderListType, TypePasteViewers } from '../../type/components.dto';
import { RequestForPasteViewerType, ViewerType } from '../../type/entities.dto';
import { IconType } from '../../type/icon.dto';
import styles from './TwoScreenCopyModal.module.scss';
import { DropDown } from '../../componets/simple/DropDown';
import { InputCustom } from '../../componets/simple/InputCustom';
import { InputWithUnderLineColor } from '../../componets/simple/InputWithUnderLineColor';
import { SimpleButton } from '../../componets/simple/SimpleButton';
import { SwitchWithText } from '../../componets/simple/SwitchWithText';
import { WrapperNeumorphism } from '../../componets/simple/WrapperNeumorphism';


type Props = {
    viewerForPaste: ViewerType[]
    changeSelectedToggleiewer: (id: string) => void
    deleteView: (id: string) => void
    changeOrderViewerInEntities: (id: string, order: number) => void
    icons: IconType[]
    pasteViewers: (data: TypePasteViewers) => void
    setViewerForPaste: (newViewer: ViewerType[]) => void
}

const TwoScreenCopyModal = ({
    viewerForPaste,
    changeSelectedToggleiewer,
    deleteView,
    changeOrderViewerInEntities,
    icons: icons,
    pasteViewers,
    setViewerForPaste
}: Props) => {
    const [configPasteEntities, setConfigPasteEntities] = useState<SwitchRenderListType[]>([
        {
            id: '2',
            text: 'Коппировать во все вложенные',
        },

        {
            id: '4',
            text: 'Установить иконку',
        },
        {
            id: '5',
            text: 'Заменить иконку',
        }
    ])
    const [settingForPaste, setSettingForPaste] = useState<Array<SwitchRenderListType & { id: keyof Omit<RequestForPasteViewerType['Settings'], 'Url'> | '3' }>>([
        {
            id: '3',
            text: 'Применить настройки',
            bold: true
        },
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
    const [valueIdIcon, setValueIdIcon] = useState<string>('')
    const [urlValue, setUrlValue] = useState('https://')

    const titleIconSelect = icons.find(ic => ic.Id === valueIdIcon)?.Name


    const changeValueSettingForPaste = (id: string, value: boolean) => {
        setSettingForPaste(prev => prev?.map(_ => {
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
            viewerForPaste,
            configPasteEntities,
            valueIdIcon: valueIdIcon,
            settingForPaste,
            urlValue,
        })
        // modalWrapepr.classList.remove(styles.modalWrapper__active)
        const alert = new JSAlert("Страница будет перезагружена", "Новые виды были вставлены");
        alert.show();
        // window.location.reload()
    }
    const renameViewer = (name: string, idViewer: string) => {
        const newViewers = viewerForPaste.map(viewer => {
            if (viewer.Id === idViewer) viewer.Caption = name
            return viewer
        })
        setViewerForPaste(newViewers)
    }

    return (
        <div className={styles.wrapperPageTwo}>
            <div className={styles.wrapperViewersForPaste}>
                <h4 style={{ fontWeight: 'bold' }}>Выберите вид для копирования</h4>
                <ul className={styles.viewer_types}>
                    {viewerForPaste.map((el) => {
                        return <li
                            key={el.Id}
                            className={styles.viewerWrapper}
                        >
                            <div
                                className={styles.name}
                            >
                                <InputWithUnderLineColor
                                    onChange={(e) => renameViewer(e, el.Id)}
                                    value={el.Caption}
                                />
                            </div>
                            <input
                                type="checkbox"
                                checked={el.isSelected}
                                onChange={() => changeSelectedToggleiewer(el.Id)}
                            />

                            <InputCustom
                                addStyle={{
                                    width: '30px'
                                }}
                                onChange={(e) => changeOrderViewerInEntities(el.Id, +e)}
                                value={el.order.toString()}
                            />
                            <SimpleButton
                                wd='150px'
                                addStyle={{
                                    height: '30px',
                                }}
                                bg='#b43b3b'
                                onClick={() => deleteView(el.Id)}
                                text='Удалить из памяти'
                            />
                        </li>
                    })}
                </ul>
                <WrapperNeumorphism>
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
                            onChange={(idIcon) => setValueIdIcon(idIcon)}
                            title='Выберите иконку'
                            list={icons.map(icon => ({ label: icon.Name, value: icon.Id }))}
                        />
                        <div className={styles.wrapperSelectTitleIcon}>
                            {titleIconSelect ? <>
                                <span>Вы выбрали иконку:</span> {titleIconSelect}
                            </> : ''}
                        </div>
                    </div>
                </WrapperNeumorphism>
                <WrapperNeumorphism>
                    <div className={styles.wrapperSettinWithView}>
                        <div className={styles.rowSwitchSetting}>
                            {settingForPaste.map(switchEl => <SwitchWithText
                                key={switchEl.id}
                                onChange={(check) => changeValueSettingForPaste(switchEl.id, check)}
                                text={switchEl.text}
                                bold={switchEl.bold}
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
                </WrapperNeumorphism>
            </div>
            <SimpleButton
                wd='150px'
                addStyle={{
                    height: '30px',
                }}
                addClassName={styles.reload}
                onClick={pasteViewerInEntitie}
                text='Применить'
            />

        </div>
    )
}

export default TwoScreenCopyModal