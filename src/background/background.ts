import { EntitiesType } from "../type/entities.dto";

async function start() {

    chrome.tabs.onActivated.addListener((tab) => {
        // chrome.tabs.get(tab.tabId, async (currentTab) => {
        //     await chrome.scripting.executeScript({
        //         target: { tabId: currentTab.id },
        //         files: ['content2.js']
        //     })
        // })


        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            // console.log("🚀 ~ tabs:", tabs)
            chrome.cookies.getAll({ url: tabs[0].url }, async function (cookies) {

                const cookiesStr = cookies?.map(item => `${item.name}=${item.value}`).toString()
                const idEntites = getParamFromUrl(tabs[0].url).id
                console.log("🚀 ~ file: background.ts:16 ~ idEntites:", idEntites)
                try {
                    const allEntites: EntitiesType[] = await fetch('https://pdm-kueg.io.neolant.su/api/structure/entities', {
                        headers: {
                            cookie: cookiesStr
                        }
                    })
                        .then(e => e.json())

                    const currentEntites = allEntites.find((item: { Id: string; }) => item.Id === idEntites)
                    console.log("🚀 ~ file: background.ts:30 ~ allEntites:", allEntites)
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

                    const currentEntitesViewers = currentEntites?.Viewers
                    if (!currentEntitesViewers) return
                    await chrome.runtime.sendMessage({
                        message: {
                            action: 'viewers',
                            payload: currentEntitesViewers
                        }
                    });
                } catch (error) {

                }
            });
        });

    })


    // chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    //     // console.log("🚀 ~ sender:", sender)
    //     // console.log("🚀 ~ msg:", msg)
    //     sendResponse('hi1')
    // })

    const getParamFromUrl = (url: string): Record<string, string> => {
        // Разбиваем строку запроса на отдельные параметры
        const params = new URLSearchParams(url);

        // Создаем пустой объект для хранения параметров
        const paramsObj: Record<string, string> = {};

        // Проходимся по всем параметрам и добавляем их в объект
        params.forEach((value, key) => {
            const keyArr = key?.split("?")

            const keyValue = keyArr.length > 1 ? keyArr[1] : keyArr[0]

            paramsObj[keyValue] = value;
        });

        return paramsObj
    }
}
start()