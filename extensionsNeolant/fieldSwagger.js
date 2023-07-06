/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************************!*\
  !*** ./src/content/fieldSwagger/fieldSwagger.ts ***!
  \**************************************************/
var getFielsObjectId = document.querySelectorAll('[placeholder="ObjectId"]');
var getFielsToken = document.querySelectorAll('[placeholder="Token"]');
var getFielsUrl = document.querySelectorAll('[placeholder="Url"]');
var blocks = document.querySelectorAll('span').forEach(function (_, i) {
    // @ts-ignore
    if (_.childNodes[0].classList[0] === 'opblock') {
        console.dir(_);
        //  _.click()
    }
});
// @ts-ignore
blocks.forEach(function (_) { return _.click(); });
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'dataForInpur') {
        var data_1 = request.payload;
        getFielsObjectId.forEach(function (_) {
            var el = _;
            if (!el.value)
                el.value = data_1.ObjectId;
        });
        getFielsToken.forEach(function (_) {
            var el = _;
            if (!el.value)
                el.value = data_1.Token;
        });
        getFielsUrl.forEach(function (_) {
            var el = _;
            if (!el.value)
                el.value = data_1.Url;
        });
    }
});

/******/ })()
;
//# sourceMappingURL=fieldSwagger.js.map