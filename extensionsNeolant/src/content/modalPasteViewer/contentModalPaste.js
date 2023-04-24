/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/content/modalPasteViewer/contentModalPaste.scss":
/*!*************************************************************!*\
  !*** ./src/content/modalPasteViewer/contentModalPaste.scss ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"modalWrapper":"modalWrapperex","modalWrapper__active":"modalWrapper__activeex","top":"topex","modal":"modalex","wrapperModal":"wrapperModalex","navbar__item":"navbar__itemex","navbar__item__active":"navbar__item__activeex","navbar":"navbarex","navbar__link":"navbar__linkex","navbar__menu":"navbar__menuex","gooeyEffect-1":"gooeyEffect-1ex","gooeyEffect-2":"gooeyEffect-2ex","gooeyEffect-3":"gooeyEffect-3ex","gooeyEffect-4":"gooeyEffect-4ex","gooeyEffect-5":"gooeyEffect-5ex","gooeyEffect-6":"gooeyEffect-6ex","gooeyEffect-7":"gooeyEffect-7ex","gooeyEffect-8":"gooeyEffect-8ex","gooeyEffect-9":"gooeyEffect-9ex","gooeyEffect-10":"gooeyEffect-10ex","gooeyEffect-11":"gooeyEffect-11ex"});

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
/*!***********************************************************!*\
  !*** ./src/content/modalPasteViewer/contentModalPaste.ts ***!
  \***********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contentModalPaste.scss */ "./src/content/modalPasteViewer/contentModalPaste.scss");

var documentBody = document.body;
var currentPage = '1';
var clearBeforeNode = function () {
    var nodes = document.querySelectorAll('.exNeolant');
    nodes.forEach(function (element) {
        element.remove();
    });
};
clearBeforeNode();
var leftMenuConfig = [
    {
        id: '1',
        label: '131',
        title: '111'
    },
    {
        id: '2',
        label: '22',
        title: '222'
    },
    {
        id: '3',
        label: '33',
        title: '333'
    },
];
var modalWrapepr = document.createElement('div');
modalWrapepr.classList.add('modalWrapperex');
modalWrapepr.classList.add('exNeolant');
var modal = document.createElement('div');
modal.classList.add('modalex');
var wrapper = document.createElement('div');
wrapper.classList.add('wrapperModalex');
var wrapperLeft = document.createElement('div');
wrapperLeft.classList.add('wrapperLeftex');
var wrapperLeftNavbar = document.createElement('nav');
wrapperLeftNavbar.classList.add('navbarex');
var navbarUl = document.createElement('ul');
navbarUl.classList.add('navbar__menuex');
leftMenuConfig.forEach(function (item, i) {
    var categoryItem = document.createElement('l3i');
    categoryItem.classList.add('navbar__itemex');
    categoryItem.setAttribute('idPage', i.toString());
    i === 1 && categoryItem.classList.add('navbar__item__activeex');
    var categoryItemLink = document.createElement('div');
    categoryItemLink.classList.add('navbar__linkex');
    categoryItemLink.innerText = item.title;
    categoryItem.append(categoryItemLink);
    var label = document.createElement('span');
    label.innerText = item.label;
    categoryItemLink.append(label);
    navbarUl.append(categoryItem);
});
wrapperLeft.append(navbarUl);
var wrapperRight = document.createElement('div');
wrapperRight.classList.add('wrapperRightex');
wrapper.append(wrapperLeft);
wrapper.append(wrapperRight);
var top = document.createElement('div');
top.classList.add('topex');
top.onclick = function () {
    modalWrapepr.classList.toggle('modalWrapper__activeex');
    setTimeout(function () { clearBeforeNode(); }, 1000);
};
top.innerHTML = '<span>close</span>';
modal.append(top);
modal.append(wrapper);
modalWrapepr.append(modal);
documentBody.append(modalWrapepr);
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.actions === 'isShowModal') {
        if (request.payload && modalWrapepr.classList.contains('modalWrapper__activeex')) {
            modalWrapepr.classList.add('modalWrapper__activeex');
        }
        else {
            modalWrapepr.classList.remove('modalWrapper__activeex');
        }
    }
});

})();

/******/ })()
;
//# sourceMappingURL=contentModalPaste.js.map