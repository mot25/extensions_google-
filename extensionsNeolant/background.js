/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shared/utils/utils.ts":
/*!***********************************!*\
  !*** ./src/shared/utils/utils.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   entitiesForPasteInsert: () => (/* binding */ entitiesForPasteInsert),
/* harmony export */   getParamFromUrl: () => (/* binding */ getParamFromUrl),
/* harmony export */   getUrlParameter: () => (/* binding */ getUrlParameter)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var getParamFromUrl = function (url) {
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
var entitiesForPasteInsert = function (entities, idEntities) {
    var currentEntities = entities.find(function (item) { return (item === null || item === void 0 ? void 0 : item.Id) === idEntities; });
    var arrNested = [];
    var findNested = function (entiti) {
        var chieldNesrtedEntiti = entities.filter(function (item) { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.Parent) === null || _a === void 0 ? void 0 : _a.Id) === (entiti === null || entiti === void 0 ? void 0 : entiti.Id); });
        arrNested.push(__assign(__assign({}, entiti), { isCurrent: (entiti === null || entiti === void 0 ? void 0 : entiti.Id) === idEntities }));
        chieldNesrtedEntiti.length && chieldNesrtedEntiti.forEach(function (item) { return findNested(item); });
    };
    findNested(currentEntities);
    return arrNested;
};
function getUrlParameter(location, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
}


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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
/*!*********************************************!*\
  !*** ./src/backgroundScripts/background.ts ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@/services/Entities.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/shared/utils/utils */ "./src/shared/utils/utils.ts");
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


var arrUrlHeaders = [];
chrome.webRequest.onHeadersReceived.addListener(function (details) {
    if (details.url.includes('navigate')) {
        arrUrlHeaders.push({
            url: details.url,
            objUrl: new URL(details.url),
            responseHeaders: details.responseHeaders || []
        });
    }
}, {
    urls: ["<all_urls>"],
}, ["responseHeaders"]);
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    return __awaiter(this, void 0, void 0, function () {
        var responseHeaders;
        return __generator(this, function (_a) {
            if (request.action === 'getEntities') {
                chrome.cookies.getAll({ url: sender.tab.url }, function (cookies) {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, idEntites;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Object(function webpackMissingModule() { var e = new Error("Cannot find module '@/services/Entities.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).getEntities(request.payload)];
                                case 1:
                                    response = _a.sent();
                                    try {
                                        idEntites = (0,_shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.getParamFromUrl)(sender.tab.url).id;
                                        chrome.tabs.sendMessage(sender.tab.id, {
                                            action: 'postEntitiesForPasteInsert',
                                            payload: Array.from(new Set((0,_shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.entitiesForPasteInsert)(response, idEntites)))
                                        });
                                    }
                                    catch (error) {
                                        console.log("🚀 ~ file: background.ts:60 ~ error:", error);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            }
            if (request.action === 'getUrlDevServer') {
                console.log('arrUrlHeaders', arrUrlHeaders);
                console.log('one', new Date().getMinutes());
                responseHeaders = [];
                arrUrlHeaders.forEach(function (element) {
                    console.log('two', new Date().getMinutes());
                    // console.log(getUrlParameter(element.objUrl.search, 'objectId'), 'id')
                    console.log('request', request.payload);
                    console.log("🚀 ~ file: background.ts:59 ~ request:", request);
                    console.log('headers ', (0,_shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.getUrlParameter)(element.objUrl.search, 'objectId'));
                    if (request.payload === (0,_shared_utils_utils__WEBPACK_IMPORTED_MODULE_1__.getUrlParameter)(element.objUrl.search, 'objectId')) {
                        console.log(555, element.responseHeaders);
                        var urlFromServer = element.responseHeaders.find(function (_) { return _.name === "Location"; }).value;
                        var devUrl = urlFromServer.replace("https://localhost:5001", "http://localhost:3000");
                        chrome.tabs.sendMessage(sender.tab.id, {
                            action: 'postUrlDevServer',
                            payload: devUrl
                        });
                    }
                });
                // chrome.tabs.sendMessage(sender.tab.id, {
                //     action: 'postUrlDevServer',
                //     payload:
                // });
                // chrome.tabs.sendMessage(sender.tab.id, {
                //     action: 'postEntitiesForPasteInsert',
                //     payload: Array.from(new Set(entitiesForPasteInsert(response, idEntites)))
                // });
            }
            return [2 /*return*/];
        });
    });
});

})();

/******/ })()
;
//# sourceMappingURL=background.js.map