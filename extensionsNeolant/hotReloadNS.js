/******/ (() => {
  // webpackBootstrap
  /******/ 'use strict';
  /******/ const __webpack_modules__ = {
    /***/ './src/shared/utils/utils.ts':
      /*!***********************************!*\
  !*** ./src/shared/utils/utils.ts ***!
  \***********************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ entitiesForPasteInsert: () =>
            /* binding */ entitiesForPasteInsert,
          /* harmony export */ getParamFromUrl: () =>
            /* binding */ getParamFromUrl,
          /* harmony export */ getUrlParameter: () =>
            /* binding */ getUrlParameter,
          /* harmony export */ joinParamArrayApi: () =>
            /* binding */ joinParamArrayApi
          /* harmony export */
        });
        var __assign =
          (undefined && undefined.__assign) ||
          function () {
            __assign =
              Object.assign ||
              function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                  s = arguments[i];
                  for (const p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
              };
            return __assign.apply(this, arguments);
          };
        var getParamFromUrl = function (url) {
          // Разбиваем строку запроса на отдельные параметры
          const params = new URLSearchParams(url);
          // Создаем пустой объект для хранения параметров
          const paramsObj = {};
          // Проходимся по всем параметрам и добавляем их в объект
          params.forEach(function (value, key) {
            const keyArr =
              key === null || key === void 0 ? void 0 : key.split('?');
            const keyValue = keyArr.length > 1 ? keyArr[1] : keyArr[0];
            paramsObj[keyValue] = value;
          });
          return paramsObj;
        };
        var entitiesForPasteInsert = function (entities, idEntities) {
          const currentEntities = entities.find(function (item) {
            return (
              (item === null || item === void 0 ? void 0 : item.Id) ===
              idEntities
            );
          });
          const arrNested = [];
          const findNested = function (entity) {
            const childNestedEntity = entities.filter(function (item) {
              let _a;
              return (
                ((_a =
                  item === null || item === void 0 ? void 0 : item.Parent) ===
                  null || _a === void 0
                  ? void 0
                  : _a.Id) ===
                (entity === null || entity === void 0 ? void 0 : entity.Id)
              );
            });
            arrNested.push(
              __assign(__assign({}, entity), {
                isCurrent:
                  (entity === null || entity === void 0
                    ? void 0
                    : entity.Id) === idEntities
              })
            );
            childNestedEntity.length &&
              childNestedEntity.forEach(function (item) {
                return findNested(item);
              });
          };
          findNested(currentEntities);
          return arrNested;
        };
        function getUrlParameter(location, name) {
          name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
          const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
          const results = regex.exec(location);
          return results === null
            ? ''
            : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }
        var joinParamArrayApi = function (params, nameParam) {
          return params.length === 1
            ? ''.concat(nameParam, '=').concat(params[0])
            : params.reduce(function (acc, currentIdAttr, indexAttr) {
                if (indexAttr === 0) {
                  return ''.concat(nameParam, '=').concat(currentIdAttr);
                }
                return (acc =
                  acc + '&'.concat(nameParam, '=').concat(currentIdAttr));
              }, '');
        };

        /***/
      }

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ const __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ const cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ const module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {}
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/define property getters */
  /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (const key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = exports => {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  const __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    /*!*******************************************!*\
  !*** ./src/contentScripts/hotReloadNS.ts ***!
  \*******************************************/
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ const _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__ =
      __webpack_require__(
        /*! ../shared/utils/utils */ './src/shared/utils/utils.ts'
      );

    const iFrames = document.querySelector('iframe.objects-fill-content');
    const oldSrc = iFrames.getAttribute('src');
    const getDevServerUrl = function () {
      chrome.runtime.sendMessage({
        action: 'getUrlDevServer',
        payload: (0,
        _shared_utils_utils__WEBPACK_IMPORTED_MODULE_0__.getUrlParameter)(
          new URL(window.location.href).search,
          'id'
        )
      });
      console.log('sent from page');
    };
    getDevServerUrl();
    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        if (request.action === 'postUrlDevServer') {
          iFrames.setAttribute('src', request.payload);
        }
      }
    );
    console.log(
      '🚀 ~ file: hotReloadNS.ts:3 ~ oldSrc:',
      window.location.search
    );
    console.log(222);
  })();

  /******/
})();
//# sourceMappingURL=hotReloadNS.js.map
