/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
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
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var getParamFromUrl;
        return __generator(this, function (_a) {
            chrome.tabs.onActivated.addListener(function (tab) {
                // chrome.tabs.get(tab.tabId, async (currentTab) => {
                //     await chrome.scripting.executeScript({
                //         target: { tabId: currentTab.id },
                //         files: ['contentModalPaste.js']
                //     })
                // })
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            // console.log("🚀 ~ tabs:", tabs)
                            chrome.cookies.getAll({ url: tabs[0].url }, function (cookies) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var cookiesStr, idEntites, allEntites, currentEntites, objShow_1, currentEntitesViewers, error_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                cookiesStr = cookies === null || cookies === void 0 ? void 0 : cookies.map(function (item) { return "".concat(item.name, "=").concat(item.value); }).toString();
                                                idEntites = getParamFromUrl(tabs[0].url).id;
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 4, , 5]);
                                                return [4 /*yield*/, fetch('https://pdm-kueg.io.neolant.su/api/structure/entities', {
                                                        headers: {
                                                            cookie: cookiesStr
                                                        }
                                                    })
                                                        .then(function (e) { return e.json(); })];
                                            case 2:
                                                allEntites = _a.sent();
                                                currentEntites = allEntites.find(function (item) { return item.Id === idEntites; });
                                                console.log("🚀 ~ file: background.ts:30 ~ allEntites:", allEntites);
                                                objShow_1 = {};
                                                allEntites.forEach(function (item) {
                                                    var _a, _b;
                                                    if (!((_a = item.Parent) === null || _a === void 0 ? void 0 : _a.Id))
                                                        return;
                                                    var key = (_b = item.Parent) === null || _b === void 0 ? void 0 : _b.Id;
                                                    // if (item.Id !== idEntites) return
                                                    if (Array.isArray(objShow_1[key])) {
                                                        objShow_1[key].push({
                                                            name: item.Name,
                                                            id: item.Parent
                                                        });
                                                    }
                                                    else {
                                                        objShow_1[key] = [{
                                                                name: item.Name,
                                                                id: item.Parent
                                                            }];
                                                    }
                                                });
                                                console.log("🚀 ~ file: background.ts:31 ~ objShow:", objShow_1);
                                                currentEntitesViewers = currentEntites === null || currentEntites === void 0 ? void 0 : currentEntites.Viewers;
                                                if (!currentEntitesViewers)
                                                    return [2 /*return*/];
                                                return [4 /*yield*/, chrome.runtime.sendMessage({
                                                        message: {
                                                            action: 'viewers',
                                                            payload: currentEntitesViewers
                                                        }
                                                    })];
                                            case 3:
                                                _a.sent();
                                                return [3 /*break*/, 5];
                                            case 4:
                                                error_1 = _a.sent();
                                                return [3 /*break*/, 5];
                                            case 5: return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                            return [2 /*return*/];
                        });
                    });
                });
            });
            getParamFromUrl = function (url) {
                // Разбиваем строку запроса на отдельные параметры
                var params = new URLSearchParams(url);
                // Создаем пустой объект для хранения параметров
                var paramsObj = {};
                // Проходимся по всем параметрам и добавляем их в объект
                params.forEach(function (value, key) {
                    var keyArr = key === null || key === void 0 ? void 0 : key.split("?");
                    var keyValue = keyArr.length > 1 ? keyArr[1] : keyArr[0];
                    paramsObj[keyValue] = value;
                });
                return paramsObj;
            };
            return [2 /*return*/];
        });
    });
}
start();


/******/ })()
;
//# sourceMappingURL=background.js.map