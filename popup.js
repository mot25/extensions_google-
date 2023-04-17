// получаем информацию о текущей вкладке
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // получаем ID текущей вкладки
    var tabId = tabs[0].id;
    // получаем информацию о текущей вкладке
    chrome.tabs.get(tabId, function (tab) {
        // выводим URL текущей вкладки в консоль
        console.log(tab.url);
        tab.url && getUrlToParms(tab.url);
        fetchEntities()
    });
});

function getUrlToParms(url) {
    const strParams = url?.split('?').slice(1) || ''
    const params = strParams.toString()?.split('&')
    const dataParams = []
    params.forEach(function (item) {
        const keyAndValue = item.split('=')
        dataParams.push({
            key: keyAndValue[0],
            value: keyAndValue[1],
        })
    })
    return dataParams
}

const fetchEntities = async () => {
    const response = await fetch('https://lukoil-test.io.neolant.su/api/structure/entities?only=true', {
        headers: {
            "Access-Control-Allow-Origin": 'no-cors'
        }

    })
        .then(_ => _.json())
    console.log("🚀 ~ response:", response)

}

setInterval(fetchEntities, 3000)