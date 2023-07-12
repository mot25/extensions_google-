import React from 'react';

import { ButtonInPopupAnim } from '../../componets/ButtonInPopupAnim';
import { api } from '../../config/Api';
import { createElementNode } from '../../utils/components';

type Props = {}
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
const PasteClass = (props: Props) => {
  const showModalPasteInterface = () => {
    console.log('1212')
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        const currentTabId = tabs[0].id;
        const allowBaseUrl = ['pdm-kueg', 'lukoil-test', 'pdm-tst-kueg', 'pdm-base', 'pdm-kueg.lukoil', 'pdm-tst-kueg.lukoil', 'pdm-base.lukoil']


        const url = new URL(tabs[0].url)

        if (!allowBaseUrl.some(_ => tabs[0].url.includes(_))) return new RenderWarningTextInPopup('Расширение открыто вне портала').render()
        if (url.pathname !== "/structure/entities") return new RenderWarningTextInPopup('Не открыт раздел с классами').render()
        if (!url.searchParams.get('id')) return new RenderWarningTextInPopup('Не выбран класс').render()
        api.defaults.baseURL = url.origin

        await chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            files: ['contentIndex.js']
        })
        await chrome.scripting.insertCSS({
            files: ["contentIndex.css"],
            target: { tabId: currentTabId },
        });
        await chrome.tabs.sendMessage(currentTabId, {
            actions: 'isShowModal',
            payload: true
        });
    });
}
  return (
    <div>
        <ButtonInPopupAnim
        onClick={showModalPasteInterface}
        text='Копировать/Вставить'
        />
    </div>
  )
}

export default PasteClass