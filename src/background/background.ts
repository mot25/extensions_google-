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
                const fetchedEntities = async () => {
                    const value = cache.get('getEntities') as string | undefined
                    value && console.log("🚀 getEntities ~ value:", JSON.parse(value).length)
                    if (value) {
                        return JSON.parse(value) as EntitiesType[]
                    }
                    const cookiesStr = cookies?.map(item => `${item.name}=${item.value}`).toString()
                    const allEntites: EntitiesType[] = await fetch('https://pdm-kueg.io.neolant.su/api/structure/entities', {
                        headers: {
                            cookie: cookiesStr
                        }
                    })
                        .then(e => e.json())

                    cache.set('getEntities', JSON.stringify(allEntites));
                    const objShow: any = {}
                    allEntites.forEach((item) => {
                        if (!item.Parent?.Id) return
                        const key = item.Parent?.Id
                        // if (item.Id !== idEntites) return
                        if (Array.isArray(objShow[key])) {
                            objShow[key].push({
                                name: item.Name,
                                id: item.Parent
                            })
                        } else {
                            objShow[key] = [{
                                name: item.Name,
                                id: item.Parent
                            }]
                        }
                    });
                    console.log("🚀 ~ file: background.ts:31 ~ objShow:", objShow)
                    return allEntites
                }

                try {
                    const idEntites = getParamFromUrl(sender.tab.url).id

                    console.log(555, await fetchedEntities())
                    const response = await chrome.tabs.sendMessage(sender.tab.id, {
                        action: 'postEntitiesForPasteInsert',
                        payload: Array.from(new Set(entitiesForPasteInsert(await fetchedEntities(), idEntites)))
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