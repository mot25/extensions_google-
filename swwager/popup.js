// chrome.runtime.sendMessage('viewers', response => {
//     console.log(JSON.parse(response), 'response msg');
// })
const tbody = document.querySelector('.tbody')
const tbodyStorage = document.querySelector('.tbodyStorage')
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const viewers = request.message.payload
    for (const item of viewers) {
        const row = document.createElement('tr')
        const cellName = document.createElement('td')
        cellName.innerText = item.Caption
        const cellPlus = document.createElement('td')
        cellPlus.innerText = '+'
        cellPlus.setAttribute('id', item.Id)
        cellPlus.onclick = (e) => {
            // console.log(e.target.getAttribute('id'));
            const id = e.target.getAttribute('id')
            addIdViewersStorage(id, viewers)
        }
        row.append(cellName)
        row.append(cellPlus)
        tbody.append(row)
    }
});
const addNestedTable = (viewers, resetTable) => {
    if (resetTable) tbodyStorage.innerHTML = ''
    for (const currentView of viewers) {
        const row = document.createElement('tr')
        const cellName = document.createElement('td')
        cellName.innerText = currentView.Caption
        const cellMinus = document.createElement('td')
        cellMinus.innerText = '-'
        cellMinus.onclick = () => {
            deleteView(currentView.Id)
        }
        const cellPaste = document.createElement('td')
        cellPaste.onclick = () => {
            insertInEntities(currentView)
        }
        cellPaste.innerText = 'Вставить'
        row.append(cellName)
        row.append(cellMinus)
        row.append(cellPaste)
        tbodyStorage.append(row)
    }
}
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        const viewers = newValue && JSON.parse(newValue)
        addNestedTable(viewers, true)
    }
});
const addIdViewersStorage = async (id, viewers) => {
    const currentView = viewers?.find(item => item.Id === id)
    chrome.storage.local.get(["viewersState"], function (result) {
        const allView = result.viewersState && JSON.parse(result.viewersState)
        const saveViewersStorage = Array.isArray(allView) ? allView : []
        saveViewersStorage.push(currentView)
        console.log("🚀 ~ saveViewersStorage:", saveViewersStorage)

        chrome.storage.local.set({
            viewersState: JSON.stringify(saveViewersStorage)
        }, function () {
            console.log("Данные сохранены");
        });
    });
}
const renderSaveViewers = async () => {
    chrome.storage.local.get(["viewersState"], function (result) {
        console.log("🚀 ~ result:", result.viewersState)
        const viewers = result.viewersState && JSON.parse(result.viewersState)
        viewers && addNestedTable(viewers)
    });
}
renderSaveViewers()

const insertInEntities = async (currentView) => {
    console.log("🚀 ~ currentView:", currentView)
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        const idEntites = getParamFromUrl(tabs[0].url).id
        console.log("🚀 ~ idEntites:", idEntites)


        /**
         * {
            "Caption": "Согласование ЗС позиции",
            "Icon": "icon-document",
            "Attributes": [],
            "Settings": {
                "SendParams": true,
                "Url": "https://localhost:5003/approvalPositionStaff"
            },
            "Id": "f8975841-19b7-4530-8f16-c4838edfdd2e",
            "Name": "VIEWER_EXTERNAL"
        }
         */
        try {
            const responseCreate = await fetch(`https://pdm-kueg.io.neolant.su/api/structure/entities/${idEntites}/viewers`, {
                method: "POST",
                body: JSON.stringify({
                    "Name": "VIEWER_EXTERNAL",
                    "Caption": currentView.Caption,
                    "Icon": currentView.Icon,
                    "Attributes": currentView.Attributes,
                    "Settings": {}
                }),
                headers: {
                    "Accept": "application/json, text/plain, /",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Connection": "keep-alive",
                    "Content-Length": "103",
                    "Content-Type": "application/json;charset=UTF-8",
                    "Host": "pdm-kueg.io.neolant.su",
                    "Origin": "https://pdm-kueg.io.neolant.su",
                    "Referer": "https://pdm-kueg.io.neolant.su/structure/entities?id=049100cb-3fbc-ed11-8daf-85953743f5cc&mode=1&viewer=",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
                    "X-Requested-With": "XMLHttpRequest",
                    "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\""
                }
            }).then(_ => _.json())
            console.log(responseCreate)
            if (!responseCreate.Id) return
            const idNewView = responseCreate.Id
            await fetch(`https://pdm-kueg.io.neolant.su/api/structure/entities/${idEntites}/viewers`, {
                method: "PUT",
                body: JSON.stringify({
                    "Id": idNewView,
                    "Name": "VIEWER_EXTERNAL",
                    "Caption": currentView.Caption,
                    "Icon": currentView.Icon,
                    "Settings": {
                        "SendParams": true,
                        "Url": currentView.Settings.Url
                    }
                }),
                headers: {
                    "Accept": "application/json, text/plain, /",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Connection": "keep-alive",
                    "Content-Length": "103",
                    "Content-Type": "application/json;charset=UTF-8",
                    "Host": "pdm-kueg.io.neolant.su",
                    "Origin": "https://pdm-kueg.io.neolant.su",
                    "Referer": "https://pdm-kueg.io.neolant.su/structure/entities?id=049100cb-3fbc-ed11-8daf-85953743f5cc&mode=1&viewer=",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
                    "X-Requested-With": "XMLHttpRequest",
                    "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\""
                }
            })
        } catch (error) {
            console.log("🚀 ~ error:", error)
        }
    })

}

const deleteView = (id) => {
    chrome.storage.local.get(["viewersState"], function (result) {
        const allView = result.viewersState && JSON.parse(result.viewersState)
        const saveViewersStorage = allView.filter(item => item.Id !== id)

        chrome.storage.local.set({
            viewersState: JSON.stringify(saveViewersStorage)
        }, function () {
            console.log("Данные сохранены");
        });
    });
}

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