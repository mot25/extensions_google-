import { EntitiesService } from '../services/Entities.service';
import { entitiesForPasteInsert, getParamFromUrl } from '../utils/utils';







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

    }

);
