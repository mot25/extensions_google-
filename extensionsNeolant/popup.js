/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup/popup.scss":
/*!******************************!*\
  !*** ./src/popup/popup.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/popup/popup.ts ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _popup_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./popup.scss */ "./src/popup/popup.scss");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var ButtonPasteViewer = document.getElementById('pasteViewer');
ButtonPasteViewer.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        return __awaiter(this, void 0, void 0, function () {
            var currentTabId;
            var _this = this;
            return __generator(this, function (_a) {
                currentTabId = tabs[0].id;
                chrome.tabs.get(currentTabId, function (currentTab) { return __awaiter(_this, void 0, void 0, function () {
                    var tab, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, chrome.scripting.executeScript({
                                    target: { tabId: currentTab.id },
                                    files: ['contentModalPaste.js']
                                })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, chrome.scripting.insertCSS({
                                        files: ["contentModalPaste.css"],
                                        target: { tabId: currentTabId },
                                    })];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, chrome.tabs.query({ active: true, lastFocusedWindow: true })];
                            case 3:
                                tab = (_a.sent())[0];
                                return [4 /*yield*/, chrome.tabs.sendMessage(tab.id, {
                                        actions: 'isShowModal',
                                        payload: true
                                    })];
                            case 4:
                                response = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    });
});
// chrome.runtime.sendMessage('viewers', response => {
//     console.log(JSON.parse(response), 'response msg');
// })
// const tbody = document.querySelector('.tbody')
// const tbodyStorage = document.querySelector('.tbodyStorage')
// const isSortViewer = document.getElementById('sortIsCheck') as HTMLInputElement
// const buttonPasteJS = document.getElementById('button')
// console.log("🚀 ~ file: popup.ts:11 ~ buttonPasteJS:", buttonPasteJS)
// setInterval(() => {
//     (async () => {
//         const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
//         const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
//         // do something with response here, not outside the function
//         console.log(response);
//       })();
// }, 1000)
// buttonPasteJS.addEventListener('click', () => {
//     console.log(1231);
//     // console.log("🚀 ~ file: popup.ts:24 ~ chrome.tabs.onActivated.addListener ~ tab:", tab)
// })
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     const viewers = request.message.payload as Viewer[]
//     if (request.action !== "viewers") return
//     console.log("🚀 ~ file: popup.ts:11 ~ request:", request)
//     console.log("🚀 ~ file: popup.ts:11 ~ viewers:", viewers)
//     const renderViewers = viewers.filter(item => item.Name)
//     isSortViewer.addEventListener('click', () => {
//         console.dir(isSortViewer?.checked)
//         for (const item of viewers) {
//             const row = document.createElement('tr')
//             const cellName = document.createElement('td')
//             cellName.innerText = item.Caption
//             const cellPlus = document.createElement('td')
//             cellPlus.innerText = '+'
//             cellPlus.setAttribute('id', item.Id)
//             cellPlus.onclick = (e: any) => {
//                 // console.log(e.target.getAttribute('id'));
//                 const id = e.target.getAttribute('id')
//                 addIdViewersStorage(id, viewers)
//             }
//             row.append(cellName)
//             row.append(cellPlus)
//             tbody.append(row)
//         }
//     })
// });
// const addNestedTable = (viewers: any, resetTable?: boolean) => {
//     if (resetTable) tbodyStorage.innerHTML = ''
//     for (const currentView of viewers) {
//         const row = document.createElement('tr')
//         const cellName = document.createElement('td')
//         cellName.innerText = currentView.Caption
//         const cellMinus = document.createElement('td')
//         cellMinus.innerText = '-'
//         cellMinus.onclick = () => {
//             deleteView(currentView.Id)
//         }
//         const cellPaste = document.createElement('td')
//         cellPaste.onclick = () => {
//             // insertInEntities(currentView)
//         }
//         cellPaste.innerText = 'Вставить'
//         row.append(cellName)
//         row.append(cellMinus)
//         row.append(cellPaste)
//         tbodyStorage.append(row)
//     }
// }
// chrome.storage.onChanged.addListener((changes, namespace) => {
//     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//         const viewers = newValue && JSON.parse(newValue)
//         addNestedTable(viewers, true)
//     }
// });
// const addIdViewersStorage = async (id: any, viewers: any[]) => {
//     const currentView = viewers?.find((item: { Id: any; }) => item.Id === id)
//     chrome.storage.local.get(["viewersState"], function (result) {
//         const allView = result.viewersState && JSON.parse(result.viewersState)
//         const saveViewersStorage = Array.isArray(allView) ? allView : []
//         saveViewersStorage.push(currentView)
//         console.log("🚀 ~ saveViewersStorage:", saveViewersStorage)
//         chrome.storage.local.set({
//             viewersState: JSON.stringify(saveViewersStorage)
//         }, function () {
//             console.log("Данные сохранены");
//         });
//     });
// }
// const renderSaveViewers = async () => {
//     chrome.storage.local.get(["viewersState"], function (result) {
//         console.log("🚀 ~ result:", result.viewersState)
//         const viewers = result.viewersState && JSON.parse(result.viewersState)
//         viewers && addNestedTable(viewers)
//     });
// }
// renderSaveViewers()
// const insertInEntities = async (currentView: { Caption: any; Icon: any; Attributes: any; Settings: any; }) => {
//     chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
//         const idEntites = getParamFromUrl(tabs[0].url).id
//         try {
//             const responseCreate = await fetch(`https://pdm-kueg.io.neolant.su/api/structure/entities/${idEntites}/viewers`, {
//                 method: "POST",
//                 body: JSON.stringify({
//                     "Name": "VIEWER_EXTERNAL",
//                     "Caption": currentView.Caption,
//                     "Icon": currentView.Icon,
//                     "Attributes": currentView.Attributes,
//                     "Settings": currentView.Settings
//                 }),
//                 headers: {
//                     "Accept": "application/json, text/plain, /",
//                     "Accept-Encoding": "gzip, deflate, br",
//                     "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
//                     "Connection": "keep-alive",
//                     "Content-Length": "103",
//                     "Content-Type": "application/json;charset=UTF-8"
//                 }
//             }).then(_ => _.json())
//             console.log(responseCreate)
//         } catch (error) {
//             console.log("🚀 ~ error:", error)
//         }
//     })
// }
// const deleteView = (id: string) => {
//     chrome.storage.local.get(["viewersState"], function (result) {
//         const allView = result.viewersState && JSON.parse(result.viewersState)
//         const saveViewersStorage = allView.filter((item: any) => item.Id !== id)
//         chrome.storage.local.set({
//             viewersState: JSON.stringify(saveViewersStorage)
//         }, function () {
//             console.log("Данные сохранены");
//         });
//     });
// }
// const getParamFromUrl = (url: string) => {
//     // Разбиваем строку запроса на отдельные параметры
//     const params = new URLSearchParams(url);
//     // Создаем пустой объект для хранения параметров
//     const paramsObj: Record<string, string> = {};
//     // Проходимся по всем параметрам и добавляем их в объект
//     params.forEach((value, key) => {
//         const keyArr = key?.split("?")
//         const keyValue = keyArr.length > 1 ? keyArr[1] : keyArr[0]
//         paramsObj[keyValue] = value;
//     });
//     return paramsObj
// }

})();

/******/ })()
;
//# sourceMappingURL=popup.js.map