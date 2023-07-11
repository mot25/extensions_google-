import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import IconClose from '../../../assets/icon/IconClose.svg';
import IconPaste from '../../../assets/icon/IconPaste.svg';
import IconPlus from '../../../assets/icon/IconPlus.svg';
import { OneScreenCopyModal } from '../../../screens/OneScreenCopyModal';
import { MenuLeftNavbar, PageNavigatorType, TypePasteViewers } from '../../../type/components.dto';
import { EntitiesType, RequestForPasteViewerType, ViewerType } from '../../../type/entities.dto';
import styles from './AppModalPaste.module.scss';
import { IconType } from '../../../type/icon.dto';
import { IconService } from '../../../services/Icon.service';
import { TwoScreenCopyModal } from '../../../screens/TwoScreenCopyModal';
import { EntitiesService } from '../../../services/Entities.service';

// import renderPageOne from '../../screens/OneScreenCopyModal/OneScreenCopyModal';
// import renderPageTwo from '../../screens/TwoScreenCopyModal/TwoScreenCopyModal';
type Props = {}
const leftMenuConfig: MenuLeftNavbar[] = [
    {
        id: 1,
        label: 'Виды в текущем классе',
        title: IconPlus
    },
    {
        id: 2,
        label: 'Коппировать',
        title: IconPaste
    }
]

chrome.runtime.sendMessage({
    action: 'getEntities',
    payload: window.location.origin
})


const AppModalPaste = (props: Props) => {

    const refModalWrapepr = useRef<HTMLDivElement>(null)

    const [glEntitiesFromPaste, setGlEntitiesFromPaste] = useState<EntitiesType[]>([])
    console.log(Date.now());

    const [glCurrentRightPage, setGlCurrentRightPage] = useState<number>(1)
    const [glIcons, setGlIcons] = useState<IconType[]>([])
    const [glViewerForPaste, setGlViewerForPaste] = useState<ViewerType[]>([])



    const changeOrderViewerInEntities = (id: string, order: number) => {
        const newViewers = glViewerForPaste.map(item => {
            if (item.Id === id) {
                item.order = order
            }
            return item
        })
        setGlViewerForPaste(newViewers)
    }
    const clearBeforeNode = () => {
        refModalWrapepr.current.classList.toggle(styles.modalWrapper__active)
        const nodes = document.querySelectorAll('#rootContentEntry')
        nodes.forEach(element => {
            element.remove();
        });
        console.log('extensions remove')
    }
    const fetchIcons = async () => {
        try {
            const response = await IconService.getIcons()
            setGlIcons(response)
        } catch (error) {
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
        setGlViewerForPaste(prev => prev.map(item => {
            if (item.Id === id) {
                item.isSelected = !item?.isSelected
            }
            return item
        }))
    }
    const pasteViewers = async ({
        glViewerForPaste,
        configPasteEntities,
        glValueIcons,
        settingForPaste,
        urlValue,
    }: TypePasteViewers) => {

        const isApplySettingsCustom = configPasteEntities.find(_ => _.id === '3').value
        const isApplyIconCustom = configPasteEntities.find(_ => _.id === '4').value
        const isApplyNestedEntities = configPasteEntities.find(_ => _.id === '2').value
        const isApplyReWriteIconWithEdit = configPasteEntities.find(_ => _.id === '5').value || false
        const customSettings: Record<keyof RequestForPasteViewerType['Settings'], boolean | number | string> = {
        hideInStructureOfObject: false,
            hideInViewingModel: false,
            SendParams: false,
            hideEmptyFields: false,
            viewMode: 0,
            Url: ''
        }

        settingForPaste.forEach(setting => {
            if (setting.id === 'viewMode') {
                customSettings[setting.id] = Number(setting?.value)
                return
            }
            customSettings[setting.id] = !!setting?.value
        })

        customSettings['Url'] = urlValue

        glEntitiesFromPaste.forEach(async entity => {
            if (!entity.isCurrent) if (!isApplyNestedEntities) return
            const newViewers: ViewerType[] = []
            const promisesListResponse: Promise<ViewerType>[] = [];

            glViewerForPaste.forEach(async viewer => {
                if (!viewer.isSelected) return

                const settingForPost = (isApplySettingsCustom ? { ...viewer.Settings, ...customSettings } : viewer.Settings) as RequestForPasteViewerType['Settings']
                const IconForPost: string = ((isApplyIconCustom && glValueIcons) ? glValueIcons : viewer.Icon)
                const dataPost: RequestForPasteViewerType = {
                    Caption: viewer.Caption,
                    Icon: IconForPost,
                    Attributes: viewer.Attributes,
                    Name: viewer.Name,
                    Settings: settingForPost
                }
                const isHaveViewer = entity.Viewers.find(_ => _.Caption === viewer.Caption)

                // console.log("🚀 ~ file: contentModalPaste.ts:281 ~ newViwer ~ entity:", entity)
                const newViwer = (async () => {
                    if (isHaveViewer) {
                        const dataCreate = {
                            ...dataPost,
                            Icon: (isApplyReWriteIconWithEdit && IconForPost) ? IconForPost : isHaveViewer.Icon,
                            Id: isHaveViewer.Id
                        }
                        const response = await EntitiesService.changeViewerInEntities(entity.Id, dataCreate)
                        newViewers.push(dataCreate)
                        console.log(`Изменили вид: ${dataCreate.Caption} в классе ${entity.Name}`)
                        // console.log("🚀 response add change viewer id ", response)
                        return dataCreate
                    } else {
                        const response = await EntitiesService.pasteViewerInEntities(entity.Id, dataPost)
                        newViewers.push({
                            ...dataPost,
                            Id: response.Id
                        })
                        console.log(`Создали вид: ${dataPost.Caption} в классе ${entity.Name}`)
                        // console.log("🚀 response add new viewer id ", response)
                        return {
                            ...dataPost,
                            Id: response.Id
                        }
                    }
                })()
                promisesListResponse.push(newViwer)
            })

            Promise.all(promisesListResponse).then(async (e) => {
                const currentOrder = [...entity.Viewers]

                glViewerForPaste.forEach(async viewer => {
                    if (!viewer.isSelected) return
                    const newViewer = e.find(item => item.Caption === viewer.Caption)
                    const order: number = glViewerForPaste.find(_ => _.Caption === newViewer.Caption)?.order || 1
                    currentOrder.splice(order - 1, 0, newViewer)
                })
                const orderHash: Record<string, number> = {}
                currentOrder.forEach((_, ind) => orderHash[_.Id] = ind)
                const responseOrdert = await EntitiesService.changeOrderPosition(entity.Id, orderHash)
            })

        })
    }

    const objRoutePage: PageNavigatorType = {
        1: <OneScreenCopyModal
            addStateViewers={addStateViewers}
            glEntitiesFromPaste={glEntitiesFromPaste}
            glViewerForPaste={glViewerForPaste}
        />,
        2: <TwoScreenCopyModal
            deleteView={deleteView}
            pasteViewers={pasteViewers}
            changeOrderViewerInEntities={changeOrderViewerInEntities}
            changeSelectedToggleiewer={changeSelectedToggleiewer}
            glIcons={glIcons}
            glViewerForPaste={glViewerForPaste}
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
                    setGlEntitiesFromPaste(request.payload)
                }
            }
        );
        chrome.storage.local.get(["viewersState"], function (result) {
            const allView = result.viewersState && JSON.parse(result.viewersState)
            const saveViewersStorage: ViewerType[] = Array.isArray(allView) ? allView : []
            setGlViewerForPaste(saveViewersStorage)
        });
        chrome.storage.onChanged.addListener((changes, namespace) => {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                if (!newValue) return
                const viewers = JSON.parse(newValue)
                setGlViewerForPaste(viewers)
            }
        });
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.actions === 'isShowModal') {
                    if (request.payload) {
                        refModalWrapepr.current.classList.add(styles.modalWrapper__active)
                    } else {
                        refModalWrapepr.current.classList.remove(styles.modalWrapper__active)
                    }
                }
            }
        );
    }, [])

    return (
        <div ref={refModalWrapepr} className={classNames(styles.modalWrapper, styles.modalWrapper__active)} >
            <div className={classNames(styles.modal)}>
                <img
                    onClick={() => {
                        setTimeout(clearBeforeNode, 1000)
                    }}
                    src={IconClose}
                    className={styles.top}
                />
                <div className={styles.wrapperModal}>
                    <div
                        className={classNames(styles.modalLoading, {
                            [styles.modalLoading__show]: !glEntitiesFromPaste?.length
                        })}
                    >
                        {!glEntitiesFromPaste?.length ? 'Загрузка...' : null}
                    </div>
                    <div className={styles.wrapperLeft}>
                        <ul className={styles.navbar__menu}>
                            {leftMenuConfig.map((item) => {
                                return <li
                                    key={item.id}
                                    onClick={() => setGlCurrentRightPage(item.id)}
                                    className={styles.navbar__item}
                                >
                                    <div className={styles.navbar__link}>
                                        <img
                                            className={styles.navbar__link_img}
                                            src={item.title}
                                        />
                                        <span>{item.label}</span>
                                    </div>
                                </li>
                            })}

                        </ul>
                    </div>
                    <div className={styles.wrapperRight}>
                        {objRoutePage[glCurrentRightPage]}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppModalPaste

