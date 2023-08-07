import { getUrlParameter } from "../shared/utils/utils"

const iFrames = document.querySelector('iframe.objects-fill-content')
const oldSrc = iFrames.getAttribute('src')
const getDevServerUrl = () => {
    chrome.runtime.sendMessage({
        action: 'getUrlDevServer',
        payload: getUrlParameter(new URL(window.location.href).search, 'id')
    })
    console.log('sent from page')
}
getDevServerUrl()

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === 'postUrlDevServer') {
            iFrames.setAttribute('src', request.payload)
        }
    }
);
console.log("🚀 ~ file: hotReloadNS.ts:3 ~ oldSrc:", window.location.search)
console.log(222)
