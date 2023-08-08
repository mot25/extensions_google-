import IconClose from '@/assets/icon/IconClose.svg';
import IconPaste from '@/assets/icon/IconPaste.svg';
import IconPlus from '@/assets/icon/IconPlus.svg';
import { CopyViewer } from '@/screens/CopyViewer';
import { PasteViewer } from '@/screens/PasteViewer';
import { IconService } from '@/services/Icon.service';
import { MenuLeftNavbar, PageNavigatorType, TypePasteViewers } from '@/type/components.dto';
import { EntitiesType, RequestForPasteViewerType, ViewerType } from '@/type/entities.dto';
import { IconType } from '@/type/icon.dto';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import styles from './AppModalPaste.module.scss';
import { APPLY_SETTINGS, COPY_VIEWER_NESTED, REPLACE_ICON, SET_ICON, URL_VIEWER_SETTING } from './constantAppModalPaste';
import { EntitiesService } from '@/services/Entities.service';

type Props = {}
const leftMenuConfig: MenuLeftNavbar[] = [
    {
        id: 1,
        label: 'Виды в текущем классе',
        title: <IconPlus />
    },
    {
        id: 2,
        label: 'Копировать',
        title: <IconPaste />
    }
]

chrome.runtime.sendMessage({
    action: 'getEntities',
    payload: window.location.origin
})



