/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************************************************!*\
  !*** ./src/content/modalPasteViewer/contentModalPaste.ts ***!
  \***********************************************************/
// import classNames from 'classnames';
// import IconClose from '../../assets/icon/IconClose.svg';
// import IconPaste from '../../assets/icon/IconPaste.svg';
// import IconPlus from '../../assets/icon/IconPlus.svg';
// import renderPageOne from '../../screens/OneScreenCopyModal/OneScreenCopyModal';
// import renderPageTwo from '../../screens/TwoScreenCopyModal/TwoScreenCopyModal';
// import { IconService } from '../../services/Icon.service';
// import { MenuLeftNavbar, TypePasteViewers } from '../../type/components.dto';
// import { EntitiesType, RequestForPasteViewerType, ViewerType } from '../../type/entities.dto';
// import { IconType } from '../../type/icon.dto';
// import { createElementNode } from '../../utils/components';
// import { EntitiesService } from './../../services/Entities.service';
// import styles from './contentModalPaste.scss';
// const documentBody = document.body
// const clearBeforeNode = () => {
//   const nodes = document.querySelectorAll('.exNeolant')
//   nodes.forEach(element => {
//     element.remove();
//   });
// }
// clearBeforeNode()
// const deleteView = (id: string) => {
//   chrome.storage.local.get(["viewersState"], function (result) {
//     const allView = result.viewersState && JSON.parse(result.viewersState)
//     const saveViewersStorage = allView.filter((item: any) => item.Id !== id)
//     chrome.storage.local.set({
//       viewersState: JSON.stringify(saveViewersStorage)
//     }, function () {
//       console.log("Данные сохранены");
//     });
//   });
// }
// const glEntitiesFromPaste = new useState<EntitiesType[]>([], () => {
//   insertContent()
//   renderShowLoading()
// })
// const glCurrentRightPage = new useState<string>('1', () => { })
// const glViewerForPaste = new useState<ViewerType[]>([], () => {
//   insertContent()
// })
// const glIcons = new useState<IconType[]>([], () => {
//   insertContent()
// })
// const changeSelectedToggleiewer = (id: string) => {
//   glViewerForPaste.update(glViewerForPaste.value.map(item => {
//     if (item.Id === id) {
//       item.isSelected = !item?.isSelected
//     }
//     return item
//   }))
// }
// const changeOrderViewerInEntities = (id: string, order: number) => {
//   const newViewers = glViewerForPaste.value.map(item => {
//     if (item.Id === id) {
//       item.order = order
//     }
//     return item
//   })
//   glViewerForPaste.update(newViewers)
// }
// chrome.runtime.sendMessage({
//   action: 'getEntities',
//   payload: window.location.origin
// })
// const fetchIcons = async () => {
//   try {
//     const response = await IconService.getIcons()
//     glIcons.update(response)
//   } catch (error) {
//   }
// }
// fetchIcons()
// chrome.runtime.onMessage.addListener(
//   function (request, sender, sendResponse) {
//     if (request.action === 'postEntitiesForPasteInsert') {
//       glEntitiesFromPaste.update(request.payload)
//     }
//   }
// );
// chrome.storage.local.get(["viewersState"], function (result) {
//   const allView = result.viewersState && JSON.parse(result.viewersState)
//   const saveViewersStorage: ViewerType[] = Array.isArray(allView) ? allView : []
//   glViewerForPaste.update(saveViewersStorage)
// });
// chrome.storage.onChanged.addListener((changes, namespace) => {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     if (!newValue) return
//     const viewers = JSON.parse(newValue)
//     glViewerForPaste.update(viewers)
//   }
// });
// chrome.runtime.onMessage.addListener(
//   function (request, sender, sendResponse) {
//     if (request.actions === 'isShowModal') {
//       if (request.payload) {
//         modalWrapepr.classList.add(styles.modalWrapper__active)
//         insertContent()
//       } else {
//         modalWrapepr.classList.remove(styles.modalWrapper__active)
//       }
//     }
//   }
// );
// const modalWrapepr = createElementNode('div', [styles.modalWrapper, styles.modalWrapper__active])
// const modal = createElementNode('div', [styles.modal])
// const wrapper = createElementNode('div', [styles.wrapperModal])
// const loadingModal = createElementNode('div')
// function renderShowLoading() {
//   loadingModal.className = classNames(styles.modalLoading, {
//     [styles.modalLoading__show]: !glEntitiesFromPaste?.value?.length
//   })
//   if (glEntitiesFromPaste?.value?.length) {
//     setTimeout(() => {
//       loadingModal.remove()
//     }, 1000)
//   }
//   loadingModal.innerHTML = 'Загрузка...'
// }
// renderShowLoading()
// wrapper.append(loadingModal)
// const wrapperLeft = createElementNode('div', [styles.wrapperLeft])
// const navbarUl = createElementNode('ul', [styles.navbar__menu])
// const ulContainer = createElementNode('ul', [styles.list])
// const wrapperPageOne = createElementNode('div', [styles.wrapperPageOne])
// const wrapperRight = createElementNode('div', [styles.wrapperRight])
// const top = createElementNode('img', [styles.top])
// modalWrapepr.classList.add('exNeolant')
// const leftMenuConfig: MenuLeftNavbar[] = [
//   {
//     id: '1',
//     label: 'Виды в текущем классе',
//     title: IconPlus
//   },
//   {
//     id: '2',
//     label: 'Коппировать',
//     title: IconPaste
//   }
// ]
// const renderLeftMenu = () => {
//   leftMenuConfig.forEach((item, i) => {
//     const categoryItem = createElementNode('li', [styles.navbar__item])
//     categoryItem.onclick = () => {
//       insertContent((i + 1).toString())
//       glCurrentRightPage.update((i + 1).toString())
//     }
//     const categoryItemLink = createElementNode('div', [styles.navbar__link])
//     const categoryItemLink_img = createElementNode('img', [styles.navbar__link_img])
//     categoryItemLink_img.setAttribute('src', item.title)
//     categoryItemLink.append(categoryItemLink_img)
//     categoryItem.append(categoryItemLink)
//     const label = document.createElement('span')
//     label.innerText = item.label
//     categoryItemLink.append(label)
//     navbarUl.append(categoryItem)
//   })
//   wrapperLeft.append(navbarUl)
// }
// renderLeftMenu()
// wrapper.append(wrapperLeft)
// wrapper.append(wrapperRight)
// top.onclick = () => {
//   modalWrapepr.classList.toggle(styles.modalWrapper__active)
//   setTimeout(() => { clearBeforeNode() }, 1000)
// }
// top.setAttribute('src', IconClose)
// modal.append(top)
// modal.append(wrapper)
// modalWrapepr.append(modal)
// documentBody.append(modalWrapepr)
// const addStateViewers = (view: ViewerType) => {
//   chrome.storage.local.get(["viewersState"], function (result) {
//     const allView = result.viewersState && JSON.parse(result.viewersState)
//     const saveViewersStorage = Array.isArray(allView) ? allView : []
//     saveViewersStorage.push(view)
//     chrome.storage.local.set({
//       viewersState: JSON.stringify(saveViewersStorage)
//     }, function () {
//       console.log("Данные сохранены");
//     });
//   });
// }
// const pasteViewers = async ({
//   glViewerForPaste,
//   configPasteEntities,
//   glValueIcons,
//   settingForPaste,
//   urlValue,
// }: TypePasteViewers) => {
//   const isApplySettingsCustom = configPasteEntities.find(_ => _.id === '3').value
//   const isApplyIconCustom = configPasteEntities.find(_ => _.id === '4').value
//   const isApplyNestedEntities = configPasteEntities.find(_ => _.id === '2').value
//   const isApplyReWriteIconWithEdit = configPasteEntities.find(_ => _.id === '5').value || false
//   const customSettings: Record<keyof Omit<RequestForPasteViewerType['Settings'], 'Url'>, boolean | number> = {
//     hideInStructureOfObject: false,
//     hideInViewingModel: false,
//     SendParams: false,
//     hideEmptyFields: false,
//     viewMode: 0
//   }
//   settingForPaste.forEach(setting => {
//     if (setting.id === 'viewMode') {
//       customSettings[setting.id] = Number(setting?.value)
//       return
//     }
//     customSettings[setting.id] = !!setting?.value
//   })
//   // @ts-ignore
//   customSettings.Url = urlValue
//   glEntitiesFromPaste.value.forEach(async entity => {
//     if (!entity.isCurrent) if (!isApplyNestedEntities) return
//     const newViewers: ViewerType[] = []
//     const promisesListResponse: Promise<ViewerType>[] = [];
//     glViewerForPaste.forEach(async viewer => {
//       if (!viewer.isSelected) return
//       const settingForPost = (isApplySettingsCustom ? { ...viewer.Settings, ...customSettings } : viewer.Settings) as RequestForPasteViewerType['Settings']
//       const IconForPost: string = ((isApplyIconCustom && glValueIcons) ? glValueIcons : viewer.Icon)
//       const dataPost: RequestForPasteViewerType = {
//         Caption: viewer.Caption,
//         Icon: IconForPost,
//         Attributes: viewer.Attributes,
//         Name: viewer.Name,
//         Settings: settingForPost
//       }
//       const isHaveViewer = entity.Viewers.find(_ => _.Caption === viewer.Caption)
//       // console.log("🚀 ~ file: contentModalPaste.ts:281 ~ newViwer ~ entity:", entity)
//       const newViwer = (async () => {
//         if (isHaveViewer) {
//           const dataCreate = {
//             ...dataPost,
//             Icon: (isApplyReWriteIconWithEdit && IconForPost) ? IconForPost : isHaveViewer.Icon,
//             Id: isHaveViewer.Id
//           }
//           const response = await EntitiesService.changeViewerInEntities(entity.Id, dataCreate)
//           newViewers.push(dataCreate)
//           console.log(`Изменили вид: ${dataCreate.Caption} в классе ${entity.Name}`)
//           // console.log("🚀 response add change viewer id ", response)
//           return dataCreate
//         } else {
//           const response = await EntitiesService.pasteViewerInEntities(entity.Id, dataPost)
//           newViewers.push({
//             ...dataPost,
//             Id: response.Id
//           })
//           console.log(`Создали вид: ${dataPost.Caption} в классе ${entity.Name}`)
//           // console.log("🚀 response add new viewer id ", response)
//           return {
//             ...dataPost,
//             Id: response.Id
//           }
//         }
//       })()
//       promisesListResponse.push(newViwer)
//     })
//     Promise.all(promisesListResponse).then(async (e) => {
//       const currentOrder = [...entity.Viewers]
//       glViewerForPaste.forEach(async viewer => {
//         if (!viewer.isSelected) return
//         const newViewer = e.find(item => item.Caption === viewer.Caption)
//         const order: number = glViewerForPaste.find(_ => _.Caption === newViewer.Caption)?.order || 0
//         currentOrder.splice(order - 1, 0, newViewer)
//       })
//       const orderHash: Record<string, number> = {}
//       currentOrder.forEach((_, ind) => orderHash[_.Id] = ind)
//       const responseOrdert = await EntitiesService.changeOrderPosition(entity.Id, orderHash)
//     })
//   })
// }
// async function insertContent(pageId?: string) {
//   wrapperRight.innerHTML = ''
//   wrapperRight.append(await getHtml(pageId || glCurrentRightPage.value))
// }
// const getHtml = async (idPage: string) => {
//   if (idPage === '1') {
//     const component = await renderPageOne({
//       addStateViewers,
//       glEntitiesFromPaste,
//       glViewerForPaste,
//       ulContainer,
//       wrapperPageOne
//     }) as unknown as Node
//     return component
//   }
//   if (idPage === '2') {
//     return renderPageTwo({
//       changeSelectedToggleiewer,
//       deleteView,
//       glIcons,
//       glViewerForPaste,
//       modalWrapepr,
//       pasteViewers,
//       changeOrderViewerInEntities
//     })
//   }
//   return ''
// }

/******/ })()
;
//# sourceMappingURL=contentModalPaste.js.map