import './popup.scss'

import { gsap } from "gsap";
import { createElementNode, useState } from "../utils/components";
import { ButtonInPopupAnim } from '../componets/ButtonInPopupAnim';
import { api } from '../config/Api';
import { SwagerInData } from '../componets/SwagerInData';

type PageNavigatorType = Record<number, () => HTMLElement>
const selectPage = new useState<number>(1, () => {
    renderBlock()
})
const showModalPasteInterface = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        const currentTabId = tabs[0].id;
        const allowBaseUrl = ['pdm-kueg', 'lukoil-test', 'pdm-tst-kueg', 'pdm-kueg.lukoil']

        const url = new URL(tabs[0].url)

        if (!allowBaseUrl.some(_ => tabs[0].url.includes(_))) return new RenderWarningTextInPopup('Расширение открыто вне портала').render()
        if (url.pathname !== "/structure/entities") return new RenderWarningTextInPopup('Не открыт раздел с классами').render()
        if (!url.searchParams.get('id')) return new RenderWarningTextInPopup('Не выбран класс').render()
        api.defaults.baseURL = url.origin

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
    selectPage.update(parseInt(id))
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

const divideByGroups = async () => {
    const tabs = await chrome.tabs.query({});
    const tabsGroupIds: Record<string, number[]> = {
        "swagger": [],
        "pdm-kueg.io.neolant.su": [],
        "lukoil-test.io.neolant.su": [],
        "confluence": [],
        "tfs": [],
        "mail.neolant": [],
    }
    const entriesTabGroup = Object.entries(tabsGroupIds)
    tabs.forEach(({ url, id }) => {
        const key = entriesTabGroup.map(_ => _[0]).find(k => url.includes(k))
        if (!key) return
        tabsGroupIds[key].push(id)
    })
    Object.entries(tabsGroupIds).forEach(async tabContent => {
        const group = await chrome.tabs.group({ tabIds: tabContent[1] });
        await chrome.tabGroups.update(group, { title: tabContent[0] });
    })
}
const menuElement1 = document.querySelector('.menuElement1')

const menuElement2 = document.querySelector('.menuElement2')

const menuElement3 = document.querySelector('.menuElement3')

const menuElemen4 = document.querySelector('.menuElemen4')



menuElement1.addEventListener('click', () => move('1', '50px', '#ffcc80'))
menuElement2.addEventListener('click', () => move('2', '150px', '#81d4fa'))
menuElement3.addEventListener('click', () => move('3', '250px', '#c5e1a5'))
menuElemen4.addEventListener('click', () => move('4', '350px', '#ce93d8'))



const renderOnePage = () => {
    const wrapper = createElementNode('div')
    const button = ButtonInPopupAnim({
        text: 'Копировать/Вставить',
        onClick: showModalPasteInterface
    })
    wrapper.appendChild(button)
    return wrapper
}
const renderTwoPage = () => {
    const wrapper = createElementNode('div')
    const button = ButtonInPopupAnim({
        text: 'Разделить по группам',
        onClick: divideByGroups
    })
    wrapper.appendChild(button)
    return wrapper
}
const renderThreePage = () => {
    const wrapper = createElementNode('div')
    const content = SwagerInData()
    wrapper.appendChild(content)

    return wrapper
}

const renderBlock = () => {
    const objPage: PageNavigatorType = {
        '1': renderOnePage,
        '2': renderTwoPage,
        '3': renderThreePage,
        '4': renderOnePage,
    }
    const placeContent = document.querySelector('.bodyContent')
    placeContent.innerHTML = ''
    placeContent.appendChild(objPage[selectPage.value]())
}
renderBlock()



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