const AppModalPaste = (props: Props) => {

    const refModalWrapper = useRef<HTMLDivElement>(null)

    const [entitiesFromPaste, setEntitiesFromPaste] = useState<EntitiesType[]>([])

    const [currentRightPage, setCurrentRightPage] = useState<number>(1)
    const [icons, setIcons] = useState<IconType[]>([])
    const [viewerForPaste, setViewerForPaste] = useState<ViewerType[]>([])



    const changeOrderViewerInEntities = (id: string, order: number) => {
        const newViewers = viewerForPaste.map(item => {
            if (item.Id === id) item.order = order
            return item
        })
        setViewerForPaste(newViewers)
    }
    const removeExtensionsFromPage = () => {
        refModalWrapper.current.classList.toggle(styles.modalWrapper__active)
        const nodes = document.querySelectorAll('#rootContentEntry')
        nodes.forEach(element => {
            element.remove();
        });
        console.log('extensions remove')
    }
    const fetchIcons = async () => {
        try {
            const response = await IconService.getIcons()
            setIcons(response)
        } catch (error) {
            console.log("🚀 ~ file: AppModalPaste.tsx:68 ~ fetchIcons ~ error:", error)
        }
    }
    const addStateViewers = (view: ViewerType) => {
        chrome.storage.local.get(["viewersState"], function (result) {
            const allView = result.viewersState && JSON.parse(result.viewersState)
            const saveViewersStorage = Array.isArray(allView) ? allView : []
            saveViewersStorage.push(view)
            chrome.storage.local.set({
                viewersState: JSON.stringify(saveViewersStorage)
            }, function () {
                console.log("Данные сохранены");
            });
        });
    }
    const deleteView = (id: string) => {
        chrome.storage.local.get(["viewersState"], function (result) {
            const allView = result.viewersState && JSON.parse(result.viewersState)
            const saveViewersStorage = allView.filter((item: any) => item.Id !== id)

            chrome.storage.local.set({
                viewersState: JSON.stringify(saveViewersStorage)
            }, function () {
                console.log("Данные сохранены");
            });
        });
    }
    const changeSelectedToggleiewer = (id: string) => {
        setViewerForPaste(prev => prev.map(item => {
            if (item.Id === id) item.isSelected = !item?.isSelected
            return item
        }))
    }



    const pasteViewers = async ({
        viewerForPaste,
        configPasteEntities,
        settingForPaste,
    }: TypePasteViewers) => {
        console.log('config for paste', {
            viewerForPaste,
            configPasteEntities,
            settingForPaste,
        })
        // export const TRANSFER_DATA_EXTERNAL_SERVICES = 'SendParams'
        // export const HIDE_IN_TREE = 'hideInStructureOfObject'
        // export const HIDE_IN_MODEL = 'hideInViewingModel'
        // export const HIDE_EMPTY_FIELD = 'hideEmptyFields'
        // export const ONLY_READ = 'viewMode'
        // export const COPY_ATTR_IN_VIEWER = 'copy_attr_in_viewer'
        // export const COPY_ATTR_IN_ENTITIES = 'copy_attr_in_entities'
        // export const URL_VIEWER_SETTING = 'url_viewer_setting'
        // export const ID_SELECT_ICON = 'id_select_icon'
        const isApplySettingsCustom = settingForPaste.find(_ => _.id === APPLY_SETTINGS).isActive
        const isApplyIconCustom = configPasteEntities.find(_ => _.id === SET_ICON).isActive
        const isApplyNestedEntities = configPasteEntities.find(_ => _.id === COPY_VIEWER_NESTED).isActive
        console.log("🚀 ~ file: AppModalPaste.tsx:128 ~ AppModalPaste ~ isApplyNestedEntities:", isApplyNestedEntities)
        const isApplyReWriteIconWithEdit = configPasteEntities.find(_ => _.id === REPLACE_ICON).isActive
        const configApplyNewUrl = settingForPaste.find(_ => _.id === URL_VIEWER_SETTING)


        const initialCustomSettings: Record<keyof RequestForPasteViewerType['Settings'], boolean | number | string> = {
            hideInStructureOfObject: false,
            hideInViewingModel: false,
            SendParams: false,
            hideEmptyFields: false,
            viewMode: 0,
            Url: ''
        }

        // изменяем настройки исходя из выбранных на экране копирования
        settingForPaste.forEach(setting => {
            if (setting.id === '3') return
            if (setting.id === 'viewMode') return initialCustomSettings[setting.id] = Number(!!setting?.isActive)
            if (setting.id === URL_VIEWER_SETTING) return initialCustomSettings[setting.id] = setting.value
            initialCustomSettings[setting.id] = !!setting?.isActive
        })


        const valueIdIcon = ''
        // customSettings['Url'] = urlValue
        console.log('entitiesFromPaste', entitiesFromPaste)
        entitiesFromPaste.forEach(async entity => {
            if (!entity.isCurrent) if (!isApplyNestedEntities) return
            const promisesListResponse: Promise<ViewerType>[] = [];

            viewerForPaste.forEach(async viewer => {
                if (!viewer.isSelected) return
                initialCustomSettings.Url = configApplyNewUrl?.isActive ? configApplyNewUrl?.value : viewer?.Settings?.Url

                const settingForPost = (isApplySettingsCustom ? { ...viewer.Settings, ...initialCustomSettings } : viewer.Settings) as RequestForPasteViewerType['Settings']
                const IconForPost: string = ((isApplyIconCustom && valueIdIcon) ? valueIdIcon : viewer.Icon)
                const dataPost: RequestForPasteViewerType = {
                    Caption: viewer.Caption,
                    Icon: IconForPost,
                    Attributes: viewer.Attributes,
                    Name: viewer.Name,
                    Settings: settingForPost
                }
                console.log("🚀 ~ file: AppModalPaste.tsx:164 ~ AppModalPaste ~ dataPost:", dataPost)
                const isHaveViewer = entity.Viewers.find(_ => _.Caption === viewer.Caption)

                const newViewer = (async () => {
                    if (isHaveViewer) {
                        const dataCreate = {
                            ...dataPost,
                            Icon: (isApplyReWriteIconWithEdit && IconForPost) ? IconForPost : isHaveViewer.Icon,
                            Id: isHaveViewer.Id
                        }
                        // const response = await EntitiesService.changeViewerInEntities(entity.Id, dataCreate)
                        console.log(`Изменили вид: ${dataCreate.Caption} в классе ${entity.Name}`)
                        return dataCreate
                    } else {
                        // const response = await EntitiesService.pasteViewerInEntities(entity.Id, dataPost)
                        // console.log(`Создали вид: ${dataPost.Caption} в классе ${entity.Name}`)
                        // return {
                        //     ...dataPost,
                        //     Id: response.Id
                        // }
                    }
                })()
                promisesListResponse.push(newViewer)
            })

            //     // для вставки атрибутов в вид put
            //     // https://pdm-kueg.io.neolant.su/api/structure/entities/0ad58ed4-c7c7-ed11-8daf-85953743f5cc/viewers/c53e0660-4543-4187-8eb0-8c68c03acc86/attributes?ids=5eaf1db2-dc20-ec11-a958-00505600163f

            //     // вставка в класс атрибутов post
            //     // https://pdm-kueg.io.neolant.su/api/structure/entities/0ad58ed4-c7c7-ed11-8daf-85953743f5cc/attributes?ids=5eaf1db2-dc20-ec11-a958-00505600163f&ids=3fa85f64-5717-4562-b3fc-2c963f66afa6&ids=3fa85f64-5717-4562-b3fc-2c963f66afa6

            Promise.all(promisesListResponse)
                .then(async (e) => {
                    const currentOrder = [...entity.Viewers]
                    viewerForPaste.forEach(async viewer => {
                        if (!viewer.isSelected) return
                        const newViewer = e.find(item => item.Caption === viewer.Caption)
                        const order: number = viewerForPaste.find(_ => _.Caption === newViewer.Caption)?.order || 1
                        currentOrder.splice(order - 1, 0, newViewer)
                    })
                    const orderHash: Record<string, number> = {}
                    currentOrder.forEach((_, ind) => orderHash[_.Id] = ind)
                    const responseOrder = await EntitiesService.changeOrderPosition(entity.Id, orderHash)
                })
        })
    }

    const objRoutePage: PageNavigatorType = {
        1: <CopyViewer
            addStateViewers={addStateViewers}
            entitiesFromPaste={entitiesFromPaste}
            viewerForPaste={viewerForPaste}
        />,
        2: <PasteViewer
            deleteView={deleteView}
            pasteViewers={pasteViewers}
            changeOrderViewerInEntities={changeOrderViewerInEntities}
            changeSelectedToggleiewer={changeSelectedToggleiewer}
            icons={icons}
            viewerForPaste={viewerForPaste}
            setViewerForPaste={setViewerForPaste}
        />
    }

    useEffect(() => {
        fetchIcons()
    }, [])

    // chrome
    useEffect(() => {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.action === 'postEntitiesForPasteInsert') {
                    setEntitiesFromPaste(request.payload)
                }
            }
        );
        chrome.storage.local.get(["viewersState"], function (result) {
            const allView = result.viewersState && JSON.parse(result.viewersState)
            const saveViewersStorage: ViewerType[] = Array.isArray(allView) ? allView : []
            setViewerForPaste(saveViewersStorage)
        });
        chrome.storage.onChanged.addListener((changes, namespace) => {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                if (!newValue) return
                const viewers = JSON.parse(newValue)
                setViewerForPaste(viewers)
            }
        });
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.actions === 'isShowModal') {
                    if (request.payload) {
                        refModalWrapper.current.classList.add(styles.modalWrapper__active)
                    } else {
                        refModalWrapper.current.classList.remove(styles.modalWrapper__active)
                    }
                }
            }
        );
    }, [])

    return (
        <div ref={refModalWrapper} className={classNames(styles.modalWrapper, styles.modalWrapper__active)} >
            <div className={classNames(styles.modal)}>
                <div
                    onClick={() => {
                        setTimeout(removeExtensionsFromPage, 1000)
                    }}
                    className={styles.top}
                >
                    <IconClose />
                </div>
                <div className={styles.wrapperModal}>
                    <div
                        className={classNames(styles.modalLoading, {
                            [styles.modalLoading__show]: !entitiesFromPaste?.length
                        })}
                    >
                        {!entitiesFromPaste?.length ? 'Загрузка...' : null}
                    </div>
                    <div className={styles.wrapperLeft}>
                        <ul className={styles.navbar__menu}>
                            {leftMenuConfig.map((item, indexCategory) => {
                                return <li
                                    key={item.id}
                                    onClick={() => setCurrentRightPage(item.id)}
                                    className={styles.navbar__item}
                                >
                                    <div className={classNames(styles.navbar__link, {
                                        [styles.navbar__link__active]: indexCategory + 1 === currentRightPage
                                    })}>
                                        <div className={styles.navbar__link_img}>
                                            {item.title}
                                        </div>
                                        <span>{item.label}</span>
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div>
                    <div className={styles.wrapperRight}>
                        {objRoutePage[currentRightPage]}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppModalPaste

