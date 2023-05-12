import { Ignore } from 'glob/dist/mjs/ignore';
import { EntitiesType, ViewerType } from '../type/entities.dto';
import './popup.scss'

import { gsap } from "gsap";
import { createElementNode, useState } from "../utils/components";

type PageNavigatorType = Record<string, () => HTMLElement>
const selectPage = new useState<string>('1', () => {
    renderBlock()
})
const showModalPasteInterface = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        const currentTabId = tabs[0].id;
        const allowBaseUrl = ['pdm-kueg', 'lukoil-test']
        const url = new URL(tabs[0].url)

        if (!allowBaseUrl.some(_ => tabs[0].url.includes(_))) return new RenderWarningTextInPopup('Расширение открыто вне портала').render()
        if (url.pathname !== "/structure/entities") return new RenderWarningTextInPopup('Не открыт раздел с классами').render()
        if (!url.searchParams.get('id')) return new RenderWarningTextInPopup('Не выбран класс').render()

        await chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            files: ['contentModalPaste.js']
        })
        await chrome.scripting.insertCSS({
            files: ["contentModalPaste.css"],
            target: { tabId: currentTabId },
        });
        await chrome.tabs.sendMessage(currentTabId, {
            actions: 'isShowModal',
            payload: true
        });
    });
}
function move(id: string, position: string, color: string) {
    selectPage.update(id)
    const tl = gsap.timeline();

    tl.to("#bgBubble", { duration: 0.15, bottom: "-30px", ease: "ease-out" }, 0)
        .to("#bubble1", { duration: 0.1, y: "120%", boxShadow: 'none', ease: "ease-out", }, 0)
        .to("#bubble2", { duration: 0.1, y: "120%", boxShadow: 'none', ease: "ease-out", }, 0)
        .to("#bubble3", { duration: 0.1, y: "120%", boxShadow: 'none', ease: "ease-out", }, 0)
        .to("#bubble4", { duration: 0.1, y: "120%", boxShadow: 'none', ease: "ease-out", }, 0)
        .to(".icon", { duration: 0.05, opacity: 0, ease: "ease-out", }, 0)
        .to("#bgBubble", { duration: 0.2, left: position, ease: "ease-in-out" }, 0.1)
        .to("#bgBubble", { duration: 0.15, bottom: "-50px", ease: "ease-out" }, '-=0.2')
        .to(`#bubble${id}`, { duration: 0.15, y: "0%", opacity: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', ease: "ease-out" }, '-=0.1')
        .to(`#bubble${id}> span`, { duration: 0.15, y: "0%", opacity: 0.7, ease: "ease-out" }, '-=0.1')
        .to("#navbarContainer", { duration: 0.3, backgroundColor: color, ease: "ease-in-out" }, 0)
        .to("#bg", { duration: 0.3, backgroundColor: color, ease: "ease-in-out" }, 0)
        .to("#bgBubble", { duration: 0.3, backgroundColor: color, ease: "ease-in-out" }, 0)
}

const menuElement1 = document.querySelector('.menuElement1')

const menuElement2 = document.querySelector('.menuElement2')

const menuElement3 = document.querySelector('.menuElement3')

const menuElemen4 = document.querySelector('.menuElemen4')



menuElement1.addEventListener('click', () => move('1', '50px', '#ffcc80'))
menuElement2.addEventListener('click', () => move('2', '150px', '#81d4fa'))
menuElement3.addEventListener('click', () => move('3', '250px', '#c5e1a5'))
menuElemen4.addEventListener('click', () => move('4', '350px', '#ce93d8'))

const renderBlock = () => {
    const objPage: PageNavigatorType = {
        '1': renderOnePage,
        '2': renderTwoPage,
        '3': renderOnePage,
        '4': renderOnePage,
    }
    const placeContent = document.querySelector('.bodyContent')
    placeContent.innerHTML = ''
    placeContent.appendChild(objPage[selectPage.value]())
}
renderBlock()

const renderOnePage = () => {
    const wrapper = createElementNode('div')
    const warapperButton = createElementNode('div')
    wrapper.innerHTML = '1'
    // <div id="pasteViewer" class="buttonActions reverse dark">Копировать/Вставить</div>

    return wrapper
}
const renderTwoPage = () => {
    const wrapper = createElementNode('div')
    wrapper.innerHTML = '2'
    return wrapper
}


// button actions
document.querySelectorAll('.buttonActions').forEach(button => button.innerHTML = '<div><span>' + button.textContent.trim().split('').join('</span><span>') + '</span></div>');
// button actions


class RenderWarningTextInPopup {
    private warningText: string
    private body = document.body
    constructor(message: string) {
        this.warningText = message;
    }

    render() {
        const wrapperWarnign = createElementNode('div', ['wrapperWarnign'])
        const warningText = createElementNode('span', ['warningText'])
        warningText.innerText = this.warningText
        wrapperWarnign.append(warningText)
        this.body.appendChild(wrapperWarnign);
        setTimeout(() => {
            wrapperWarnign.remove()
        }, 3000)
    }
}
// class RenderWarningTextInPopup {
//     private warningText: string
//     constructor(message: string) {
//         this.warningText = message;
//     }
//     private body = document.body

//     // wrapperWarnignText
//     private wrapperWarnignText = createElementNode('div', ['wrapperWarnignText']);

//            wrapperWarnignText.innerText = this.warningText;

// }
// chrome.runtime.sendMessage('viewers', response => {
//     console.log(JSON.parse(response), 'response msg');
// })
// const tbody = document.querySelector('.tbody')
// const tbodyStorage = document.querySelector('.tbodyStorage')
// const isSortViewer = document.getElementById('sortIsCheck') as HTMLInputElement
// const buttonPasteJS = document.getElementById('button')
// console.log("🚀 ~ file: popup.ts:11 ~ buttonPasteJS:", buttonPasteJS)
// setInterval(() => {
//     (async () => {
//         const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
//         const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
//         // do something with response here, not outside the function
//         console.log(response);
//       })();
// }, 1000)
// buttonPasteJS.addEventListener('click', () => {
//     console.log(1231);
//     // console.log("🚀 ~ file: popup.ts:24 ~ chrome.tabs.onActivated.addListener ~ tab:", tab)
// })
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     const viewers = request.message.payload as Viewer[]
//     if (request.action !== "viewers") return
//     console.log("🚀 ~ file: popup.ts:11 ~ request:", request)
//     console.log("🚀 ~ file: popup.ts:11 ~ viewers:", viewers)
//     const renderViewers = viewers.filter(item => item.Name)
//     isSortViewer.addEventListener('click', () => {
//         console.dir(isSortViewer?.checked)
//         for (const item of viewers) {
//             const row = document.createElement('tr')
//             const cellName = document.createElement('td')
//             cellName.innerText = item.Caption
//             const cellPlus = document.createElement('td')
//             cellPlus.innerText = '+'
//             cellPlus.setAttribute('id', item.Id)
//             cellPlus.onclick = (e: any) => {
//                 // console.log(e.target.getAttribute('id'));
//                 const id = e.target.getAttribute('id')
//                 addIdViewersStorage(id, viewers)
//             }
//             row.append(cellName)
//             row.append(cellPlus)
//             tbody.append(row)
//         }
//     })
// });
// const addNestedTable = (viewers: any, resetTable?: boolean) => {
//     if (resetTable) tbodyStorage.innerHTML = ''


//     for (const currentView of viewers) {
//         const row = document.createElement('tr')
//         const cellName = document.createElement('td')
//         cellName.innerText = currentView.Caption
//         const cellMinus = document.createElement('td')
//         cellMinus.innerText = '-'
//         cellMinus.onclick = () => {
//             deleteView(currentView.Id)
//         }
//         const cellPaste = document.createElement('td')
//         cellPaste.onclick = () => {

//             // insertInEntities(currentView)
//         }
//         cellPaste.innerText = 'Вставить'
//         row.append(cellName)
//         row.append(cellMinus)
//         row.append(cellPaste)
//         tbodyStorage.append(row)
//     }
// }
// chrome.storage.onChanged.addListener((changes, namespace) => {
//     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//         const viewers = newValue && JSON.parse(newValue)
//         addNestedTable(viewers, true)
//     }
// });
// const addIdViewersStorage = async (id: any, viewers: any[]) => {
//     const currentView = viewers?.find((item: { Id: any; }) => item.Id === id)
//     chrome.storage.local.get(["viewersState"], function (result) {
//         const allView = result.viewersState && JSON.parse(result.viewersState)
//         const saveViewersStorage = Array.isArray(allView) ? allView : []
//         saveViewersStorage.push(currentView)
//         console.log("🚀 ~ saveViewersStorage:", saveViewersStorage)

//         chrome.storage.local.set({
//             viewersState: JSON.stringify(saveViewersStorage)
//         }, function () {
//             console.log("Данные сохранены");
//         });
//     });
// }
// const renderSaveViewers = async () => {
//     chrome.storage.local.get(["viewersState"], function (result) {
//         console.log("🚀 ~ result:", result.viewersState)
//         const viewers = result.viewersState && JSON.parse(result.viewersState)
//         viewers && addNestedTable(viewers)
//     });
// }
// renderSaveViewers()

// const insertInEntities = async (currentView: { Caption: any; Icon: any; Attributes: any; Settings: any; }) => {

//     chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
//         const idEntites = getParamFromUrl(tabs[0].url).id
//         try {
//             const responseCreate = await fetch(`https://lukoil-test.io.neolant.su/api/structure/entities/${idEntites}/viewers`, {
//                 method: "POST",
//                 body: JSON.stringify({
//                     "Name": "VIEWER_EXTERNAL",
//                     "Caption": currentView.Caption,
//                     "Icon": currentView.Icon,
//                     "Attributes": currentView.Attributes,
//                     "Settings": currentView.Settings
//                 }),
//                 headers: {
//                     "Accept": "application/json, text/plain, /",
//                     "Accept-Encoding": "gzip, deflate, br",
//                     "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
//                     "Connection": "keep-alive",
//                     "Content-Length": "103",
//                     "Content-Type": "application/json;charset=UTF-8"
//                 }
//             }).then(_ => _.json())
//             console.log(responseCreate)

//         } catch (error) {
//             console.log("🚀 ~ error:", error)
//         }
//     })

// }

// const deleteView = (id: string) => {
//     chrome.storage.local.get(["viewersState"], function (result) {
//         const allView = result.viewersState && JSON.parse(result.viewersState)
//         const saveViewersStorage = allView.filter((item: any) => item.Id !== id)

//         chrome.storage.local.set({
//             viewersState: JSON.stringify(saveViewersStorage)
//         }, function () {
//             console.log("Данные сохранены");
//         });
//     });
// }

// const getParamFromUrl = (url: string) => {
//     // Разбиваем строку запроса на отдельные параметры
//     const params = new URLSearchParams(url);

//     // Создаем пустой объект для хранения параметров
//     const paramsObj: Record<string, string> = {};

//     // Проходимся по всем параметрам и добавляем их в объект
//     params.forEach((value, key) => {
//         const keyArr = key?.split("?")

//         const keyValue = keyArr.length > 1 ? keyArr[1] : keyArr[0]

//         paramsObj[keyValue] = value;
//     });

//     return paramsObj
// }