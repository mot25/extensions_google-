import { EntitiesType } from '../type/entities.dto';
import './popup.scss'

// chrome.runtime.sendMessage('viewers', response => {
//     console.log(JSON.parse(response), 'response msg');
// })
const tbody = document.querySelector('.tbody')
const tbodyStorage = document.querySelector('.tbodyStorage')
const isSortViewer = document.getElementById('sortIsCheck') as HTMLInputElement
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const viewers = request.message.payload as EntitiesType[]
    if (request.action !== "viewers") return
    console.log("🚀 ~ file: popup.ts:11 ~ request:", request)
    console.log("🚀 ~ file: popup.ts:11 ~ viewers:", viewers)
    const renderViewers = viewers.filter(item => item.Name)
    isSortViewer.addEventListener('click', () => {
        console.dir(isSortViewer?.checked)
        for (const item of viewers) {
            const row = document.createElement('tr')
            const cellName = document.createElement('td')
            cellName.innerText = item.Caption
            const cellPlus = document.createElement('td')
            cellPlus.innerText = '+'
            cellPlus.setAttribute('id', item.Id)
            cellPlus.onclick = (e: any) => {
                // console.log(e.target.getAttribute('id'));
                const id = e.target.getAttribute('id')
                addIdViewersStorage(id, viewers)
            }
            row.append(cellName)
            row.append(cellPlus)
            tbody.append(row)
        }
    })
});
const addNestedTable = (viewers: any, resetTable?: boolean) => {
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

            // insertInEntities(currentView)
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
const addIdViewersStorage = async (id: any, viewers: any[]) => {
    const currentView = viewers?.find((item: { Id: any; }) => item.Id === id)
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

const insertInEntities = async (currentView: { Caption: any; Icon: any; Attributes: any; Settings: any; }) => {

    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        const idEntites = getParamFromUrl(tabs[0].url).id
        try {
            const responseCreate = await fetch(`https://pdm-kueg.io.neolant.su/api/structure/entities/${idEntites}/viewers`, {
                method: "POST",
                body: JSON.stringify({
                    "Name": "VIEWER_EXTERNAL",
                    "Caption": currentView.Caption,
                    "Icon": currentView.Icon,
                    "Attributes": currentView.Attributes,
                    "Settings": currentView.Settings
                }),
                headers: {
                    "Accept": "application/json, text/plain, /",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Connection": "keep-alive",
                    "Content-Length": "103",
                    "Content-Type": "application/json;charset=UTF-8"
                }
            }).then(_ => _.json())
            console.log(responseCreate)

        } catch (error) {
            console.log("🚀 ~ error:", error)
        }
    })

}

const deleteView = (id: string) => {
    chrome.storage.local.get(["viewersState"], function (result) {
        const allView = result.viewersState && JSON.parse(result.viewersState)
        const saveViewersStorage = allView.filter((item: any) => item.Id !== id)

        chrome.storage.local.set({
            viewersState: JSON.stringify(saveViewersStorage)
        }, function () {
            console.log("Данные сохранены");
        });
    });
}

const getParamFromUrl = (url: string) => {
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