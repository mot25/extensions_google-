import { EntitiesService } from "@/services/Entities.service"
import { HttpHeader } from "@/type/components.dto"
import { entitiesForPasteInsert, getParamFromUrl, getUrlParameter } from "@/shared/utils/utils"

type urlHeadersType = {
    url: string
    objUrl: URL
    responseHeaders: HttpHeader[]
}
const arrUrlHeaders: urlHeadersType[] = []
chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        if (details.url.includes('navigate')) {
            arrUrlHeaders.push({
                url: details.url,
                objUrl: new URL(details.url),
                responseHeaders: details.responseHeaders || []
            })
        }
    },
    {
        urls: ["<all_urls>"],
    },
    ["responseHeaders"]
);


chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        if (request.action === 'getEntities') {
            chrome.cookies.getAll({ url: sender.tab.url }, async function (cookies) {
                const response = await EntitiesService.getEntities(request.payload)
                try {
                    const idEntites = getParamFromUrl(sender.tab.url).id
                    chrome.tabs.sendMessage(sender.tab.id, {
                        action: 'postEntitiesForPasteInsert',
                        payload: Array.from(new Set(entitiesForPasteInsert(response, idEntites)))
                    });
                } catch (error) {
                    console.log("🚀 ~ file: background.ts:60 ~ error:", error)
                }
            })
        }
        if (request.action === 'getUrlDevServer') {
            console.log('arrUrlHeaders', arrUrlHeaders)
            console.log('one', new Date().getMinutes())
            let responseHeaders = []
            arrUrlHeaders.forEach(element => {
                console.log('two', new Date().getMinutes())
                // console.log(getUrlParameter(element.objUrl.search, 'objectId'), 'id')
                console.log('request', request.payload)
                console.log("🚀 ~ file: background.ts:59 ~ request:", request)
                console.log('headers ', getUrlParameter(element.objUrl.search, 'objectId'))
                if (request.payload === getUrlParameter(element.objUrl.search, 'objectId')) {
                    console.log(555, element.responseHeaders)
                    const urlFromServer = element.responseHeaders.find(_ => _.name === "Location").value
                    const devUrl = urlFromServer.replace("https://localhost:5001", "http://localhost:3000")
                    chrome.tabs.sendMessage(sender.tab.id, {
                        action: 'postUrlDevServer',
                        payload: devUrl
                    });
                }

            });
            // chrome.tabs.sendMessage(sender.tab.id, {
            //     action: 'postUrlDevServer',
            //     payload:
            // });
            // chrome.tabs.sendMessage(sender.tab.id, {
            //     action: 'postEntitiesForPasteInsert',
            //     payload: Array.from(new Set(entitiesForPasteInsert(response, idEntites)))
            // });
        }
    }
);
