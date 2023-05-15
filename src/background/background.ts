import { EntitiesService } from "../services/Entities.service";
import { EntitiesType } from "../type/entities.dto";
import { entitiesForPasteInsert, getParamFromUrl } from "../utils/utils";
import { LRUCache } from "lru-cache";







chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        if (request.action === 'getEntities') {
            chrome.cookies.getAll({ url: sender.tab.url }, async function (cookies) {
                const response = await EntitiesService.getEntities(request.payload)
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
