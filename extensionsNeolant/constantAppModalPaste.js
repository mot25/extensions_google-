/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/*!*******************************************************************!*\
  !*** ./src/contentScripts/AppModalPaste/constantAppModalPaste.ts ***!
  \*******************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   APPLY_SETTINGS: () => (/* binding */ APPLY_SETTINGS),
/* harmony export */   COPY_ATTR_IN_ENTITIES: () => (/* binding */ COPY_ATTR_IN_ENTITIES),
/* harmony export */   COPY_ATTR_IN_VIEWER: () => (/* binding */ COPY_ATTR_IN_VIEWER),
/* harmony export */   COPY_VIEWER_NESTED: () => (/* binding */ COPY_VIEWER_NESTED),
/* harmony export */   HIDE_EMPTY_FIELD: () => (/* binding */ HIDE_EMPTY_FIELD),
/* harmony export */   HIDE_IN_MODEL: () => (/* binding */ HIDE_IN_MODEL),
/* harmony export */   HIDE_IN_TREE: () => (/* binding */ HIDE_IN_TREE),
/* harmony export */   ID_SELECT_ICON: () => (/* binding */ ID_SELECT_ICON),
/* harmony export */   ONLY_READ: () => (/* binding */ ONLY_READ),
/* harmony export */   REPLACE_ICON: () => (/* binding */ REPLACE_ICON),
/* harmony export */   SET_ICON: () => (/* binding */ SET_ICON),
/* harmony export */   TRANSFER_DATA_EXTERNAL_SERVICES: () => (/* binding */ TRANSFER_DATA_EXTERNAL_SERVICES),
/* harmony export */   URL_VIEWER_SETTING: () => (/* binding */ URL_VIEWER_SETTING)
/* harmony export */ });
var COPY_VIEWER_NESTED = 'copy_viewer_nested';
var SET_ICON = 'set_icon';
var REPLACE_ICON = 'replace_icon';
var APPLY_SETTINGS = '3';
var TRANSFER_DATA_EXTERNAL_SERVICES = 'SendParams';
var HIDE_IN_TREE = 'hideInStructureOfObject';
var HIDE_IN_MODEL = 'hideInViewingModel';
var HIDE_EMPTY_FIELD = 'hideEmptyFields';
var ONLY_READ = 'viewMode';
var COPY_ATTR_IN_VIEWER = 'copy_attr_in_viewer';
var COPY_ATTR_IN_ENTITIES = 'copy_attr_in_entities';
var URL_VIEWER_SETTING = 'Url';
var ID_SELECT_ICON = 'id_select_icon';

/******/ })()
;
//# sourceMappingURL=constantAppModalPaste.js.map