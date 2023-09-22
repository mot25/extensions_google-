import { api } from '@/shared/config/Api';
import { RenderWarningTextInPopup } from '@/shared/utils/components';

export const showModalPasteInterface = () => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      const currentTabId = tabs[0].id;
      const allowBaseUrl = (await chrome.storage.sync
        .get(['allowBaseUrl'])
        .then(result => {
          return result.allowBaseUrl;
        })) as string[];

      const url = new URL(tabs[0].url);

      if (!allowBaseUrl?.some(_ => tabs[0]?.url?.includes(_)))
        return new RenderWarningTextInPopup(
          'Расширение открыто вне портала'
        ).render();
      if (url.pathname !== '/structure/entities')
        return new RenderWarningTextInPopup(
          'Не открыт раздел с классами'
        ).render();
      if (!url.searchParams.get('id'))
        return new RenderWarningTextInPopup('Не выбран класс').render();
      api.defaults.baseURL = url.origin;

      await chrome.scripting.executeScript({
        target: { tabId: currentTabId },
        files: ['contentIndex.js']
      });
      await chrome.scripting.insertCSS({
        files: ['contentIndex.css'],
        target: { tabId: currentTabId }
      });
      await chrome.tabs.sendMessage(currentTabId, {
        actions: 'isShowModal',
        payload: true
      });
    }
  );
};
