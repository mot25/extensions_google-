import { EntitiesService } from '@/services/Entities.service';
import { HttpHeader } from '@/type/components.dto';
import {
  entitiesForPasteInsert,
  getParamFromUrl,
  getUrlParameter
} from '@/shared/utils/utils';

type urlHeadersType = {
  url: string;
  objUrl: URL;
  responseHeaders: HttpHeader[];
};
const arrUrlHeaders: urlHeadersType[] = [];
chrome.webRequest.onHeadersReceived.addListener(
  details => {
    if (details.url.includes('navigate')) {
      arrUrlHeaders.push({
        url: details.url,
        objUrl: new URL(details.url),
        responseHeaders: details.responseHeaders || []
      });
    }
  },
  {
    urls: ['<all_urls>']
  },
  ['responseHeaders']
);

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === 'getEntities') {
    chrome.cookies.getAll({ url: sender.tab.url }, async function () {
      const response = await EntitiesService.getEntities(request.payload);
      try {
        const idEntities = getParamFromUrl(sender.tab.url).id;
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'postEntitiesForPasteInsert',
          payload: Array.from(
            new Set(entitiesForPasteInsert(response, idEntities))
          )
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  }
  if (request.action === 'getUrlDevServer') {
    arrUrlHeaders.forEach(element => {
      // console.log(getUrlParameter(element.objUrl.search, 'objectId'), 'id')

      if (
        request.payload === getUrlParameter(element.objUrl.search, 'objectId')
      ) {
        const urlFromServer = element.responseHeaders.find(
          _ => _.name === 'Location'
        ).value;
        const devUrl = urlFromServer.replace(
          'https://localhost:5001',
          'http://localhost:3000'
        );
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'postUrlDevServer',
          payload: devUrl
        });
      }
    });
  }
});
