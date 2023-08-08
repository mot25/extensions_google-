import { DropDown } from '@/components/simple/DropDown';
import { InputWithUnderLineColor } from '@/components/simple/InputWithUnderLineColor';
import { SimpleButton } from '@/components/simple/SimpleButton';
import { Switch } from '@/components/simple/Switch';
import { SwitchWithText } from '@/components/simple/SwitchWithText';
import { WrapperNeumorphism } from '@/components/simple/WrapperNeumorphism';
import {
    APPLY_SETTINGS,
    COPY_ATTR_IN_ENTITIES,
    COPY_ATTR_IN_VIEWER,
    COPY_VIEWER_NESTED,
    HIDE_EMPTY_FIELD,
    HIDE_IN_MODEL,
    HIDE_IN_TREE,
    ONLY_READ,
    REPLACE_ICON,
    SET_ICON,
    TRANSFER_DATA_EXTERNAL_SERVICES,
    URL_VIEWER_SETTING,
} from '@/contentScripts/AppModalPaste/ConstantAppModalPaste';
import { SettingsViewerForPasteType, SwitchRenderListType, TypePasteViewers } from '@/type/components.dto';
import { ViewerType } from '@/type/entities.dto';
import { IconType } from '@/type/icon.dto';
import classNames from 'classnames';
import JSAlert from 'js-alert';
import React, { useState } from 'react';

import styles from './PasteViewer.module.scss';



type Props = {
    viewerForPaste: ViewerType[]
    changeSelectedToggleiewer: (id: string) => void
    deleteView: (id: string) => void
    changeOrderViewerInEntities: (id: string, order: number) => void
    icons: IconType[]
    pasteViewers: (data: TypePasteViewers) => void
    setViewerForPaste: (newViewer: ViewerType[]) => void
}
const initialStateConfigPaste = [
    {
        id: COPY_VIEWER_NESTED,
        text: 'Копировать во все вложенные',
    },
    {
        id: SET_ICON,
        text: 'Установить иконку',
    },
    {
        id: REPLACE_ICON,
        text: 'Заменить иконку',
    },
    {
        id: COPY_ATTR_IN_VIEWER,
        text: 'Копировать атрибуты в вид',
        isActive: true
    },
    {
        id: COPY_ATTR_IN_ENTITIES,
        text: 'Копировать атрибуты в класс',
    }
]
const initialStateSettingViewer: SettingsViewerForPasteType = [
    {
        id: APPLY_SETTINGS,
        text: 'Применить настройки',
        bold: true
    },
    {
        id: TRANSFER_DATA_EXTERNAL_SERVICES,
        text: 'Передавать данные внешнему сервису',
    },
    {
        id: HIDE_IN_TREE,
        text: 'Скрывать в структуре объектов',
    },
    {
        id: HIDE_IN_MODEL,
        text: 'Скрывать в модели',
    },
    {
        id: ONLY_READ,
        text: 'Только для чтения',
    },
    {
        id: HIDE_EMPTY_FIELD,
        text: 'Скрывать пустые поля',
    },
    {
        id: URL_VIEWER_SETTING,
        value: 'https://',

    },
]

const PasteViewer = ({
    viewerForPaste,
    changeSelectedToggleiewer,
    deleteView,
    changeOrderViewerInEntities,
    icons: icons,
    pasteViewers,
    setViewerForPaste
}: Props) => {
    const [configPaste, setConfigPaste] = useState<SwitchRenderListType[]>(initialStateConfigPaste)
    const [settingViewer, setSettingViewer] = useState<SettingsViewerForPasteType>(initialStateSettingViewer)
    const [valueIdIcon, setValueIdIcon] = useState<string>('')

    const titleIconSelect = icons.find(icon => icon.Id === valueIdIcon)?.Name


    const changeActiveSettingForPaste = (id: string, value: boolean) => {
        setSettingViewer(prev => prev?.map(_ => {
            if (_.id === id) _.isActive = value;
            return _
        }))
    }
    const changeValueSettingForPaste = (id: string, value: string) => {
        setSettingViewer(prev => prev?.map(_ => {
            if (_.id === id) _.value = value;
            return _
        }))
    }

    const changeValueConfigPaste = (id: string, value: boolean) => {
        setConfigPaste(configPaste?.map(_ => {
            if (_.id === id) _.isActive = value;
            return _
        }))
    }

    const pasteViewerInEntities = () => {
        pasteViewers({
            viewerForPaste,
            configPasteEntities: configPaste,
            valueIdIcon: valueIdIcon,
            settingForPaste: settingViewer,
            urlValue: '',
        })
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
                    {viewerForPaste.map((el, indexViewer) => {
                        return <li
                            key={el.Id}
                            className={classNames(styles.viewerWrapper, {
                                [styles.viewerWrapper__even]: indexViewer % 2 === 0
                            })}
                        >
                            <div
                                title='Название вида для вставки'
                                className={styles.name}
                            >
                                <InputWithUnderLineColor
                                    onChange={(e) => renameViewer(e, el.Id)}
                                    value={el.Caption}
                                />
                            </div>
                            <span
                                title='Чекбокс для включения вида для вставки'
                            >
                                <input
                                    type="checkbox"
                                    checked={el.isSelected}
                                    onChange={() => changeSelectedToggleiewer(el.Id)}
                                />
                            </span>

                            <span
                                title='Порядковый номер вида для вставки'
                            >
                                <input
                                    style={{
                                        width: '30px'
                                    }}
                                    onChange={(e) => changeOrderViewerInEntities(el.Id, +e)}
                                    value={el.order.toString()}
                                />
                            </span>
                            <SimpleButton
                                wd='150px'
                                addStyle={{
                                    height: '30px',
                                }}
                                bg='#CC3333'
                                onClick={() => deleteView(el.Id)}
                                text='Удалить из памяти'
                            />
                        </li>
                    })}
                </ul>
                <WrapperNeumorphism>
                    <div className={styles.wrapperListConfig}>
                        {configPaste.map((switchEl) => {
                            return <div
                                key={switchEl.id}
                                className={styles.rowSwitch}>
                                <SwitchWithText
                                    onChange={(check) => {
                                        changeValueConfigPaste(switchEl.id, check);
                                    }}
                                    text={switchEl.text}
                                    value={switchEl.isActive}
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
                    <div className={styles.wrapperSettingWithView}>
                        <div className={styles.rowSwitchSetting}>
                            {settingViewer.map(switchEl => {
                                console.log("🚀 ~ file: PasteViewer.tsx:239 ~ switchEl:", switchEl)
                                if (switchEl.id === URL_VIEWER_SETTING) {
                                    console.log('44')
                                    return <div
                                        key={switchEl.id}
                                        className={styles.inputSettingUrlWrapper}
                                    >
                                        <Switch
                                            isRounded
                                            onChange={check => changeActiveSettingForPaste(switchEl.id, check)}
                                            value={switchEl.isActive}
                                        />
                                        <InputWithUnderLineColor
                                            placeholder='URL контента'
                                            value={switchEl.value}
                                            size='s'
                                            addStyle={{
                                                width: '100%'
                                            }}
                                            onChange={value => changeValueSettingForPaste(switchEl.id, value)}
                                        />
                                    </div>
                                }
                                return <SwitchWithText
                                    key={switchEl.id}
                                    onChange={(check) => changeActiveSettingForPaste(switchEl.id, check)}
                                    text={switchEl.text}
                                    bold={switchEl.bold}
                                    value={switchEl.isActive}
                                />
                            })}
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
                onClick={pasteViewerInEntities}
                text='Применить'
            />

        </div>
    )
}

export default PasteViewer