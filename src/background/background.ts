chrome.tabs.onActivated.addListener((tab) => {
    chrome.tabs.get(tab.tabId, async (currentTab) => {
        await chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['content2.js']
        })
    })


    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // console.log("🚀 ~ tabs:", tabs)
        chrome.cookies.getAll({ url: tabs[0].url }, async function (cookies) {

            const cookiesStr = cookies.map(item => `${item.name}=${item.value}`).toString()
            const idEntites = getParamFromUrl(tabs[0].url).id

            const allEntites = await fetch('https://pdm-kueg.io.neolant.su/api/structure/entities', {
                headers: {
                    cookie: cookiesStr
                }
            })
                .then(e => e.json())

            const currentEntites = allEntites.find(item => item.Id === idEntites)

            const currentEntitesViewers = currentEntites?.Viewers.filter(_ => _.Name === "VIEWER_EXTERNAL")
            console.log("🚀 ~ currentEntitesViewers:", currentEntitesViewers)
            if (!currentEntitesViewers) return
            chrome.runtime.sendMessage({
                message: {
                    action: 'viewers',
                    payload: currentEntitesViewers
                }
            });
        });
    });

})


// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//     // console.log("🚀 ~ sender:", sender)
//     // console.log("🚀 ~ msg:", msg)
//     sendResponse('hi1')
// })

const getParamFromUrl = (url) => {
    // Разбиваем строку запроса на отдельные параметры
    const params = new URLSearchParams(url);

    // Создаем пустой объект для хранения параметров
    const paramsObj = {};

    // Проходимся по всем параметрам и добавляем их в объект
    params.forEach((value, key) => {
        const keyArr = key?.split("?")

        const keyValue = keyArr.length > 1 ? keyArr[1] : keyArr[0]

        paramsObj[keyValue] = value;
    });

    return paramsObj
}