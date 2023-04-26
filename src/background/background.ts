import { EntitiesService } from "../services/Entities.service";
import { EntitiesType } from "../type/entities.dto";
import { entitiesForPasteInsert, getParamFromUrl } from "../utils/utils";
import { LRUCache } from "lru-cache";
// import LRU from 'lru-cache';

const cache = new LRUCache({ max: 5000 });
// chrome.tabs.onActivated.addListener((tab) => {
//     // chrome.tabs.get(tab.tabId, async (currentTab) => {
//     //     await chrome.scripting.executeScript({
//     //         target: { tabId: currentTab.id },
//     //         files: ['contentModalPaste.js']
//     //     })
//     // })


//     chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
//         // console.log("🚀 ~ tabs:", tabs)



//     });

// })






chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        if (request.action === 'getEntities') {
            chrome.cookies.getAll({ url: sender.tab.url }, async function (cookies) {
                const response = await EntitiesService.getEntities()

                try {
                    const idEntites = getParamFromUrl(sender.tab.url).id
                    await chrome.tabs.sendMessage(sender.tab.id, {
                        action: 'postEntitiesForPasteInsert',
                        payload: Array.from(new Set(entitiesForPasteInsert(response, idEntites)))
                    });
                } catch (error) {
                    console.log("🚀 ~ file: background.ts:60 ~ error:", error)
                }
            })
        }

    }

);

 // const value = cache.get('getEntities') as string | undefined
        // value && console.log("🚀 getEntities ~ value:", JSON.parse(value).length)
        // if (value) {
        //     return JSON.parse(value)
        // // }
        // const response = await api.get('https://pdm-kueg.io.neolant.su/api/structure/entities')
        // cache.set('getEntities', JSON.stringify(response.data));
        // return await response.data