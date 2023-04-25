import { EntitiesType } from "../type/entities.dto";
import { getParamFromUrl } from "../utils/utils";

async function start() {

    chrome.tabs.onActivated.addListener((tab) => {
        // chrome.tabs.get(tab.tabId, async (currentTab) => {
        //     await chrome.scripting.executeScript({
        //         target: { tabId: currentTab.id },
        //         files: ['contentModalPaste.js']
        //     })
        // })


        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            // console.log("🚀 ~ tabs:", tabs)



        });

    })


    // chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    //     // console.log("🚀 ~ sender:", sender)
    //     // console.log("🚀 ~ msg:", msg)
    //     sendResponse('hi1')
    // })


}
start()

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        console.log("🚀 ~ file: background.ts:96 ~ sender:", sender)
        console.log("🚀 ~ file: background.ts:96 ~ request:", request)
        if (request.action === 'getEntities') {
            chrome.cookies.getAll({ url: sender.tab.url }, async function (cookies) {
                try {
                    const cookiesStr = cookies?.map(item => `${item.name}=${item.value}`).toString()
                    const idEntites = getParamFromUrl(sender.tab.url).id
                    const allEntites: EntitiesType[] = await fetch('https://pdm-kueg.io.neolant.su/api/structure/entities', {
                        headers: {
                            cookie: cookiesStr
                        }
                    })
                        .then(e => e.json())
                    const entitiesForPasteInsert = (entities: EntitiesType[], idEntities: string) => {
                        const currentEntities = entities.find(item => item.Id === idEntities)
                        const arrNested: EntitiesType[] = []
                        const findNested = (entiti: EntitiesType) => {
                            const chieldNesrtedEntiti = entities.filter(item => item?.Parent?.Id === entiti?.Id)
                            arrNested.push({
                                ...entiti,
                                isCurrent: entiti.Id === idEntities
                            })
                            chieldNesrtedEntiti.length && chieldNesrtedEntiti.forEach(item => findNested(item));
                        }
                        findNested(currentEntities)
                        return arrNested
                    }
                    const response = await chrome.tabs.sendMessage(sender.tab.id, {
                        action: 'postEntitiesForPasteInsert',
                        payload: entitiesForPasteInsert(allEntites, idEntites)
                    });
                } catch (error) {
                    console.log("🚀 ~ file: background.ts:60 ~ error:", error)
                }

            })
        }

    }
    //   const response = await chrome.tabs.sendMessage(sender.tab.id, {
    //     actions: '555',
    //     payload: true
    // });

);