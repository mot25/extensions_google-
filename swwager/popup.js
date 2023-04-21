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
        const cellPaste = document.createElement('td')
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
    const currentView = viewers.find(item => item.Id === id)
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