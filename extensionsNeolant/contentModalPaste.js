/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;
	var nativeCodeString = '[native code]';

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					classes.push(arg.toString());
					continue;
				}

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./node_modules/light-sanitize-html/src/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/light-sanitize-html/src/index.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


const allowedTags = [
    "div", "span",
    "b", "u", "i", "strong", "em", "strike", "code",
    "p", "blockquote", "nl", "caption", "pre",
    "a",
    "br",
    "hr",
    "img",
    "ul", "ol", "nav", "li",
    "h1", "h2", "h3", "h4", "h5", "h6", "menu",
    "table", "td", "tr", "thead", "tbody", "tfoot", "th"
];

// full list here:
// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
const allowedAttributes = [
    "align", "alt", "bgcolor", "border", "class", "color",
    "colspan", "dir", "headers", "height", "hidden", "href", "size",
    "hreflang", "id", "lang", "rel", "reversed", "rowspan", "shape",
    "sizes", "spellcheck", "src", "srcset", "style",
    "summary", "title", "translate", "type", "width",
    "data", "data-*"
];

function sanitize(html, options) {
    let coach = new Coach(html);
    return coach.sanitize(options);
}

class Coach {
    constructor(str) {
        this.str = str;
        this.i = 0;
    }
    
    sanitize(options) {
        options = options || {};
        // custom allowed tags or global config
        let allowedTags = options.allowedTags || sanitize.allowedTags;
        if ( !allowedTags || !allowedTags.includes ) {
            allowedTags = false;
        }
        // custom allowed attributes or global config
        let allowedAttributes = options.allowedAttributes || sanitize.allowedAttributes;
        if ( !allowedAttributes || !allowedAttributes.includes ) {
            allowedAttributes = false;
        }
        
        // walk to tags
        while ( this.i < this.str.length ) {
            if ( !this.isTag() ) {
                this.i++;
                continue;
            }
            
            // here we find tag
            let start = this.i;
            let tagName = this.readTagName();
            
            // check banned tags
            let isWhiteTag;
            if ( allowedTags === false ) {
                isWhiteTag = true;
            } else {
                isWhiteTag = allowedTags.includes(tagName);
            }
            
            // remove bad tag
            if ( !isWhiteTag ) {
                this.cutTag(start);
                continue;
            }
            
            this.stripAttributes(tagName, allowedAttributes);
            
            this.skipSpace();
            let char = this.str[ this.i ];
            if ( char == "/" ) {
                this.i++;
                this.skipSpace();
            }
            
            // if tag is invalid, then just cut him
            // because clean html code cotain only valid tags
            if ( char != ">" ) {
                this.cutTag(start);
            }
        }
        
        return this.str;
    }
    
    isTag() {
        let char = this.str[ this.i ];
        return char == "<";
    }
    
    readTagName() {
        let char = this.str[ this.i ];
        if ( char == "<" ) {
            this.i++;
        }
        this.skipSpace();
        
        char = this.str[ this.i ];
        if ( char == "/" ) {
            this.i++;
            this.skipSpace();
        }
        
        let tagName = "";
        while ( this.i < this.str.length ) {
            let char = this.str[ this.i ];
            
            if ( /\s|>|\//.test(char) ) {
                break;
            } else {
                tagName += char;
                this.i++;
            }
        }
        return tagName.toLowerCase();
    }
    
    cutTag(start) {
        while ( this.i < this.str.length ) {
            let char = this.str[ this.i ];
            if ( char == ">" ) {
                break;
            }
            this.i++;
        }
        this.cutSubstring(start, this.i + 1);
    }
    
    stripAttributes(tagName, allowedAttributes) {
        this.skipSpace();
        
        if ( !this.isAttr() ) {
            return;
        }
        
        let start = this.i;
        let attrName = this.readAttrName();
        let attrValue = null;
        
        if ( this.isAttrValue() ) {
            attrValue = this.readAttrValue();
        }
        let end = this.i;
        
        // cut bad 
        let isWhiteAttr = allowedAttributes.includes(attrName);
        let isValidAttr = isWhiteAttr;
        
        // "<BR SIZE=\"&{alert('XSS')}\">"
        // if ( tagName == "br" ) {
        //     isValidAttr = false;
        // }
        
        if ( attrName == "src" || attrName == "href" ) {
            if ( attrValue ) {
                let isValidURL = this.isValidURL( attrValue );
                if ( !isValidURL ) {
                    isValidAttr = false;
                }
            } else {
                isValidAttr = false;
            }
        }
        
        if ( !isValidAttr ) {
            this.cutSubstring(start, end);
        }
        
        this.stripAttributes(tagName, allowedAttributes);
    }
    
    isValidURL(href) {
        // base on
        // https://github.com/punkave/sanitize-html/blob/master/src/index.js
        
        
        // Browsers ignore character codes of 32 (space) and below in a surprising
        // number of situations. Start reading here:
        // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet#Embedded_tab
        
        /* eslint-disable */
        if ( /[\x00-\x20]/g.test(href) ) {
            return false;
        }
        /* eslint-enable */
        
        // Clobber any comments in URLs, which the browser might
        // interpret inside an XML data island, allowing
        // a javascript: URL to be snuck through
        if ( /<!--.*?-->/.test(href) ) {
            return false;
        }
        
        // <IMG SRC=JaVaScRiPt:alert('XSS')>
        href = href.trim();
        if ( !/^(#|http|\/)/.test(href) ) {
            return false;
        }
        
        return true;
    }
    
    readAttrValue() {
        this.skipSpace();
        let char = this.str[ this.i ];
        if ( char == "=" ) {
            this.i++; // skip =
            this.skipSpace();
        }
        
        char = this.str[ this.i ];
        let quotes = false;
        if ( char == "\"" || char == "'" || char == "`" ) {
            quotes = char;
            this.i++;
        }
        
        let value = "";
        while ( this.i < this.str.length ) {
            let char = this.str[ this.i ];
            
            if ( quotes ) {
                if ( quotes == char ) {
                    this.i++;
                    break;
                } else {
                    value += char;
                    this.i++;
                }
            } else {
                if ( /[\s>]/.test(char) ) {
                    break;
                } else {
                    value += char;
                    this.i++;
                }
            }
        }
        
        return value;
    }
    
    isAttrValue() {
        let endPart = this.str.slice(this.i);
        return /^\s*=\s*/.test(endPart);
    }
    
    skipTagName() {
        // < word >
        let startPosition = /^<\s*(\w+)[^\w]\s*/i.exec( this.str  );
        startPosition = startPosition && startPosition[0].length || 0;
        this.i = startPosition;
    }
    
    skipSpace() {
        while ( this.i < this.str.length ) {
            let char = this.str[ this.i ];
            
            if ( /\s/.test(char) ) {
                this.i++;
            } else {
                break;
            }
        }
    }
    
    readAttrName() {
        let attrName = "";
        while ( this.i < this.str.length ) {
            let char = this.str[ this.i ];
            
            if ( /\s|=|>/.test(char) ) {
                break;
            } else {
                attrName += char;
                this.i++;
            }
        }
        
        return attrName.toLowerCase();
    }
    
    isAttr() {
        let char = this.str[ this.i ];
        return (
            // if chat is null, then test return true
            // stop recursion
            char && 
            /[^</>\s]/.test(char)
        );
    }
    
    cutSubstring(start, end) {
        this.str = (
            this.str.slice(0, start) +
            this.str.slice(end)
        );
        this.i -= end - start;
    }
}

sanitize.allowedTags = allowedTags;
sanitize.allowedAttributes = allowedAttributes;

module.exports = sanitize;


/***/ }),

/***/ "./src/screens/OneScreenCopyModal/OneScreenCopyModal.module.scss":
/*!***********************************************************************!*\
  !*** ./src/screens/OneScreenCopyModal/OneScreenCopyModal.module.scss ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"name":"iZlqKEcmn70edAIq55Hz","viewer_types":"kJD6_2rqpzLuhelloiS4","delete_btn":"U0vQu8F9wQby1zZe7hr3","add_btn":"SgA3bKZRijZY71ouIA23"});

/***/ }),

/***/ "./src/screens/TwoScreenCopyModal/TwoScreenCopyModal.module.scss":
/*!***********************************************************************!*\
  !*** ./src/screens/TwoScreenCopyModal/TwoScreenCopyModal.module.scss ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"name":"LEOl7NZKac2Rdg_4PQL5","viewer_types":"zh7LeZH_DCii28KdGMsT","delete_btn":"vtih_LET3wVo9J7G7rcw","add_btn":"EcfAqNTFL8AVZQPPf8Ad","wrapperPageTwo":"tV1gpY50kQqDDwNmI6A_","wrapperViewersForPaste":"NSO5MoecOEeShrm1bfee","orderInput":"mPSZcwjM9xYdmdFJdAst"});

/***/ }),

/***/ "./src/componets/DropDown/DropDown.module.scss":
/*!*****************************************************!*\
  !*** ./src/componets/DropDown/DropDown.module.scss ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"dropbtn":"extentions__dropbtn__rCIWU","dropdown":"extentions__dropdown__WVsqX","dropdown_content":"extentions__dropdown_content__NGFn2","show":"extentions__show__TVv2G","selectItem":"extentions__selectItem__z1lVt","selectItemText":"extentions__selectItemText__fyjwf"});

/***/ }),

/***/ "./src/componets/SwitchWithText/SwitchWithText.module.scss":
/*!*****************************************************************!*\
  !*** ./src/componets/SwitchWithText/SwitchWithText.module.scss ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"wrapperButton":"extentions__wrapperButton__ksVHI","switch":"extentions__switch__rIF1O","slider":"extentions__slider__P_nG9","round":"extentions__round__gWSrN"});

/***/ }),

/***/ "./src/content/modalPasteViewer/contentModalPaste.scss":
/*!*************************************************************!*\
  !*** ./src/content/modalPasteViewer/contentModalPaste.scss ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"modalWrapper":"extentions__modalWrapper__Phq3d","modalWrapper__active":"extentions__modalWrapper__active__JXZE1","top":"extentions__top__U_FWH","modal":"extentions__modal__e7NOP","wrapperModal":"extentions__wrapperModal__W3l_a","wrapperRight":"extentions__wrapperRight__t0s1H","navbar__item":"extentions__navbar__item__f1765","navbar":"extentions__navbar__TRm53","navbar__link":"extentions__navbar__link__oMNEj","navbar__menu":"extentions__navbar__menu__pHRn6","gooeyEffect-1":"extentions__gooeyEffect-1__gmphr","gooeyEffect-2":"extentions__gooeyEffect-2__bXUVb","gooeyEffect-3":"extentions__gooeyEffect-3__F5QLJ","gooeyEffect-4":"extentions__gooeyEffect-4__oPnCW","gooeyEffect-5":"extentions__gooeyEffect-5__WxbgG","gooeyEffect-6":"extentions__gooeyEffect-6__jAvtC","gooeyEffect-7":"extentions__gooeyEffect-7__tbGtl","gooeyEffect-8":"extentions__gooeyEffect-8__kSpr5","gooeyEffect-9":"extentions__gooeyEffect-9__TZAsL","gooeyEffect-10":"extentions__gooeyEffect-10__rwvdE","gooeyEffect-11":"extentions__gooeyEffect-11__N9A1_","list":"extentions__list__LLCXb","actions":"extentions__actions__aH2ro","modalLoading":"extentions__modalLoading__MrcJb","modalLoading__show":"extentions__modalLoading__show__ZZJqv","navbar__link_img":"extentions__navbar__link_img__IrtGj"});

/***/ }),

/***/ "./src/assets/icon/IconClose.svg":
/*!***************************************!*\
  !*** ./src/assets/icon/IconClose.svg ***!
  \***************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20.82' height='20.82' viewBox='0 0 45.82 45.82'%3e %3cdefs%3e %3cstyle%3e.cls-1%7bfill:%2331556f%7d.cls-2%7bfill:%23111%7d%3c/style%3e %3c/defs%3e %3ctitle%3eClose%3c/title%3e %3cg id='Layer_2' data-name='Layer 2'%3e %3cg id='Close'%3e %3cpath class='cls-1' d='M45.09 45.09a2.52 2.52 0 0 1-3.54 0L28.91 32.45l-1.77-1.77a2.5 2.5 0 0 1 0-3.54 2.5 2.5 0 0 1 3.54 0l1.77 1.77 12.64 12.64a2.52 2.52 0 0 1 0 3.54z' /%3e %3cpath class='cls-2' d='M45.09.73a2.52 2.52 0 0 0-3.54 0L22.91 19.37 4.27.73a2.51 2.51 0 0 0-3.54 0 2.52 2.52 0 0 0 0 3.54l18.64 18.64L.73 41.55a2.5 2.5 0 0 0 3.54 3.54L45.09 4.27a2.51 2.51 0 0 0 0-3.54z' /%3e %3c/g%3e %3c/g%3e %3c/svg%3e"

/***/ }),

/***/ "./src/assets/icon/IconPaste.svg":
/*!***************************************!*\
  !*** ./src/assets/icon/IconPaste.svg ***!
  \***************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg width='64' height='64' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3cpath d='M56.34 17.27C56.2654 17.1214 56.1712 16.9835 56.06 16.86L42.13 2.94C41.8438 2.66648 41.4658 2.50958 41.07 2.5H20.92C19.6159 2.50264 18.3661 3.02185 17.444 3.94395C16.5218 4.86606 16.0026 6.11595 16 7.42V10.62H12.42C11.1159 10.6226 9.86606 11.1418 8.94395 12.064C8.02185 12.9861 7.50264 14.2359 7.5 15.54V56.54C7.50264 57.8441 8.02185 59.0939 8.94395 60.016C9.86606 60.9382 11.1159 61.4574 12.42 61.46H43.08C44.3772 61.4574 45.6211 60.9437 46.542 60.0302C47.463 59.1168 47.9868 57.8771 48 56.58V53.38H51.58C52.8841 53.3774 54.1339 52.8582 55.056 51.936C55.9782 51.0139 56.4974 49.7641 56.5 48.46V17.93C56.4993 17.7005 56.4445 17.4744 56.34 17.27V17.27ZM42.57 7.62L51.38 16.42H42.57V7.62ZM45 56.62C45 57.1292 44.7977 57.6176 44.4376 57.9776C44.0776 58.3377 43.5892 58.54 43.08 58.54H12.42C11.9108 58.54 11.4224 58.3377 11.0624 57.9776C10.7023 57.6176 10.5 57.1292 10.5 56.62V15.62C10.5 15.1108 10.7023 14.6224 11.0624 14.2624C11.4224 13.9023 11.9108 13.7 12.42 13.7H16V48.46C16.0026 49.7641 16.5218 51.0139 17.444 51.936C18.3661 52.8582 19.6159 53.3774 20.92 53.38H45V56.62ZM51.58 50.42H20.92C20.6645 50.4201 20.4115 50.3691 20.1759 50.2701C19.9403 50.1711 19.7268 50.0261 19.548 49.8436C19.3692 49.661 19.2286 49.4446 19.1345 49.207C19.0404 48.9695 18.9947 48.7155 19 48.46V7.46C18.9947 7.20452 19.0404 6.95054 19.1345 6.71296C19.2286 6.47538 19.3692 6.25897 19.548 6.07642C19.7268 5.89388 19.9403 5.74886 20.1759 5.64988C20.4115 5.5509 20.6645 5.49994 20.92 5.5H39.57V17.92C39.57 18.3178 39.728 18.6994 40.0093 18.9807C40.2906 19.262 40.6722 19.42 41.07 19.42H53.5V48.42C53.5053 48.6755 53.4596 48.9295 53.3655 49.167C53.2714 49.4046 53.1308 49.621 52.952 49.8036C52.7732 49.9861 52.5597 50.1311 52.3241 50.2301C52.0885 50.3291 51.8355 50.3801 51.58 50.38V50.42Z' fill='black' /%3e %3c/svg%3e"

/***/ }),

/***/ "./src/assets/icon/IconPlus.svg":
/*!**************************************!*\
  !*** ./src/assets/icon/IconPlus.svg ***!
  \**************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-plus-circle'%3e%3ccircle cx='12' cy='12' r='10'%3e%3c/circle%3e%3cline x1='12' y1='8' x2='12' y2='16'%3e%3c/line%3e%3cline x1='8' y1='12' x2='16' y2='12'%3e%3c/line%3e%3c/svg%3e"

/***/ }),

/***/ "./src/componets/DropDown/DropDown.ts":
/*!********************************************!*\
  !*** ./src/componets/DropDown/DropDown.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/components */ "./src/utils/components.ts");
/* harmony import */ var _DropDown_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DropDown.module.scss */ "./src/componets/DropDown/DropDown.module.scss");



var DropDown = function (_a) {
    var onChange = _a.onChange, list = _a.list, value = _a.value, title = _a.title;
    var valueState = new _utils_components__WEBPACK_IMPORTED_MODULE_1__.useState(value, function () {
        render();
    });
    var isShow = new _utils_components__WEBPACK_IMPORTED_MODULE_1__.useState(false, function () {
        render();
    });
    var showListDropDown = function () { };
    var wrapper = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)('div', [_DropDown_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].wrapperDropDown]);
    function render() {
        var _a;
        wrapper.innerHTML = '';
        var dropdown = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)("div", [_DropDown_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].dropdown]);
        var button = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)("button", [_DropDown_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].dropbtn]);
        button.onclick = function () {
            isShow.update(!isShow.value);
        };
        button.textContent = title;
        var menu = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)('div');
        menu.className = classnames__WEBPACK_IMPORTED_MODULE_0__(_DropDown_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].dropdown_content, (_a = {},
            _a[_DropDown_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].show] = isShow.value,
            _a));
        list.forEach(function (el) {
            var selected = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)('div', [_DropDown_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].selectItem]);
            var selectedText = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)('p', [_DropDown_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].selectItemText]);
            selectedText.innerText = el.label;
            selected.append(selectedText);
            selected.setAttribute('title', el.label);
            selected.onclick = function () {
                onChange(el.value);
            };
            menu.appendChild(selected);
        });
        dropdown.appendChild(button);
        dropdown.appendChild(menu);
        wrapper.appendChild(dropdown);
    }
    render();
    return wrapper;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DropDown);


/***/ }),

/***/ "./src/componets/DropDown/index.ts":
/*!*****************************************!*\
  !*** ./src/componets/DropDown/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DropDown": () => (/* reexport safe */ _DropDown__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _DropDown__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DropDown */ "./src/componets/DropDown/DropDown.ts");



/***/ }),

/***/ "./src/componets/SwitchWithText/SwitchWithText.ts":
/*!********************************************************!*\
  !*** ./src/componets/SwitchWithText/SwitchWithText.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/components */ "./src/utils/components.ts");
/* harmony import */ var _SwitchWithText_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SwitchWithText.module.scss */ "./src/componets/SwitchWithText/SwitchWithText.module.scss");



var SwitchWithText = function (_a) {
    var onChange = _a.onChange, text = _a.text, value = _a.value, isRounded = _a.isRounded;
    var valueState = new _utils_components__WEBPACK_IMPORTED_MODULE_1__.useState(!!value, function () {
        render();
    });
    var wrapper = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)('div', [_SwitchWithText_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].wrapperButton]);
    function render() {
        var _a;
        wrapper.innerHTML = '';
        var label = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)('label', [_SwitchWithText_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"]["switch"]]);
        var input = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)('input');
        input.onclick = function (e) {
            valueState.update(!valueState.value);
            onChange(valueState.value);
        };
        input.setAttribute('type', 'checkbox');
        input.checked = valueState.value;
        var span = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)('span');
        span.className = classnames__WEBPACK_IMPORTED_MODULE_0__(_SwitchWithText_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].slider, (_a = {},
            _a[_SwitchWithText_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].round] = isRounded,
            _a));
        label.append(input);
        label.append(span);
        wrapper.append(label);
        var labelText = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)('p', [_SwitchWithText_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].labelText]);
        labelText.innerText = text;
        wrapper.append(labelText);
    }
    render();
    return wrapper;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SwitchWithText);


/***/ }),

/***/ "./src/componets/SwitchWithText/index.ts":
/*!***********************************************!*\
  !*** ./src/componets/SwitchWithText/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SwitchWithText": () => (/* reexport safe */ _SwitchWithText__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _SwitchWithText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SwitchWithText */ "./src/componets/SwitchWithText/SwitchWithText.ts");



/***/ }),

/***/ "./src/config/Api/Api.ts":
/*!*******************************!*\
  !*** ./src/config/Api/Api.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");

var instance = axios__WEBPACK_IMPORTED_MODULE_0__["default"].create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});
instance.interceptors.request.use(function (config) {
    // Добавить логику перед отправкой запроса
    return config;
}, function (error) {
    // Обработка ошибок запроса
    return Promise.reject(error);
});
instance.interceptors.response.use(function (response) {
    // Обработка ответа
    return response;
}, function (error) {
    // Обработка ошибок ответа
    return Promise.reject(error);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (instance);


/***/ }),

/***/ "./src/config/Api/index.ts":
/*!*********************************!*\
  !*** ./src/config/Api/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "api": () => (/* reexport safe */ _Api__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _Api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Api */ "./src/config/Api/Api.ts");



/***/ }),

/***/ "./src/screens/OneScreenCopyModal/OneScreenCopyModal.ts":
/*!**************************************************************!*\
  !*** ./src/screens/OneScreenCopyModal/OneScreenCopyModal.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_ManagerVievers_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/ManagerVievers.service */ "./src/services/ManagerVievers.service.ts");
/* harmony import */ var _utils_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/components */ "./src/utils/components.ts");
/* harmony import */ var _OneScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OneScreenCopyModal.module.scss */ "./src/screens/OneScreenCopyModal/OneScreenCopyModal.module.scss");
/* harmony import */ var js_alert__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! js-alert */ "./node_modules/js-alert/src/index.js");
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




var renderPageOne = function (_a) {
    var glEntitiesFromPaste = _a.glEntitiesFromPaste, glViewerForPaste = _a.glViewerForPaste, addStateViewers = _a.addStateViewers, ulContainer = _a.ulContainer, wrapperPageOne = _a.wrapperPageOne;
    return __awaiter(void 0, void 0, void 0, function () {
        var addItem, entities;
        var _b;
        return __generator(this, function (_c) {
            addItem = function (viewer, idEntities, index) {
                var li = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)("li", [_OneScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].item]);
                var nameNode = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)("span", [_OneScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].name]);
                nameNode.innerText = viewer.Caption;
                li.append(nameNode);
                var addButton = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)("button", [_OneScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].delete_btn]);
                addButton.innerText = 'Удалить';
                addButton.onclick = function (e) {
                    var alert = new js_alert__WEBPACK_IMPORTED_MODULE_3__["default"]("\u0412\u044B \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C ".concat(viewer.Caption), "Выберите опции для удаления");
                    alert.addButton("Удалить в текущем классе").then(function () {
                        _services_ManagerVievers_service__WEBPACK_IMPORTED_MODULE_0__.ManagerVieversService.deleteViewer(idEntities, viewer.Id);
                        // @ts-ignore
                        e.target.style.backgroundColor = 'rgb(211, 211, 211)';
                    });
                    alert.addButton("Удалить во вложенных классах").then(function () {
                        glEntitiesFromPaste.value.forEach(function (entit) {
                            var _a;
                            var idViewerDelete = (_a = entit === null || entit === void 0 ? void 0 : entit.Viewers) === null || _a === void 0 ? void 0 : _a.find(function (V) { return (V === null || V === void 0 ? void 0 : V.Caption) === (viewer === null || viewer === void 0 ? void 0 : viewer.Caption); });
                            (idViewerDelete === null || idViewerDelete === void 0 ? void 0 : idViewerDelete.Id) !== undefined && _services_ManagerVievers_service__WEBPACK_IMPORTED_MODULE_0__.ManagerVieversService.deleteViewer(entit.Id, idViewerDelete === null || idViewerDelete === void 0 ? void 0 : idViewerDelete.Id);
                        });
                        // @ts-ignore
                        e.target.style.backgroundColor = 'rgb(211, 211, 211)';
                    });
                    alert.show();
                };
                li.append(addButton);
                var deleteButton = (0,_utils_components__WEBPACK_IMPORTED_MODULE_1__.createElementNode)("button", [_OneScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].add_btn]);
                deleteButton.innerText = 'Запомнить вид';
                var isHave = !!~glViewerForPaste.value.findIndex(function (_) { return _.Caption === viewer.Caption; });
                deleteButton.style.background = isHave ? '#d3d3d3' : '#4CAF50';
                if (!isHave) {
                    deleteButton.onclick = function () {
                        addStateViewers(__assign(__assign({}, viewer), { order: index + 1 }));
                    };
                }
                li.append(deleteButton);
                return li;
            };
            entities = glEntitiesFromPaste.value.find(function (_) { return _.isCurrent; });
            if (!entities)
                return [2 /*return*/, ''];
            ulContainer.innerHTML = '';
            ulContainer.append.apply(ulContainer, (_b = entities === null || entities === void 0 ? void 0 : entities.Viewers) === null || _b === void 0 ? void 0 : _b.map(function (el, i) { return addItem(el, entities.Id, i); }));
            wrapperPageOne.append(ulContainer);
            return [2 /*return*/, wrapperPageOne];
        });
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderPageOne);


/***/ }),

/***/ "./src/screens/TwoScreenCopyModal/TwoScreenCopyModal.ts":
/*!**************************************************************!*\
  !*** ./src/screens/TwoScreenCopyModal/TwoScreenCopyModal.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _componets_DropDown__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../componets/DropDown */ "./src/componets/DropDown/index.ts");
/* harmony import */ var _componets_SwitchWithText__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../componets/SwitchWithText */ "./src/componets/SwitchWithText/index.ts");
/* harmony import */ var _utils_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/components */ "./src/utils/components.ts");
/* harmony import */ var _TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TwoScreenCopyModal.module.scss */ "./src/screens/TwoScreenCopyModal/TwoScreenCopyModal.module.scss");
/* harmony import */ var js_alert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! js-alert */ "./node_modules/js-alert/src/index.js");
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





var renderPageTwo = function (_a) {
    var changeSelectedToggleiewer = _a.changeSelectedToggleiewer, changeOrderViewerInEntities = _a.changeOrderViewerInEntities, glViewerForPaste = _a.glViewerForPaste, deleteView = _a.deleteView, glIcons = _a.glIcons, modalWrapepr = _a.modalWrapepr, pasteViewers = _a.pasteViewers;
    return __awaiter(void 0, void 0, void 0, function () {
        function renderDropDown() {
            var _a;
            wrapperDropDownIcon.innerHTML = '';
            wrapperDropDownIcon.append((0,_componets_DropDown__WEBPACK_IMPORTED_MODULE_0__.DropDown)({
                title: 'Выберите иконку',
                list: glIcons.value.map(function (icon) { return ({ label: icon.Name, value: icon.Id }); }),
                onChange: function (idIcon) { return glValueIcons.update(idIcon); },
            }));
            var wrapperTitleDropDown = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('div', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].wrapperSelectTitleIcon]);
            var title = (_a = glIcons.value.find(function (ic) { return ic.Id === glValueIcons.value; })) === null || _a === void 0 ? void 0 : _a.Name;
            wrapperTitleDropDown.innerHTML = title ? "\n      <span>\u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438 \u0438\u043A\u043E\u043D\u043A\u0443:</span> ".concat(title, "\n      ") : '';
            wrapperDropDownIcon.append(wrapperTitleDropDown);
        }
        function renderSettinWithView() {
            wrapperSettinWithView.innerHTML = '';
            var rowSwitch = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('div', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].rowSwitchSetting]);
            settingForPaste.value.forEach(function (switchEl) {
                var listSwitchs = (0,_componets_SwitchWithText__WEBPACK_IMPORTED_MODULE_1__.SwitchWithText)({
                    onChange: function (check) {
                        changeValueSettingForPaste(switchEl.id, check);
                    },
                    text: switchEl.text,
                    value: switchEl.value,
                    isRounded: true,
                });
                rowSwitch.append(listSwitchs);
            });
            wrapperSettinWithView.append(rowSwitch);
        }
        function renderInput() {
            inputSettingUrlWrapper.innerHTML = '';
            var inputSettingUrl = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('input', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].inputSettingUrl]);
            inputSettingUrl.setAttribute('placeholder', 'URL контента');
            inputSettingUrl.setAttribute('type', 'text');
            inputSettingUrl.setAttribute('value', urlValue.value);
            inputSettingUrl.onchange = function (e) {
                var _a;
                // @ts-ignore
                urlValue.update((_a = e.target) === null || _a === void 0 ? void 0 : _a.value);
            };
            inputSettingUrlWrapper.append(inputSettingUrl);
        }
        var configPasteEntities, changeValueConfigPaste, wrapperPageTwo, wrapperViewersForPaste, renderStateViewer, renderConfigPaste, glValueIcons, wrapperDropDownIcon, settingForPaste, changeValueSettingForPaste, wrapperSettinWithView, urlValue, inputSettingUrlWrapper, button;
        return __generator(this, function (_b) {
            configPasteEntities = new _utils_components__WEBPACK_IMPORTED_MODULE_2__.useState([
                {
                    id: '2',
                    text: 'Коппировать во все вложенные',
                },
                {
                    id: '3',
                    text: 'Применить настройки',
                },
                {
                    id: '4',
                    text: 'Заменить иконку для новых классов',
                },
                {
                    id: '5',
                    text: 'Перезатирать существующию икноку при изменение',
                }
            ], function () { return renderConfigPaste; });
            changeValueConfigPaste = function (id, value) {
                configPasteEntities.update(configPasteEntities.value.map(function (_) {
                    if (_.id === id)
                        _.value = value;
                    return _;
                }));
            };
            wrapperPageTwo = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('div', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].wrapperPageTwo]);
            wrapperViewersForPaste = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('div', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].wrapperViewersForPaste]);
            renderStateViewer = function () {
                var ul = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('ul', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].viewer_types]);
                glViewerForPaste.value.forEach(function (el) {
                    var li = document.createElement("li");
                    var nameP = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('p', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].name]);
                    nameP.textContent = el.Caption;
                    var checkPaste = document.createElement('input');
                    checkPaste.setAttribute('type', 'checkbox');
                    if (el.isSelected) {
                        checkPaste.setAttribute('checked', 'true');
                    }
                    else {
                        checkPaste.removeAttribute('checked');
                    }
                    checkPaste.onclick = function () {
                        changeSelectedToggleiewer(el.Id);
                    };
                    var deleteButton = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('button', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].deleteViewer]);
                    deleteButton.innerText = 'Удалить из памяти';
                    deleteButton.onclick = function () {
                        deleteView(el.Id);
                    };
                    var orderInput = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('input', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].orderInput]);
                    orderInput.setAttribute('type', 'number');
                    orderInput.setAttribute('value', el.order.toString());
                    orderInput.setAttribute('min', "1");
                    orderInput.onchange = function (e) {
                        var _a;
                        // @ts-ignore
                        changeOrderViewerInEntities(el.Id, (_a = e.target) === null || _a === void 0 ? void 0 : _a.value);
                    };
                    li.appendChild(nameP);
                    li.append(checkPaste);
                    li.append(orderInput);
                    li.append(deleteButton);
                    ul.appendChild(li);
                });
                return ul;
            };
            wrapperViewersForPaste.append(renderStateViewer());
            renderConfigPaste = function () {
                var wrapperList = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('div', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].wrapperListConfig]);
                wrapperList.innerHTML = '';
                configPasteEntities.value.forEach(function (switchEl) {
                    var rowSwitch = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('div', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].rowSwitch]);
                    var listSwitchs = (0,_componets_SwitchWithText__WEBPACK_IMPORTED_MODULE_1__.SwitchWithText)({
                        onChange: function (check) {
                            changeValueConfigPaste(switchEl.id, check);
                        },
                        text: switchEl.text,
                        value: switchEl.value,
                        isRounded: true,
                    });
                    rowSwitch.append(listSwitchs);
                    wrapperList.append(rowSwitch);
                });
                wrapperViewersForPaste.append(wrapperList);
            };
            renderConfigPaste();
            glValueIcons = new _utils_components__WEBPACK_IMPORTED_MODULE_2__.useState('', function () {
                renderDropDown();
            });
            wrapperDropDownIcon = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('div', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].wrapperDropDownIcon]);
            renderDropDown();
            settingForPaste = new _utils_components__WEBPACK_IMPORTED_MODULE_2__.useState([
                {
                    id: 'SendParams',
                    text: 'Передавать данные внешнему сервису',
                },
                {
                    id: 'hideInStructureOfObject',
                    text: 'Скрывать в структуре объектов',
                },
                {
                    id: 'hideInViewingModel',
                    text: 'Скрывать в модели',
                },
                {
                    id: 'viewMode',
                    text: 'Только для чтения',
                },
                {
                    id: 'hideEmptyFields',
                    text: 'Скрывать пустые поля',
                },
            ], function () { return renderSettinWithView; });
            changeValueSettingForPaste = function (id, value) {
                settingForPaste.update(settingForPaste.value.map(function (_) {
                    if (_.id === id)
                        _.value = value;
                    return _;
                }));
            };
            wrapperSettinWithView = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('div', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].wrapperSettinWithView]);
            renderSettinWithView();
            urlValue = new _utils_components__WEBPACK_IMPORTED_MODULE_2__.useState('https://', function () {
                renderInput();
            });
            inputSettingUrlWrapper = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('div', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].inputSettingUrlWrapper]);
            renderInput();
            wrapperSettinWithView.append(inputSettingUrlWrapper);
            wrapperViewersForPaste.append(wrapperDropDownIcon);
            wrapperViewersForPaste.append(wrapperSettinWithView);
            wrapperPageTwo.appendChild(wrapperViewersForPaste);
            button = (0,_utils_components__WEBPACK_IMPORTED_MODULE_2__.createElementNode)('button', [_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].reload]);
            button.innerText = 'Коппировать';
            button.onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
                var alert;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pasteViewers({
                                glViewerForPaste: glViewerForPaste.value,
                                configPasteEntities: configPasteEntities.value,
                                glValueIcons: glValueIcons.value,
                                settingForPaste: settingForPaste.value,
                                urlValue: urlValue.value,
                            })];
                        case 1:
                            _a.sent();
                            modalWrapepr.classList.remove(_TwoScreenCopyModal_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].modalWrapper__active);
                            alert = new js_alert__WEBPACK_IMPORTED_MODULE_4__["default"]("Страница будет перезагружена", "Новые виды были вставлены");
                            alert.show();
                            return [2 /*return*/];
                    }
                });
            }); };
            wrapperPageTwo.append(button);
            return [2 /*return*/, wrapperPageTwo];
        });
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderPageTwo);


/***/ }),

/***/ "./src/services/Entities.service.ts":
/*!******************************************!*\
  !*** ./src/services/Entities.service.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EntitiesService": () => (/* binding */ EntitiesService)
/* harmony export */ });
/* harmony import */ var _config_Api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/Api */ "./src/config/Api/index.ts");
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

var EntitiesService = /** @class */ (function () {
    function EntitiesService() {
    }
    EntitiesService.getEntities = function (baseUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(baseUrl + '/api/structure/entities')
                            .then(function (_) { return _.json(); })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    EntitiesService.pasteViewerInEntities = function (id, config) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _config_Api__WEBPACK_IMPORTED_MODULE_0__.api.post("/api/structure/entities/".concat(id, "/viewers"), config)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    EntitiesService.changeViewerInEntities = function (id, config) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _config_Api__WEBPACK_IMPORTED_MODULE_0__.api.put("/api/structure/entities/".concat(id, "/viewers"), config, {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json, text/plain, */*'
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    EntitiesService.changeOrderPosition = function (id, positionOrders) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _config_Api__WEBPACK_IMPORTED_MODULE_0__.api.put("/api/structure/entities/".concat(id, "/viewers/order"), positionOrders, {
                            headers: {
                                "content-type": "application/json;charset=UTF-8",
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return EntitiesService;
}());



/***/ }),

/***/ "./src/services/Icon.service.ts":
/*!**************************************!*\
  !*** ./src/services/Icon.service.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IconService": () => (/* binding */ IconService)
/* harmony export */ });
/* harmony import */ var _config_Api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/Api */ "./src/config/Api/index.ts");
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

var IconService = /** @class */ (function () {
    function IconService() {
    }
    IconService.getIcons = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _config_Api__WEBPACK_IMPORTED_MODULE_0__.api.get('/api/icons')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return IconService;
}());



/***/ }),

/***/ "./src/services/ManagerVievers.service.ts":
/*!************************************************!*\
  !*** ./src/services/ManagerVievers.service.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ManagerVieversService": () => (/* binding */ ManagerVieversService)
/* harmony export */ });
/* harmony import */ var _config_Api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/Api */ "./src/config/Api/index.ts");
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

var ManagerVieversService = /** @class */ (function () {
    function ManagerVieversService() {
    }
    ManagerVieversService.deleteViewer = function (entitiId, viewerId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _config_Api__WEBPACK_IMPORTED_MODULE_0__.api["delete"]("/api/structure/entities/".concat(entitiId, "/viewers/").concat(viewerId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return ManagerVieversService;
}());



/***/ }),

/***/ "./src/utils/components.ts":
/*!*********************************!*\
  !*** ./src/utils/components.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createElementNode": () => (/* binding */ createElementNode),
/* harmony export */   "useState": () => (/* binding */ useState)
/* harmony export */ });
var createElementNode = function (tag, classes) {
    var node = document.createElement(tag);
    classes === null || classes === void 0 ? void 0 : classes.forEach(function (clas) {
        node.classList.add(clas);
    });
    return node;
};
var useState = /** @class */ (function () {
    function useState(value, cb) {
        this.value = value;
        this.initialValue = value;
        this.cb = cb;
    }
    useState.prototype.update = function (newValue) {
        this.value = newValue;
        this.cb && this.cb();
    };
    useState.prototype.reset = function () {
        this.value = this.initialValue;
    };
    return useState;
}());



/***/ }),

/***/ "./node_modules/axios/lib/adapters/adapters.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/adapters/adapters.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _http_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./http.js */ "./node_modules/axios/lib/helpers/null.js");
/* harmony import */ var _xhr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr.js */ "./node_modules/axios/lib/adapters/xhr.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");





const knownAdapters = {
  http: _http_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  xhr: _xhr_js__WEBPACK_IMPORTED_MODULE_1__["default"]
}

_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(knownAdapters, (fn, value) => {
  if(fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getAdapter: (adapters) => {
    adapters = _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      if((adapter = _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
        break;
      }
    }

    if (!adapter) {
      if (adapter === false) {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"](
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          'ERR_NOT_SUPPORT'
        );
      }

      throw new Error(
        _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].hasOwnProp(knownAdapters, nameOrAdapter) ?
          `Adapter '${nameOrAdapter}' is not available in the build` :
          `Unknown adapter '${nameOrAdapter}'`
      );
    }

    if (!_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isFunction(adapter)) {
      throw new TypeError('adapter is not a function');
    }

    return adapter;
  },
  adapters: knownAdapters
});


/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../core/settle.js */ "./node_modules/axios/lib/core/settle.js");
/* harmony import */ var _helpers_cookies_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./../helpers/cookies.js */ "./node_modules/axios/lib/helpers/cookies.js");
/* harmony import */ var _helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../helpers/buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");
/* harmony import */ var _core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _helpers_isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./../helpers/isURLSameOrigin.js */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
/* harmony import */ var _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../defaults/transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../helpers/parseProtocol.js */ "./node_modules/axios/lib/helpers/parseProtocol.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/browser/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_speedometer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/speedometer.js */ "./node_modules/axios/lib/helpers/speedometer.js");
















function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = (0,_helpers_speedometer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(50, 250);

  return e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  };
}

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isFormData(requestData) && (_platform_index_js__WEBPACK_IMPORTED_MODULE_3__["default"].isStandardBrowserEnv || _platform_index_js__WEBPACK_IMPORTED_MODULE_3__["default"].isStandardBrowserWebWorkerEnv)) {
      requestHeaders.setContentType(false); // Let the browser set it
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    }

    const fullPath = (0,_core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_4__["default"])(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), (0,_helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_5__["default"])(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_6__["default"])(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"]('Request aborted', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"].ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"].ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = config.transitional || _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_8__["default"];
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"](
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"].ETIMEDOUT : _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"].ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (_platform_index_js__WEBPACK_IMPORTED_MODULE_3__["default"].isStandardBrowserEnv) {
      // Add xsrf header
      const xsrfValue = (config.withCredentials || (0,_helpers_isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_9__["default"])(fullPath))
        && config.xsrfCookieName && _helpers_cookies_js__WEBPACK_IMPORTED_MODULE_10__["default"].read(config.xsrfCookieName);

      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_11__["default"](null, config, request) : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = (0,_helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_12__["default"])(fullPath);

    if (protocol && _platform_index_js__WEBPACK_IMPORTED_MODULE_3__["default"].protocols.indexOf(protocol) === -1) {
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"]('Unsupported protocol ' + protocol + ':', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"].ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");
/* harmony import */ var _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Axios.js */ "./node_modules/axios/lib/core/Axios.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./cancel/CancelToken.js */ "./node_modules/axios/lib/cancel/CancelToken.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./helpers/spread.js */ "./node_modules/axios/lib/helpers/spread.js");
/* harmony import */ var _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./helpers/isAxiosError.js */ "./node_modules/axios/lib/helpers/isAxiosError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./helpers/HttpStatusCode.js */ "./node_modules/axios/lib/helpers/HttpStatusCode.js");



















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"](defaultConfig);
  const instance = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.request, context);

  // Copy axios.prototype to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype, context, {allOwnKeys: true});

  // Copy context to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance((0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(_defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"]);

// Expose Axios class to allow class inheritance
axios.Axios = _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"];

// Expose Cancel & CancelToken
axios.CanceledError = _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__["default"];
axios.CancelToken = _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__["default"];
axios.isCancel = _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__["default"];
axios.VERSION = _env_data_js__WEBPACK_IMPORTED_MODULE_8__.VERSION;
axios.toFormData = _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__["default"];

// Expose AxiosError class
axios.AxiosError = _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__["default"];

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__["default"];

// Expose isAxiosError
axios.isAxiosError = _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__["default"];

// Expose mergeConfig
axios.mergeConfig = _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"];

axios.AxiosHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__["default"];

axios.formToJSON = thing => (0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__["default"])(_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isHTMLForm(thing) ? new FormData(thing) : thing);

axios.HttpStatusCode = _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_15__["default"];

axios.default = axios;

// this module should only have a default export
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (axios);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CancelToken);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CanceledError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CanceledError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].call(this, message == null ? 'canceled' : message, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].inherits(CanceledError, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
  __CANCEL__: true
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CanceledError);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isCancel)
/* harmony export */ });


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers/buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");
/* harmony import */ var _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InterceptorManager.js */ "./node_modules/axios/lib/core/InterceptorManager.js");
/* harmony import */ var _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dispatchRequest.js */ "./node_modules/axios/lib/core/dispatchRequest.js");
/* harmony import */ var _mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/validator.js */ "./node_modules/axios/lib/helpers/validator.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");











const validators = _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"](),
      response: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    let contextHeaders;

    // Flatten headers
    contextHeaders = headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].merge(
      headers.common,
      headers[config.method]
    );

    contextHeaders && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__["default"].concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [_dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);
    const fullPath = (0,_buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__["default"])(config.baseURL, config.url);
    return (0,_helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__["default"])(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Axios);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosError.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosError.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);

  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosError);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosHeaders.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosHeaders.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/parseHeaders.js */ "./node_modules/axios/lib/helpers/parseHeaders.js");





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(value)) return;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders((0,_helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"])(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].freezeMethods(AxiosHeaders.prototype);
_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].freezeMethods(AxiosHeaders);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosHeaders);


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InterceptorManager);


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildFullPath)
/* harmony export */ });
/* harmony import */ var _helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/isAbsoluteURL.js */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
/* harmony import */ var _helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/combineURLs.js */ "./node_modules/axios/lib/helpers/combineURLs.js");





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !(0,_helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__["default"])(requestedURL)) {
    return (0,_helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__["default"])(baseURL, requestedURL);
  }
  return requestedURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dispatchRequest)
/* harmony export */ });
/* harmony import */ var _transformData_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transformData.js */ "./node_modules/axios/lib/core/transformData.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../adapters/adapters.js */ "./node_modules/axios/lib/adapters/adapters.js");









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(config.headers);

  // Transform request data
  config.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAdapter(config.adapter || _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"].adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
      config,
      config.transformResponse,
      response
    );

    response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!(0,_cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__["default"])(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeConfig)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");





const headersToObject = (thing) => thing instanceof _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? thing.toJSON() : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(target) && _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge.call({caseless}, target, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge({}, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ settle)
/* harmony export */ });
/* harmony import */ var _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](
      'Request failed with status code ' + response.status,
      [_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_REQUEST, _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ transformData)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  const context = response || config;
  const headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(context.headers);
  let data = context.data;

  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}


/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/defaults/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _transitional_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/toURLEncodedForm.js */ "./node_modules/axios/lib/helpers/toURLEncodedForm.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/browser/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");










const DEFAULT_CONTENT_TYPE = {
  'Content-Type': undefined
};

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: _transitional_js__WEBPACK_IMPORTED_MODULE_1__["default"],

  adapter: ['xhr', 'http'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(data);

    if (isObjectPayload && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(data);

    if (isFormData) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify((0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__["default"])(data)) : data;
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStream(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFile(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(data)
    ) {
      return data;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBufferView(data)) {
      return data.buffer;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return (0,_helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__["default"])(data, this.formSerializer).toString();
      }

      if ((isFileList = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return (0,_helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (data && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].from(e, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.FormData,
    Blob: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].merge(DEFAULT_CONTENT_TYPE);
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);


/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/defaults/transitional.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VERSION": () => (/* binding */ VERSION)
/* harmony export */ });
const VERSION = "1.3.6";

/***/ }),

/***/ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js":
/*!****************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosURLSearchParams);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/HttpStatusCode.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/HttpStatusCode.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HttpStatusCode);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ bind)
/* harmony export */ });


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildURL)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(params) ?
      params.toString() :
      new _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__["default"](params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ combineURLs)
/* harmony export */ });


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/browser/index.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStandardBrowserEnv ?

// Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(path)) {
          cookie.push('path=' + path);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

// Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })());


/***/ }),

/***/ "./node_modules/axios/lib/helpers/formDataToJSON.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/formDataToJSON.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target) ? target.length : name;

    if (isLast) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(formData) && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(formData.entries)) {
    const obj = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formDataToJSON);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAbsoluteURL)
/* harmony export */ });


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAxiosError)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(payload) && (payload.isAxiosError === true);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/browser/index.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })());


/***/ }),

/***/ "./node_modules/axios/lib/helpers/null.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/null.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// eslint-disable-next-line strict
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (null);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseProtocol.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseProtocol.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ parseProtocol)
/* harmony export */ });


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/speedometer.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/speedometer.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (speedometer);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ spread)
/* harmony export */ });


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toFormData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toFormData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform/node/classes/FormData.js */ "./node_modules/axios/lib/helpers/null.js");




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(thing) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(arr) && !arr.some(isVisitable);
}

const predicates = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"], {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (_platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"] || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSpecCompliantForm(formData);

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(value)) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Blob is not supported. Use a Buffer instead.');
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) && isFlatArray(value)) ||
        ((_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]')) && (arr = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(value, function each(el, key) {
      const result = !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && visitor.call(
        formData, el, _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toFormData);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toURLEncodedForm.js":
/*!************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toURLEncodedForm.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toURLEncodedForm)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/browser/index.js");






function toURLEncodedForm(data, options) {
  return (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, new _platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (_platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNode && _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + _env_data_js__WEBPACK_IMPORTED_MODULE_0__.VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"](
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('options must be an object', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('option ' + opt + ' must be ' + result, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('Unknown option ' + opt, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  assertOptions,
  validators
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/Blob.js":
/*!*****************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/Blob.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof Blob !== 'undefined' ? Blob : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/FormData.js":
/*!*********************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/FormData.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof FormData !== 'undefined' ? FormData : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js":
/*!****************************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/URLSearchParams.js */ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js");
/* harmony import */ var _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes/FormData.js */ "./node_modules/axios/lib/platform/browser/classes/FormData.js");
/* harmony import */ var _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes/Blob.js */ "./node_modules/axios/lib/platform/browser/classes/Blob.js");




/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== 'undefined' && (
    (product = navigator.product) === 'ReactNative' ||
    product === 'NativeScript' ||
    product === 'NS')
  ) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
})();

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
 const isStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isBrowser: true,
  classes: {
    URLSearchParams: _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    FormData: _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    Blob: _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");




// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__["default"])(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    if (reducer(descriptor, name, obj) !== false) {
      reducedDescriptors[name] = descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
}

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0]
  }

  return str;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject
});


/***/ }),

/***/ "./node_modules/js-alert/src/event-source.js":
/*!***************************************************!*\
  !*** ./node_modules/js-alert/src/event-source.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventSource)
/* harmony export */ });
//
// EventSource class - This class provides simple event functionality for classes, with Promise support.
//
//	Usage for once-off event listeners:
//
//		myObj.when("closed").then(function(data) {
//			alert("Closed! " + data);
//		});
//
//
//	Usage for permanent event listeners:
//
//		myObj.on("closed", function(data) {
//			alert("Closed! " + data);
//		});
//
//
//	Usage when triggering an event from a subclass:
//
//		this.emit("closed", "customData");
//


class EventSource {
	
	/** Adds an event listener. If callback is null, a Promise will be returned. Note that if using the Promise
	 *  it will only be triggered on the first event emitted. */
	when(eventName, callback = null) {
		
		// Make sure event listener object exists
		this._eventListeners = this._eventListeners || {};
		
		// Make sure event listener array exists
		this._eventListeners[eventName] = this._eventListeners[eventName] || [];
		
		// Check if using promise form
		if (callback) {
			
			// Just add the callback
			this._eventListeners[eventName].push(callback);
			
		} else {
		
			// Return the promise
			return new Promise((onSuccess, onFail) => {
				
				// Promise callbacks can only be used once
				onSuccess._removeAfterCall = true;
				
				// Add success handler to event listener array
				this._eventListeners[eventName].push(onSuccess);
				
			});
		
		}
		
	}
	
	/** Synonyms */
	on() {
		return this.when.apply(this, arguments);
	}
	
	addEventListener() {
		return this.when.apply(this, arguments);
	}
	
	
	
	
	/** Triggers an event. Each argument after the first one will be passed to event listeners */
	emit(eventName, ...args) {
		
		// Get list of callbacks
		var callbacks = this._eventListeners && this._eventListeners[eventName] || [];
		
		// Call events
		for (var callback of callbacks) {
			
			// Call it
			callback.apply(this, args);
			
		}
		
		// Remove callbacks that can only be called once
		for (var i = 0 ; i < callbacks.length ; i++)
			if (callbacks[i]._removeAfterCall)
				callbacks.splice(i--, 1);
		
	}
	
	/** Synonyms */
	trigger() {
		return this.emit.apply(this, arguments);
	}
	
	triggerEvent() {
		return this.emit.apply(this, arguments);
	}
	
}


// Apply as a mixin to a class or object
EventSource.mixin = function(otherClass) {
	
	for (var prop in EventSource.prototype)
		if (EventSource.prototype.hasOwnProperty(prop))
			otherClass[prop] = EventSource.prototype[prop];
	
}

/***/ }),

/***/ "./node_modules/js-alert/src/icons.js":
/*!********************************************!*\
  !*** ./node_modules/js-alert/src/icons.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//
// Theme icons

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	
	Information: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjgwcHgiIGhlaWdodD0iODBweCIgdmlld0JveD0iMCAwIDgwIDgwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjguMyAoMjk4MDIpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPkluZm9ybWF0aW9uIEljb248L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iSW5mb3JtYXRpb24tSWNvbiIgZmlsbD0iIzAwODVGRiI+CiAgICAgICAgICAgIDxnIGlkPSI3MjQtaW5mb0AyeCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNi4wMDAwMDAsIDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iTGF5ZXJfMSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Il94MzdfMjQtaW5mb194NDBfMngucG5nIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTMzLjczNDA3MTQsMjUuNzA3NjQyOSBDMzQuNzE4ODU3MSwyNS43MDc2NDI5IDM1LjU3MTI4NTcsMjUuMzQzMzU3MSAzNi4yOTAxNDI5LDI0LjYxNzIxNDMgQzM3LjAwOSwyMy44OTEwNzE0IDM3LjM3MDg1NzEsMjMuMDA5NSAzNy4zNzA4NTcxLDIxLjk3NjE0MjkgQzM3LjM3MDg1NzEsMjAuOTQyNzg1NyAzNy4wMTM4NTcxLDIwLjA2IDM2LjI5OTg1NzEsMTkuMzI1MzU3MSBDMzUuNTg1ODU3MSwxOC41OTA3MTQzIDM0LjczMSwxOC4yMjUyMTQzIDMzLjczNDA3MTQsMTguMjI1MjE0MyBDMzIuNzM3MTQyOSwxOC4yMjUyMTQzIDMxLjg3ODY0MjksMTguNTkxOTI4NiAzMS4xNTg1NzE0LDE5LjMyNTM1NzEgQzMwLjQzODUsMjAuMDU4Nzg1NyAzMC4wNzkwNzE0LDIwLjk0Mjc4NTcgMzAuMDc5MDcxNCwyMS45NzYxNDI5IEMzMC4wNzkwNzE0LDIzLjAwOTUgMzAuNDM4NSwyMy44ODk4NTcxIDMxLjE1ODU3MTQsMjQuNjE3MjE0MyBDMzEuODc4NjQyOSwyNS4zNDQ1NzE0IDMyLjczNzE0MjksMjUuNzA3NjQyOSAzMy43MzQwNzE0LDI1LjcwNzY0MjkgTDMzLjczNDA3MTQsMjUuNzA3NjQyOSBaIE0zNCwwIEMxNS4yMjIyODU3LDAgMCwxNS4yMjIyODU3IDAsMzQgQzAsNTIuNzc3NzE0MyAxNS4yMjIyODU3LDY4IDM0LDY4IEM1Mi43Nzc3MTQzLDY4IDY4LDUyLjc3NzcxNDMgNjgsMzQgQzY4LDE1LjIyMjI4NTcgNTIuNzc3NzE0MywwIDM0LDAgTDM0LDAgWiBNMzQsNjUuNTcxNDI4NiBDMTYuNTY0MDcxNCw2NS41NzE0Mjg2IDIuNDI4NTcxNDMsNTEuNDM1OTI4NiAyLjQyODU3MTQzLDM0IEMyLjQyODU3MTQzLDE2LjU2NDA3MTQgMTYuNTY0MDcxNCwyLjQyODU3MTQzIDM0LDIuNDI4NTcxNDMgQzUxLjQzNTkyODYsMi40Mjg1NzE0MyA2NS41NzE0Mjg2LDE2LjU2NDA3MTQgNjUuNTcxNDI4NiwzNCBDNjUuNTcxNDI4Niw1MS40MzU5Mjg2IDUxLjQzNTkyODYsNjUuNTcxNDI4NiAzNCw2NS41NzE0Mjg2IEwzNCw2NS41NzE0Mjg2IFogTTM4LjMzMDE0MjksNDcuNzY3NTcxNCBDMzcuOTg2NSw0Ny42MDM2NDI5IDM3LjcyMDU3MTQsNDcuMzU1OTI4NiAzNy41MzcyMTQzLDQ3LjAyMzIxNDMgQzM3LjM1MjY0MjksNDYuNjkxNzE0MyAzNy4yNTkxNDI5LDQ2LjI4NzM1NzEgMzcuMjU5MTQyOSw0NS44MTAxNDI5IEwzNy4yNTkxNDI5LDI5LjYyMjUgTDM2Ljk4MjI4NTcsMjkuMzE2NSBMMjcuOTM3MDcxNCwyOS44NDcxNDI5IEwyNy45MzcwNzE0LDMxLjMzNTg1NzEgQzI4LjMwNjIxNDMsMzEuMzc1OTI4NiAyOC43MTU0Mjg2LDMxLjQ3MTg1NzEgMjkuMTY0NzE0MywzMS42MjEyMTQzIEMyOS42MTQsMzEuNzcwNTcxNCAyOS45NDkxNDI5LDMxLjkyNzIxNDMgMzAuMTcwMTQyOSwzMi4wODk5Mjg2IEMzMC40NjUyMTQzLDMyLjMwODUgMzAuNzExNzE0MywzMi41OTYyODU3IDMwLjkwODQyODYsMzIuOTU2OTI4NiBDMzEuMTA1MTQyOSwzMy4zMTc1NzE0IDMxLjIwMzUsMzMuNzM1Mjg1NyAzMS4yMDM1LDM0LjIxMDA3MTQgTDMxLjIwMzUsNDYuMDc2MDcxNCBDMzEuMjAzNSw0Ni41Nzg3ODU3IDMxLjEyNDU3MTQsNDYuOTgzMTQyOSAzMC45NjQyODU3LDQ3LjI4OTE0MjkgQzMwLjgwNCw0Ny41OTUxNDI5IDMwLjUyNzE0MjksNDcuODI5NSAzMC4xMzI1LDQ3Ljk5MjIxNDMgQzI5LjkxMDI4NTcsNDguMDg4MTQyOSAyOS42NDY3ODU3LDQ4LjE1NjE0MjkgMjkuMzM5NTcxNCw0OC4xOTYyMTQzIEMyOS4wMzExNDI5LDQ4LjIzNjI4NTcgMjguNzE3ODU3MSw0OC4yNzE1IDI4LjM5ODUsNDguMjk4MjE0MyBMMjguMzk4NSw0OS43ODU3MTQzIEw0MC4wNjUzNTcxLDQ5Ljc4NTcxNDMgTDQwLjA2NTM1NzEsNDguMjk3IEMzOS43NDQ3ODU3LDQ4LjI1NjkyODYgMzkuNDM2MzU3MSw0OC4xODg5Mjg2IDM5LjE0MTI4NTcsNDguMDkzIEMzOC44NDc0Mjg2LDQ3Ljk5ODI4NTcgMzguNTc3ODU3MSw0Ny44ODkgMzguMzMwMTQyOSw0Ny43Njc1NzE0IEwzOC4zMzAxNDI5LDQ3Ljc2NzU3MTQgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",
	
	Question: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjguMyAoMjk4MDIpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlF1ZXN0aW9uIEljb248L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iUXVlc3Rpb24tSWNvbiIgZmlsbD0iIzQxNzUwNSI+CiAgICAgICAgICAgIDxnIGlkPSI3MzktcXVlc3Rpb25AMngiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMDAwMDAwLCAxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IkxheWVyXzEiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJfeDM3XzM5LXF1ZXN0aW9uX3g0MF8yeC5wbmciPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjIuNDQxMDM1NywxMS4zNDYzOTI5IEMyMi4wMzM4OTI5LDEwLjk2OTEwNzEgMjEuNTU0ODIxNCwxMC42ODAwMzU3IDIxLjAwNTE3ODYsMTAuNDc5MTc4NiBDMjAuNDU0ODU3MSwxMC4yNzc2NDI5IDE5Ljg2MzE0MjksMTAuMTc3ODkyOSAxOS4yMzA3MTQzLDEwLjE3Nzg5MjkgQzE3LjkwNDEwNzEsMTAuMTc3ODkyOSAxNi43OTE5Mjg2LDEwLjU3NTUzNTcgMTUuODk1NTM1NywxMS4zNzE1IEMxNC45OTg0NjQzLDEyLjE2Njc4NTcgMTQuNDUxNTM1NywxMy4yNjMzNTcxIDE0LjI1NjEwNzEsMTQuNjYxODkyOSBMMTYuNTYxODkyOSwxNC45MDI3ODU3IEMxNi42NTI4MjE0LDE0LjA5ODY3ODYgMTYuOTI2OTY0MywxMy40NDc5Mjg2IDE3LjM4NzcxNDMsMTIuOTQ5ODU3MSBDMTcuODQ3MTA3MSwxMi40NTI0NjQzIDE4LjQ0Njk2NDMsMTIuMjAyNzUgMTkuMTg0NTcxNCwxMi4yMDI3NSBDMTkuNTE2MzkyOSwxMi4yMDI3NSAxOS44MjkyMTQzLDEyLjI2NzIxNDMgMjAuMTIzMDM1NywxMi4zOTQ3ODU3IEMyMC40MTc1MzU3LDEyLjUyMzcxNDMgMjAuNjY5OTY0MywxMi43MDAxNDI5IDIwLjg4MSwxMi45MjU0Mjg2IEMyMS4wOTIwMzU3LDEzLjE1MDAzNTcgMjEuMjYxNjc4NiwxMy40MTk0Mjg2IDIxLjM4OTI1LDEzLjczMjI1IEMyMS41MTY4MjE0LDE0LjA0NTA3MTQgMjEuNTgxMjg1NywxNC4zODc3NSAyMS41ODEyODU3LDE0Ljc1NzU3MTQgQzIxLjU4MTI4NTcsMTUuMTI3MzkyOSAyMS41MTY4MjE0LDE1LjQ2MDU3MTQgMjEuMzg5MjUsMTUuNzU3Nzg1NyBDMjEuMjYxNjc4NiwxNi4wNTUgMjEuMDk4ODIxNCwxNi4zMzY2MDcxIDIwLjkwMzM5MjksMTYuNjAxMjUgQzIwLjcwNzI4NTcsMTYuODY2NTcxNCAyMC40ODg3ODU3LDE3LjEyNDQyODYgMjAuMjQ3MjE0MywxNy4zNzI3ODU3IEMyMC4wMDYzMjE0LDE3LjYyMTgyMTQgMTkuNzY0NzUsMTcuODY3NDY0MyAxOS41MjM4NTcxLDE4LjEwODM1NzEgQzE5LjIyMjU3MTQsMTguNDEzNzE0MyAxOC45NzAxNDI5LDE4LjY3NDk2NDMgMTguNzY2NTcxNCwxOC44OTE0Mjg2IEMxOC41NjMsMTkuMTA3ODkyOSAxOC40MDA4MjE0LDE5LjMzMzE3ODYgMTguMjgwMDM1NywxOS41NjY2MDcxIEMxOC4xNTkyNSwxOS43OTkzNTcxIDE4LjA2OSwyMC4wNjA2MDcxIDE4LjAwOTI4NTcsMjAuMzQ5Njc4NiBDMTcuOTQ4ODkyOSwyMC42Mzg3NSAxNy45MTkwMzU3LDIxLjAwMDQyODYgMTcuOTE5MDM1NywyMS40MzQ3MTQzIEwxNy45MTkwMzU3LDIyLjkwNTE3ODYgTDIwLjA4OTEwNzEsMjIuOTA1MTc4NiBMMjAuMDg5MTA3MSwyMS44NDQ1NzE0IEMyMC4wODkxMDcxLDIxLjUwNzMyMTQgMjAuMTA0MDM1NywyMS4yMjYzOTI5IDIwLjEzNDU3MTQsMjEuMDAxMTA3MSBDMjAuMTY0NDI4NiwyMC43NzY1IDIwLjIyMDc1LDIwLjU3MTU3MTQgMjAuMzAzNTM1NywyMC4zODYzMjE0IEMyMC4zODYzMjE0LDIwLjIwMjQyODYgMjAuNDk5NjQyOSwyMC4wMjUzMjE0IDIwLjY0MjgyMTQsMTkuODU2MzU3MSBDMjAuNzg2LDE5LjY4NzM5MjkgMjAuOTc4MDM1NywxOS40ODI0NjQzIDIxLjIxOTYwNzEsMTkuMjQxNTcxNCBMMjEuNDQ2MjUsMTkuMDI1MTA3MSBMMjIuODAyNzE0MywxNy41MzA4OTI5IEMyMy4xMDQsMTcuMTI5MTc4NiAyMy4zMzc0Mjg2LDE2LjY5ODk2NDMgMjMuNTAzNjc4NiwxNi4yNDE2MDcxIEMyMy42NjkyNSwxNS43ODM1NzE0IDIzLjc1MjAzNTcsMTUuMjQ4ODU3MSAyMy43NTIwMzU3LDE0LjYzODgyMTQgQzIzLjc1MjAzNTcsMTMuOTMxMDcxNCAyMy42MzUzMjE0LDEzLjMgMjMuNDAxMjE0MywxMi43NDYyODU3IEMyMy4xNjg0NjQzLDEyLjE4OTg1NzEgMjIuODQ4MTc4NiwxMS43MjM2Nzg2IDIyLjQ0MTAzNTcsMTEuMzQ2MzkyOSBMMjIuNDQxMDM1NywxMS4zNDYzOTI5IFogTTE4Ljk4MTY3ODYsMjQuNjQwMjg1NyBDMTguNTc0NTM1NywyNC42NDAyODU3IDE4LjIyNDM5MjksMjQuNzk2MzU3MSAxNy45MzA1NzE0LDI1LjEwOTg1NzEgQzE3LjYzNjA3MTQsMjUuNDIzMzU3MSAxNy40ODk1LDI1Ljc5NzI1IDE3LjQ4OTUsMjYuMjMwODU3MSBDMTcuNDg5NSwyNi42NjQ0NjQzIDE3LjYzNjc1LDI3LjAzNzY3ODYgMTcuOTMwNTcxNCwyNy4zNTExNzg2IEMxOC4yMjQzOTI5LDI3LjY2NDY3ODYgMTguNTc0NTM1NywyNy44MjE0Mjg2IDE4Ljk4MTY3ODYsMjcuODIxNDI4NiBDMTkuMzg4ODIxNCwyNy44MjE0Mjg2IDE5LjczODk2NDMsMjcuNjY0Njc4NiAyMC4wMzM0NjQzLDI3LjM1MTE3ODYgQzIwLjMyNzI4NTcsMjcuMDM3Njc4NiAyMC40NzM4NTcxLDI2LjY2NDQ2NDMgMjAuNDczODU3MSwyNi4yMzA4NTcxIEMyMC40NzM4NTcxLDI1Ljc5NzI1IDIwLjMyNjYwNzEsMjUuNDIzMzU3MSAyMC4wMzM0NjQzLDI1LjEwOTg1NzEgQzE5LjczODk2NDMsMjQuNzk3MDM1NyAxOS4zODgxNDI5LDI0LjY0MDI4NTcgMTguOTgxNjc4NiwyNC42NDAyODU3IEwxOC45ODE2Nzg2LDI0LjY0MDI4NTcgWiBNMTksMCBDOC41MDY1NzE0MywwIDAsOC41MDY1NzE0MyAwLDE5IEMwLDI5LjQ5MzQyODYgOC41MDY1NzE0MywzOCAxOSwzOCBDMjkuNDkzNDI4NiwzOCAzOCwyOS40OTM0Mjg2IDM4LDE5IEMzOCw4LjUwNjU3MTQzIDI5LjQ5MzQyODYsMCAxOSwwIEwxOSwwIFogTTE5LDM2LjY0Mjg1NzEgQzkuMjU2MzkyODYsMzYuNjQyODU3MSAxLjM1NzE0Mjg2LDI4Ljc0MzYwNzEgMS4zNTcxNDI4NiwxOSBDMS4zNTcxNDI4Niw5LjI1NjM5Mjg2IDkuMjU2MzkyODYsMS4zNTcxNDI4NiAxOSwxLjM1NzE0Mjg2IEMyOC43NDM2MDcxLDEuMzU3MTQyODYgMzYuNjQyODU3MSw5LjI1NjM5Mjg2IDM2LjY0Mjg1NzEsMTkgQzM2LjY0Mjg1NzEsMjguNzQzNjA3MSAyOC43NDM2MDcxLDM2LjY0Mjg1NzEgMTksMzYuNjQyODU3MSBMMTksMzYuNjQyODU3MSBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==",
	
	Success: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjguMyAoMjk4MDIpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlN1Y2Nlc3MgSWNvbjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJTdWNjZXNzLUljb24iIGZpbGw9IiMwMDgzMDgiPgogICAgICAgICAgICA8ZyBpZD0iODg4LWNoZWNrbWFya0AyeCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4wMDAwMDAsIDEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iTGF5ZXJfMSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Il94MzhfODgtY2hlY2ttYXJrX3g0MF8yeC5wbmciPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjcuODIxNDI4NiwxMi44OTI4NTcxIEMyNy42MzQxNDI5LDEyLjg5Mjg1NzEgMjcuNDY0NSwxMi45Njg4NTcxIDI3LjM0MTY3ODYsMTMuMDkyMzU3MSBMMTYuOTY0Mjg1NywyMy40NjkwNzE0IEwxMC42NTgzMjE0LDE3LjE2MzEwNzEgQzEwLjUzNTUsMTcuMDQwMjg1NyAxMC4zNjU4NTcxLDE2Ljk2NDI4NTcgMTAuMTc4NTcxNCwxNi45NjQyODU3IEM5LjgwNCwxNi45NjQyODU3IDkuNSwxNy4yNjgyODU3IDkuNSwxNy42NDI4NTcxIEM5LjUsMTcuODMwMTQyOSA5LjU3NiwxNy45OTk3ODU3IDkuNjk4ODIxNDMsMTguMTIyNjA3MSBMMTYuNDg0NTM1NywyNC45MDgzMjE0IEMxNi42MDczNTcxLDI1LjAzMTgyMTQgMTYuNzc3LDI1LjEwNzE0MjkgMTYuOTY0Mjg1NywyNS4xMDcxNDI5IEMxNy4xNTE1NzE0LDI1LjEwNzE0MjkgMTcuMzIxMjE0MywyNS4wMzE4MjE0IDE3LjQ0NDAzNTcsMjQuOTA4MzIxNCBMMjguMzAxMTc4NiwxNC4wNTE4NTcxIEMyOC40MjQsMTMuOTI4MzU3MSAyOC41LDEzLjc1ODcxNDMgMjguNSwxMy41NzE0Mjg2IEMyOC41LDEzLjE5NjE3ODYgMjguMTk2Njc4NiwxMi44OTI4NTcxIDI3LjgyMTQyODYsMTIuODkyODU3MSBMMjcuODIxNDI4NiwxMi44OTI4NTcxIFogTTIxLjcxNDI4NTcsMCBMMTYuMjg1NzE0MywwIEM0LjA3MTQyODU3LDAgMCw0LjA3MTQyODU3IDAsMTYuMjg1NzE0MyBMMCwyMS43MTQyODU3IEMwLDMzLjkyODU3MTQgNC4wNzE0Mjg1NywzOCAxNi4yODU3MTQzLDM4IEwyMS43MTQyODU3LDM4IEMzMy45Mjg1NzE0LDM4IDM4LDMzLjkyODU3MTQgMzgsMjEuNzE0Mjg1NyBMMzgsMTYuMjg1NzE0MyBDMzgsNC4wNzE0Mjg1NyAzMy45Mjg1NzE0LDAgMjEuNzE0Mjg1NywwIEwyMS43MTQyODU3LDAgWiBNMzYuNjQyODU3MSwyMS41MjA4OTI5IEMzNi42NDI4NTcxLDMyLjg2MjUzNTcgMzIuODYyNTM1NywzNi42NDI4NTcxIDIxLjUyMDg5MjksMzYuNjQyODU3MSBMMTYuNDc5Nzg1NywzNi42NDI4NTcxIEM1LjEzNzQ2NDI5LDM2LjY0Mjg1NzEgMS4zNTcxNDI4NiwzMi44NjI1MzU3IDEuMzU3MTQyODYsMjEuNTIwODkyOSBMMS4zNTcxNDI4NiwxNi40Nzk3ODU3IEMxLjM1NzE0Mjg2LDUuMTM3NDY0MjkgNS4xMzc0NjQyOSwxLjM1NzE0Mjg2IDE2LjQ3OTc4NTcsMS4zNTcxNDI4NiBMMjEuNTIwODkyOSwxLjM1NzE0Mjg2IEMzMi44NjI1MzU3LDEuMzU3MTQyODYgMzYuNjQyODU3MSw1LjEzNzQ2NDI5IDM2LjY0Mjg1NzEsMTYuNDc5Nzg1NyBMMzYuNjQyODU3MSwyMS41MjA4OTI5IEwzNi42NDI4NTcxLDIxLjUyMDg5MjkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",
	
	Warning: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjguMyAoMjk4MDIpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPldhcm5pbmcgSWNvbjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJXYXJuaW5nLUljb24iIGZpbGw9IiNGRjlEMDAiPgogICAgICAgICAgICA8ZyBpZD0iNzkxLXdhcm5pbmdAMngiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMDAwMDAwLCAyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IkxheWVyXzEiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJfeDM3XzkxLXdhcm5pbmdfeDQwXzJ4LnBuZyI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zNy44MjM1NzE0LDMzLjI3MTAzNTcgTDM3LjgzMzA3MTQsMzMuMjY1NjA3MSBMMjAuMTY5MTc4NiwwLjY1MjEwNzE0MyBMMjAuMTU3NjQyOSwwLjY1ODg5Mjg1NyBDMTkuOTIwMTQyOSwwLjI2NiAxOS40OTMzMjE0LDAgMTksMCBDMTguNTA3MzU3MSwwIDE4LjA3OTg1NzEsMC4yNjYgMTcuODQxNjc4NiwwLjY1ODg5Mjg1NyBMMTcuODMwMTQyOSwwLjY1MjEwNzE0MyBMMC4xNjY5Mjg1NzEsMzMuMjY1NjA3MSBMMC4xNzcxMDcxNDMsMzMuMjcxMDM1NyBDMC4wNjc4NTcxNDI5LDMzLjQ2NzE0MjkgMCwzMy42ODgzNTcxIDAsMzMuOTI4NTcxNCBDMCwzNC42Nzc3MTQzIDAuNjA4LDM1LjI4NTcxNDMgMS4zNTcxNDI4NiwzNS4yODU3MTQzIEwzNi42NDI4NTcxLDM1LjI4NTcxNDMgQzM3LjM5MiwzNS4yODU3MTQzIDM4LDM0LjY3NzcxNDMgMzgsMzMuOTI4NTcxNCBDMzgsMzMuNjg4MzU3MSAzNy45MzIxNDI5LDMzLjQ2NzE0MjkgMzcuODIzNTcxNCwzMy4yNzEwMzU3IEwzNy44MjM1NzE0LDMzLjI3MTAzNTcgWiBNMzUuMjg1NzE0MywzMy45Mjg1NzE0IEwzNC42MDcxNDI5LDMzLjkyODU3MTQgTDMuMzkyODU3MTQsMzMuOTI4NTcxNCBMMi43MTQyODU3MSwzMy45Mjg1NzE0IEwxLjM1NzE0Mjg2LDMzLjkyODU3MTQgTDE5LDEuMzQyODkyODYgTDM2LjY0Mjg1NzEsMzMuOTI4NTcxNCBMMzUuMjg1NzE0MywzMy45Mjg1NzE0IEwzNS4yODU3MTQzLDMzLjkyODU3MTQgWiBNMTYuMjg1NzE0MywxMy41NzE0Mjg2IEwxNy42NDI4NTcxLDIzLjA3MTQyODYgQzE3LjY0Mjg1NzEsMjMuODIwNTcxNCAxOC4yNTA4NTcxLDI0LjQyODU3MTQgMTksMjQuNDI4NTcxNCBDMTkuNzQ5MTQyOSwyNC40Mjg1NzE0IDIwLjM1NzE0MjksMjMuODIwNTcxNCAyMC4zNTcxNDI5LDIzLjA3MTQyODYgTDIxLjcxNDI4NTcsMTMuNTcxNDI4NiBDMjEuNzE0Mjg1NywxMi44MjIyODU3IDIxLjEwNjI4NTcsMTIuMjE0Mjg1NyAyMC4zNTcxNDI5LDEyLjIxNDI4NTcgTDE3LjY0Mjg1NzEsMTIuMjE0Mjg1NyBDMTYuODkzNzE0MywxMi4yMTQyODU3IDE2LjI4NTcxNDMsMTIuODIyMjg1NyAxNi4yODU3MTQzLDEzLjU3MTQyODYgTDE2LjI4NTcxNDMsMTMuNTcxNDI4NiBaIE0xOSwyMy4wNzE0Mjg2IEwxNy42NDI4NTcxLDEzLjU3MTQyODYgTDIwLjM1NzE0MjksMTMuNTcxNDI4NiBMMTksMjMuMDcxNDI4NiBMMTksMjMuMDcxNDI4NiBaIE0xOSwyNS43ODU3MTQzIEMxNy41MDEwMzU3LDI1Ljc4NTcxNDMgMTYuMjg1NzE0MywyNy4wMDEwMzU3IDE2LjI4NTcxNDMsMjguNSBDMTYuMjg1NzE0MywyOS45OTg5NjQzIDE3LjUwMTAzNTcsMzEuMjE0Mjg1NyAxOSwzMS4yMTQyODU3IEMyMC40OTg5NjQzLDMxLjIxNDI4NTcgMjEuNzE0Mjg1NywyOS45OTg5NjQzIDIxLjcxNDI4NTcsMjguNSBDMjEuNzE0Mjg1NywyNy4wMDEwMzU3IDIwLjQ5ODk2NDMsMjUuNzg1NzE0MyAxOSwyNS43ODU3MTQzIEwxOSwyNS43ODU3MTQzIFogTTE5LDI5Ljg1NzE0MjkgQzE4LjI1MDg1NzEsMjkuODU3MTQyOSAxNy42NDI4NTcxLDI5LjI0OTE0MjkgMTcuNjQyODU3MSwyOC41IEMxNy42NDI4NTcxLDI3Ljc1MDg1NzEgMTguMjUwODU3MSwyNy4xNDI4NTcxIDE5LDI3LjE0Mjg1NzEgQzE5Ljc0OTE0MjksMjcuMTQyODU3MSAyMC4zNTcxNDI5LDI3Ljc1MDg1NzEgMjAuMzU3MTQyOSwyOC41IEMyMC4zNTcxNDI5LDI5LjI0OTE0MjkgMTkuNzQ5MTQyOSwyOS44NTcxNDI5IDE5LDI5Ljg1NzE0MjkgTDE5LDI5Ljg1NzE0MjkgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",
	
	Failed: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjguMyAoMjk4MDIpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPkZhaWxlZCBJY29uPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkZhaWxlZC1JY29uIiBmaWxsPSIjQzAwMDAwIj4KICAgICAgICAgICAgPGcgaWQ9Ijc5MS13YXJuaW5nLXNlbGVjdGVkQDJ4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjAwMDAwMCwgMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJMYXllcl8xIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iX3gzN185MS13YXJuaW5nLXNlbGVjdGVkX3g0MF8yeC5wbmciPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzcuODIzNTcxNCwzMy4yNzEwMzU3IEwzNy44MzMwNzE0LDMzLjI2NTYwNzEgTDIwLjE2OTE3ODYsMC42NTIxMDcxNDMgTDIwLjE1NzY0MjksMC42NTg4OTI4NTcgQzE5LjkyMDE0MjksMC4yNjYgMTkuNDkzMzIxNCwwIDE5LDAgQzE4LjUwNzM1NzEsMCAxOC4wNzk4NTcxLDAuMjY2IDE3Ljg0MTY3ODYsMC42NTg4OTI4NTcgTDE3LjgzMDE0MjksMC42NTIxMDcxNDMgTDAuMTY2OTI4NTcxLDMzLjI2NTYwNzEgTDAuMTc3MTA3MTQzLDMzLjI3MTAzNTcgQzAuMDY3ODU3MTQyOSwzMy40NjcxNDI5IDAsMzMuNjg4MzU3MSAwLDMzLjkyODU3MTQgQzAsMzQuNjc3NzE0MyAwLjYwOCwzNS4yODU3MTQzIDEuMzU3MTQyODYsMzUuMjg1NzE0MyBMMzYuNjQyODU3MSwzNS4yODU3MTQzIEMzNy4zOTIsMzUuMjg1NzE0MyAzOCwzNC42Nzc3MTQzIDM4LDMzLjkyODU3MTQgQzM4LDMzLjY4ODM1NzEgMzcuOTMyMTQyOSwzMy40NjcxNDI5IDM3LjgyMzU3MTQsMzMuMjcxMDM1NyBMMzcuODIzNTcxNCwzMy4yNzEwMzU3IFogTTE5LDMxLjIxNDI4NTcgQzE3LjUwMTAzNTcsMzEuMjE0Mjg1NyAxNi4yODU3MTQzLDI5Ljk5ODk2NDMgMTYuMjg1NzE0MywyOC41IEMxNi4yODU3MTQzLDI3LjAwMTAzNTcgMTcuNTAxMDM1NywyNS43ODU3MTQzIDE5LDI1Ljc4NTcxNDMgQzIwLjQ5ODk2NDMsMjUuNzg1NzE0MyAyMS43MTQyODU3LDI3LjAwMTAzNTcgMjEuNzE0Mjg1NywyOC41IEMyMS43MTQyODU3LDI5Ljk5ODk2NDMgMjAuNDk4OTY0MywzMS4yMTQyODU3IDE5LDMxLjIxNDI4NTcgTDE5LDMxLjIxNDI4NTcgWiBNMjAuMzU3MTQyOSwyMy4wNzE0Mjg2IEMyMC4zNTcxNDI5LDIzLjgyMDU3MTQgMTkuNzQ5MTQyOSwyNC40Mjg1NzE0IDE5LDI0LjQyODU3MTQgQzE4LjI1MDg1NzEsMjQuNDI4NTcxNCAxNy42NDI4NTcxLDIzLjgyMDU3MTQgMTcuNjQyODU3MSwyMy4wNzE0Mjg2IEwxNi4yODU3MTQzLDEzLjU3MTQyODYgQzE2LjI4NTcxNDMsMTIuODIyMjg1NyAxNi44OTM3MTQzLDEyLjIxNDI4NTcgMTcuNjQyODU3MSwxMi4yMTQyODU3IEwyMC4zNTcxNDI5LDEyLjIxNDI4NTcgQzIxLjEwNjI4NTcsMTIuMjE0Mjg1NyAyMS43MTQyODU3LDEyLjgyMjI4NTcgMjEuNzE0Mjg1NywxMy41NzE0Mjg2IEwyMC4zNTcxNDI5LDIzLjA3MTQyODYgTDIwLjM1NzE0MjksMjMuMDcxNDI4NiBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==",
	
	Deleted: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjguMyAoMjk4MDIpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlRyYXNoIEljb248L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iVHJhc2gtSWNvbiIgZmlsbD0iIzAwMDAwMCI+CiAgICAgICAgICAgIDxnIGlkPSI3MTEtdHJhc2hAMngiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMDAwMDAwLCAxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IkxheWVyXzEiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJfeDM3XzExLXRyYXNoX3g0MF8yeC5wbmciPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOC4xMTAyODU3MSw4LjE0MzUzNTcxIEM3LjczNjM5Mjg2LDguMTY1MjUgNy40NTA3MTQyOSw4LjQ4NzU3MTQzIDcuNDcyNDI4NTcsOC44NjIxNDI4NiBMOC44MjI3ODU3MSwzMy4yOTEzOTI5IEM4Ljg0NDUsMzMuNjY2NjQyOSA5LjE2NTQ2NDI5LDMzLjk1MjMyMTQgOS41NDAwMzU3MSwzMy45Mjk5Mjg2IEM5LjkxNDYwNzE0LDMzLjkwNzUzNTcgMTAuMTk5NjA3MSwzMy41ODY1NzE0IDEwLjE3Nzg5MjksMzMuMjExMzIxNCBMOC44Mjc1MzU3MSw4Ljc4MjA3MTQzIEM4LjgwNTE0Mjg2LDguNDA4MTc4NTcgOC40ODQxNzg1Nyw4LjEyMTgyMTQzIDguMTEwMjg1NzEsOC4xNDM1MzU3MSBMOC4xMTAyODU3MSw4LjE0MzUzNTcxIFogTTE0LjI1LDguMTQyODU3MTQgQzEzLjg3NTQyODYsOC4xNDI4NTcxNCAxMy41NzE0Mjg2LDguNDQ2ODU3MTQgMTMuNTcxNDI4Niw4LjgyMTQyODU3IEwxMy41NzE0Mjg2LDMzLjI1IEMxMy41NzE0Mjg2LDMzLjYyNTI1IDEzLjg3NTQyODYsMzMuOTI4NTcxNCAxNC4yNSwzMy45Mjg1NzE0IEMxNC42MjUyNSwzMy45Mjg1NzE0IDE0LjkyODU3MTQsMzMuNjI1MjUgMTQuOTI4NTcxNCwzMy4yNSBMMTQuOTI4NTcxNCw4LjgyMTQyODU3IEMxNC45Mjg1NzE0LDguNDQ2ODU3MTQgMTQuNjI1MjUsOC4xNDI4NTcxNCAxNC4yNSw4LjE0Mjg1NzE0IEwxNC4yNSw4LjE0Mjg1NzE0IFogTTI3LjgyMTQyODYsNC4wNzE0Mjg1NyBMMjAuMzU3MTQyOSw0LjA3MTQyODU3IEwyMC4zNTcxNDI5LDIuNzE0Mjg1NzEgQzIwLjM1NzE0MjksMS4yMTUzMjE0MyAxOS4xNDE4MjE0LDAgMTcuNjQyODU3MSwwIEwxMC44NTcxNDI5LDAgQzkuMzU4MTc4NTcsMCA4LjE0Mjg1NzE0LDEuMjE1MzIxNDMgOC4xNDI4NTcxNCwyLjcxNDI4NTcxIEw4LjE0Mjg1NzE0LDQuMDcxNDI4NTcgTDAuNjc4NTcxNDI5LDQuMDcxNDI4NTcgQzAuMzA0LDQuMDcxNDI4NTcgMCw0LjM3NTQyODU3IDAsNC43NSBDMCw1LjEyNTI1IDAuMzA0LDUuNDI4NTcxNDMgMC42Nzg1NzE0MjksNS40Mjg1NzE0MyBMMS4zNTcxNDI4Niw1LjQyODU3MTQzIEw0LjA3MTQyODU3LDM1LjI4NTcxNDMgQzQuMDcxNDI4NTcsMzYuNzg0Njc4NiA1LjI4Njc1LDM4IDYuNzg1NzE0MjksMzggTDIxLjcxNDI4NTcsMzggQzIzLjIxMzI1LDM4IDI0LjQyODU3MTQsMzYuNzg0Njc4NiAyNC40Mjg1NzE0LDM1LjI4NTcxNDMgTDI3LjE0Mjg1NzEsNS40Mjg1NzE0MyBMMjcuODIxNDI4Niw1LjQyODU3MTQzIEMyOC4xOTY2Nzg2LDUuNDI4NTcxNDMgMjguNSw1LjEyNTI1IDI4LjUsNC43NSBDMjguNSw0LjM3NTQyODU3IDI4LjE5NjY3ODYsNC4wNzE0Mjg1NyAyNy44MjE0Mjg2LDQuMDcxNDI4NTcgTDI3LjgyMTQyODYsNC4wNzE0Mjg1NyBaIE05LjUsMi43MTQyODU3MSBDOS41LDEuOTY1MTQyODYgMTAuMTA4LDEuMzU3MTQyODYgMTAuODU3MTQyOSwxLjM1NzE0Mjg2IEwxNy42NDI4NTcxLDEuMzU3MTQyODYgQzE4LjM5MiwxLjM1NzE0Mjg2IDE5LDEuOTY1MTQyODYgMTksMi43MTQyODU3MSBMMTksNC4wNzE0Mjg1NyBMOS41LDQuMDcxNDI4NTcgTDkuNSwyLjcxNDI4NTcxIEw5LjUsMi43MTQyODU3MSBaIE0yMy4wNzE0Mjg2LDM1LjI4NTcxNDMgQzIzLjA3MTQyODYsMzYuMDM0ODU3MSAyMi40NjM0Mjg2LDM2LjY0Mjg1NzEgMjEuNzE0Mjg1NywzNi42NDI4NTcxIEw2Ljc4NTcxNDI5LDM2LjY0Mjg1NzEgQzYuMDM2NTcxNDMsMzYuNjQyODU3MSA1LjQyODU3MTQzLDM2LjAzNDg1NzEgNS40Mjg1NzE0MywzNS4yODU3MTQzIEwyLjcxNDI4NTcxLDUuNDI4NTcxNDMgTDguMTQyODU3MTQsNS40Mjg1NzE0MyBMOS41LDUuNDI4NTcxNDMgTDE5LDUuNDI4NTcxNDMgTDIwLjM1NzE0MjksNS40Mjg1NzE0MyBMMjUuNzg1NzE0Myw1LjQyODU3MTQzIEwyMy4wNzE0Mjg2LDM1LjI4NTcxNDMgTDIzLjA3MTQyODYsMzUuMjg1NzE0MyBaIE0xOS42NzI0NjQzLDguODI0MTQyODYgTDE4LjMyMjc4NTcsMzMuMjEyNjc4NiBDMTguMzAxMDcxNCwzMy41ODcyNSAxOC41ODYwNzE0LDMzLjkwNzUzNTcgMTguOTU5OTY0MywzMy45Mjk5Mjg2IEMxOS4zMzM4NTcxLDMzLjk1MjMyMTQgMTkuNjU0ODIxNCwzMy42NjU5NjQzIDE5LjY3NzIxNDMsMzMuMjkyNzUgTDIxLjAyNzU3MTQsOC45MDM1MzU3MSBDMjEuMDQ5Mjg1Nyw4LjUyOTY0Mjg2IDIwLjc2MzYwNzEsOC4yMDg2Nzg1NyAyMC4zOTAzOTI5LDguMTg2Mjg1NzEgQzIwLjAxNTgyMTQsOC4xNjM4OTI4NiAxOS42OTQ4NTcxLDguNDQ5NTcxNDMgMTkuNjcyNDY0Myw4LjgyNDE0Mjg2IEwxOS42NzI0NjQzLDguODI0MTQyODYgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
	
});

/***/ }),

/***/ "./node_modules/js-alert/src/index.js":
/*!********************************************!*\
  !*** ./node_modules/js-alert/src/index.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ JSAlert)
/* harmony export */ });
/* harmony import */ var _queue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./queue.js */ "./node_modules/js-alert/src/queue.js");
/* harmony import */ var _event_source_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-source.js */ "./node_modules/js-alert/src/event-source.js");
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../package.json */ "./node_modules/js-alert/package.json");
/* harmony import */ var light_sanitize_html__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! light-sanitize-html */ "./node_modules/light-sanitize-html/src/index.js");
/* harmony import */ var _icons_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./icons.js */ "./node_modules/js-alert/src/icons.js");
//
// Main class for the JSAlert package






class JSAlert extends _event_source_js__WEBPACK_IMPORTED_MODULE_1__["default"] {

	/** Library version */
	static get version() {
		return _package_json__WEBPACK_IMPORTED_MODULE_2__.version
	}
	
	/** @static Creates and shows a new alert with the specified text */
	static alert(text, title, icon, closeText = "Close") {
		
		// Check if not in a browser
		if (typeof window === "undefined")
			return Promise.resolve(console.log("Alert: " + text));
		
		// Create alert
		var alert = new JSAlert(text, title);
		alert.addButton(closeText, null);
		
		// Set icon
		if (icon !== false)
			alert.setIcon(icon || JSAlert.Icons.Information);
		
		// Show it
		return alert.show();
		
	}
	
	/** @static Creates and shows a new confirm alert with the specified text */
	static confirm(text, title, icon, acceptText = "OK", rejectText = "Cancel") {
		
		// Check if not in a browser
		if (typeof window === "undefined")
			return Promise.resolve(console.log("Alert: " + text));
		
		// Create alert
		var alert = new JSAlert(text, title);
		alert.addButton(acceptText, true);
		alert.addButton(rejectText, false);
		
		// Set icon
		if (icon !== false)
			alert.setIcon(icon || JSAlert.Icons.Question);
		
		// Show it
		return alert.show();
		
	}
	
	/** @static Creates and shows a new prompt, an alert with a single text field. */
	static prompt(text, defaultText, placeholderText, title, icon, acceptText = "OK", rejectText = "Cancel") {
		
		// Check if not in a browser
		if (typeof window === "undefined")
			return Promise.resolve(console.log("Alert: " + text));
		
		// Create alert
		var alert = new JSAlert(text, title);
		alert.addButton(acceptText, true, "default");
		alert.addButton(rejectText, false, "cancel");
		
		// Set icon
		if (icon !== false)
			alert.setIcon(icon || JSAlert.Icons.Question);
		
		// Add text field
		alert.addTextField(defaultText, null, placeholderText);
		
		// Show it
		return alert.show().then((result) => {
			
			// Check if cancelled
			if (alert.cancelled)
				return null;
			else
				return alert.getTextFieldValue(0);
			
		});
		
	}
	
	/** @static Creates and shows a loader, which is just an alert with no buttons. */
	static loader(text, cancelable) {
		
		// Check if not in a browser
		if (typeof window === "undefined")
			return Promise.resolve(console.log("Loading: " + text));
		
		// Create alert
		var alert = new JSAlert(text);
		alert.cancelable = cancelable;
		
		// Show it
		return alert.show();
		
	}
	
	/** Constructor */
	constructor(text = "", title = "") {
		super();
		
		// Setup vars
		this.elems 		= {};
		this.title		= title;
		this.text		= text;
		this.buttons	= [];
		this.textFields	= [];
		this.result		= false;
		this.iconURL	= null;
		this.cancelable = true;
		this.cancelled	= false;
		this.dismissed	= false;
		
	}
	
	
	/** Sets an icon for the alert. `icon` is either a URL or one of `JSAlert.Icons`. */
	setIcon(icon) {
		this.iconURL = icon;
	}
	
	
	/** Adds a button. Returns a Promise that is called if the button is clicked. */
	addButton(text, value, type) {
		
		// Return promise
		return new Promise((onSuccess, onFail) => {
			
			// Add button
			this.buttons.push({
				text: text,
				value: typeof value == "undefined" ? text : value,
				type: type || (this.buttons.length == 0 ? "default" : "normal"),
				callback: onSuccess
			});
			
		});
		
	}
	
	
	/** Adds a text field. Returns a Promise that will be called when the dialog is dismissed, but not cancelled. */
	addTextField(value, type, placeholderText)  {
		
		// Add text field
		this.textFields.push({
			value: value || "",
			type: type || "text",
			placeholder: placeholderText || ""
		});
		
	}
	
	
	/** Gets a text field's value */
	getTextFieldValue(index) {
		
		// Get text field info
		var info = this.textFields[index];
		
		// Return the value
		return (info.elem ? info.elem.value : info.value);
		
	}
	
	
	/** Shows the alert. */
	show() {
		
		// Add to the queue
		JSAlert.popupQueue.add(this).then(() => {
			
			// Show us
			this._show();
			
			// Notify that we have been shown
			this.emit("opened");
			
		});
		
		// Return the alert
		return this;
		
	}
	
	
	/** A then function, to allow chaining with Promises */
	then(func) {
		return this.when("closed").then(func);
	}
	
	
	/** Dismisses the alert. */
	dismiss(result) {
		
		// Do nothing if dismissed already
		if (this.dismissed) return;
		this.dismissed = true;
		
		// Remove us from the queue
		JSAlert.popupQueue.remove(this);
		
		// Store result
		this.result = result;
		if (typeof result == "undefined")
			this.cancelled = true;
		
		// Remove elements
		this.removeElements();
		
		// Remove global keyboard listener
		window.removeEventListener("keydown", this);
		
		// Trigger cancel-specific event
		if (this.cancelled)
			this.emit("cancelled", this.result);
		else
			this.emit("complete", this.result);
		
		// Trigger closed event
		this.emit("closed", this.result);
		return this;
		
	}
	
	
	/** Dismisses the alert some time in the future */
	dismissIn(time) {
		
		setTimeout(this.dismiss.bind(this), time);
		return this;
	
	}
	
	
	/** @private Called to actually show the alert. */
	_show() {
		
		// Create elements
		this.createBackground();
		this.createPopup();
		
		// Add global keyboard listener
		window.addEventListener("keydown", this);
		
	}
	
	
	/** @private Called to create the overlay element. Theme subclasses can override this. */
	createBackground() {
		
		// Create element
		this.elems.background = document.createElement("div");
		this.elems.background.style.cssText = "position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 10000; background-color: rgba(0, 0, 0, 0.1); opacity: 0; transition: opacity 0.15s; ";
		
		// Add to document
		document.body.appendChild(this.elems.background);
		
		// Do animation
		setTimeout(() => {
			this.elems.background.offsetWidth;
			this.elems.background.style.opacity = 1;
		}, 0);
		
	}
	
	
	/** @private Called to create the popup element. Theme subclasses can override this. */
	createPopup() {
		
		// Create container element
		this.elems.container = document.createElement("div");
		this.elems.container.focusable = true;
		this.elems.container.style.cssText = "position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 10001; display: flex; justify-content: center; align-items: center; opacity: 0; transform: translateY(-40px); transition: opacity 0.15s, transform 0.15s; ";
		document.body.appendChild(this.elems.container);
		
		// Do animation
		setTimeout(() => {
			this.elems.container.offsetWidth;
			this.elems.container.style.opacity = 1;
			this.elems.container.style.transform = "translateY(0px)";
		}, 0);
		
		// Add dismiss handler
		this.addTouchHandler(this.elems.container, () => {
			
			// Check if cancelable
			if (!this.cancelable)
				return;
			
			// Dismiss
			this.cancelled = true;
			this.dismiss();
			
		});
		
		// Create window
		this.elems.window = document.createElement("div");
		this.elems.window.style.cssText = "position: relative; background-color: rgba(255, 255, 255, 0.95); box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25); border-radius: 5px; padding: 10px; min-width: 50px; min-height: 10px; max-width: 50%; max-height: 90%; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); ";
		this.elems.container.appendChild(this.elems.window);
		
		// Create icon if there is one
		if (this.iconURL) {
			
			this.elems.icon = document.createElement("img");
			this.elems.icon.style.cssText = "display: block; margin: auto; max-height: 40px; text-align: center; font-family: Helvetica, Arial; font-size: 17px; font-weight: bold; color: #000; cursor: default; padding: 10px 0px; ";
			this.elems.icon.src = this.iconURL;
			this.elems.window.appendChild(this.elems.icon);
			
		}
		
		// Create title if there is one
		if (this.title) {
			
			this.elems.title = document.createElement("div");
			this.elems.title.style.cssText = "display: block; text-align: center; font-family: Helvetica, Arial; font-size: 17px; font-weight: bold; color: #000; cursor: default; padding: 2px 20px; ";
			this.elems.title.innerHTML = light_sanitize_html__WEBPACK_IMPORTED_MODULE_3__(this.title)
			this.elems.window.appendChild(this.elems.title);
			
		}
		
		// Create text if there is one
		if (this.text) {
			
			this.elems.text = document.createElement("div");
			this.elems.text.style.cssText = "display: block; text-align: center; font-family: Helvetica, Arial; font-size: 15px; font-weight: normal; color: #000; cursor: default; padding: 2px 20px; ";
			this.elems.text.innerHTML = light_sanitize_html__WEBPACK_IMPORTED_MODULE_3__(this.text)
			this.elems.window.appendChild(this.elems.text);
			
		}
		
		// Create text fields if there are any
		if (this.textFields.length > 0) {
			
			this.elems.textFields = document.createElement("div");
			this.elems.textFields.style.cssText = "display: block; ";
			this.elems.window.appendChild(this.elems.textFields);
			
			// Add each text field
			this.textFields.forEach((b, idx) => {
				
				b.elem = document.createElement("input");
				b.elem.style.cssText = "display: block; width: 90%; min-width: 250px; padding: 5px 0px; margin: 10px auto; background-color: #FFF; border: 1px solid #EEE; border-radius: 5px; text-align: center; font-family: Helvetica, Arial; font-size: 15px; color: #222; ";
				b.elem.value = b.value;
				b.elem.placeholder = b.placeholder;
				b.elem.type = b.type;
				this.elems.textFields.appendChild(b.elem);
				
				// Add keyboard listener
				b.elem.addEventListener("keypress", (e) => {
					
					// Ignore if not enter
					if (e.keyCode != 13)
						return;
					
					// Check if this is the last input field
					if (idx+1 >= this.textFields.length) {
						
						// Done
						this.dismiss("enter-pressed");
						
					} else {
						
						// Just select the next field
						this.textFields[idx+1].elem.focus();
						
					}
					
				});
				
			});
			
			// Focus on first field
			this.textFields[0].elem.focus();
			
		}
		
		// Create buttons if there are any
		if (this.buttons.length > 0) {
			
			this.elems.buttons = document.createElement("div");
			this.elems.buttons.style.cssText = "display: block; display: flex; justify-content: space-around; align-items: center; text-align: right; border-top: 1px solid #EEE; margin-top: 10px; ";
			this.elems.window.appendChild(this.elems.buttons);
			
			// Add each button
			this.buttons.forEach((b) => {
				
				var btn = document.createElement("div");
				btn.style.cssText = "display: inline-block; font-family: Helvetica, Arial; font-size: 15px; font-weight: 200; color: #08F; padding: 10px 20px; padding-bottom: 0px; cursor: pointer; ";
				btn.innerText = b.text;
				this.elems.buttons.appendChild(btn);
				
				// Add button handler
				this.addTouchHandler(btn, () => {
					b.callback && b.callback(b.value);
					if (b.type == "cancel") this.cancelled = true;
					this.dismiss(b.value);
				});
				
			});
			
		}
		
	}
	
	
	/** @private Called to remove all elements from the screen */
	removeElements() {
		
		// Don't do anything if not loaded
		if (!this.elems || !this.elems.container)
			return;
		
		// Animate background away
		this.elems.background.style.opacity = 0;
		this.elems.container.style.opacity = 0;
		this.elems.container.style.transform = "translateY(40px)";
		
		// Remove elements after animation
		setTimeout(() => {
			this.removeElement(this.elems.background);
			this.removeElement(this.elems.container);
		}, 250);
		
	}
	
	/** @private Helper function to remove an element */
	removeElement(elem) {
		elem && elem.parentNode && elem.parentNode.removeChild(elem);
	}
	
	/** @private Helper function to add a click or touch event handler that doesn't bubble */
	addTouchHandler(elem, callback) {
		
		// Create handler
		var handler = (e) => {
			
			// Stop default browser action, unless this is an input field
			if (e.target.nodeName.toLowerCase() != "input")
				e.preventDefault();
			
			// Check if our element was pressed, not a child element
			if (e.target != elem)
				return;
			
			// Trigger callback
			callback();
		}
		
		// Add listeners
		this.elems.container.addEventListener("mousedown", handler, true);
		this.elems.container.addEventListener("touchstart", handler, true);
		
	}
	
	/** @private Called by the browser when a keyboard event is fired on the whole window */
	handleEvent(e) {
		
		// Check if enter was pressed
		if (e.keyCode == 13) {
			
			// Find the first default button and use that value instead
			for (var i = 0 ; i < this.buttons.length ; i++) {
				if (this.buttons[i].type == "default") {
					
					// Use this button's value
					this.dismiss(this.buttons[i].value);
					e.preventDefault();
					
					// Trigger the button's callback
					this.buttons[i].callback && this.buttons[i].callback(this.result);
					return;
					
				}
			}
			
			// No default button found, cancel
			this.cancelled = true;
			this.dismiss();
			return;
			
		}
		
		// Check if escape was pressed
		if (e.keyCode == 27) {
			
			// Check if cancelable
			if (!this.cancelable)
				return;
			
			// Find the first default button and use that value instead
			this.cancelled = true;
			this.result = null;
			for (var i = 0 ; i < this.buttons.length ; i++) {
				if (this.buttons[i].type == "cancel") {
					
					// Use this button's value
					this.dismiss(this.buttons[i].value);
					e.preventDefault();
					
					// Trigger the button's callback
					this.buttons[i].callback && this.buttons[i].callback(this.result);
					return;
					
				}
			}
			
			// No cancel button found, just cancel
			this.cancelled = true;
			this.dismiss();
			return;
			
		}
		
	}
	
}



// Include theme's icons

JSAlert.Icons = _icons_js__WEBPACK_IMPORTED_MODULE_4__["default"];


	
// The default popup queue
JSAlert.popupQueue = new _queue_js__WEBPACK_IMPORTED_MODULE_0__["default"]();


// In case anyone wants to use the classes of this project on their own...
JSAlert.Queue = _queue_js__WEBPACK_IMPORTED_MODULE_0__["default"];
JSAlert.EventSource = _event_source_js__WEBPACK_IMPORTED_MODULE_1__["default"];

/***/ }),

/***/ "./node_modules/js-alert/src/queue.js":
/*!********************************************!*\
  !*** ./node_modules/js-alert/src/queue.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Queue)
/* harmony export */ });
/* harmony import */ var _event_source_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event-source.js */ "./node_modules/js-alert/src/event-source.js");
//
// Queue class - A queue contains a list of items. Only one item can be active
// at a time, and when one is removed the next one is activated
//
// To use this class, first add() your item. A promise will be returned that gets resolved
// when your item is ready to be activated. Once your item is finished doing what it needs
// to do, remove() it. This will trigger the next item's promise.
//
//	Example:
//
//		var queue = new Queue();
//		
//		var msgbox = new Popup();
//		queue.add(msgbox).then(() => {
//			msgbox.show();
//			msgbox.when('closed').then(() => queue.remove(msgbox));
//		}
//		
//		var msgbox2 = new Popup();
//		queue.add(msgbox2).then(() => {
//			msgbox2.show();
//			msgbox2.when('closed').then(() => queue.remove(msgbox2));
//		}
//	
//
//	In the above example, only one message box would be visible at a time.
//




class Queue extends _event_source_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
	
	constructor() {
		super();
		
		// Setup vars
		this.items 				= [];
		this.current			= null;
		
	}
	
	
	/** Adds a queue item, and returns a Promise. */
	add(item) {
		
		// Return a promise
		return new Promise((onSuccess, onFail) => {
			
			// Store item and handler at the end of the queue. When this item is ready to be activated, the handler will be called to resolve the promise.
			this.items.push({
				item: item,
				activateHandler: onSuccess
			});
			
			// Emit event
			this.emit("added", item);
			
			// Check if we can activate this one now
			setTimeout(this.checkActivated.bind(this), 1);
		
		});
		
	}
	
	
	/** @private Checks if there a new item to be activated */
	checkActivated() {
		
		// Check if there's already an activated item
		if (this.current)
			return;
		
		// Check if we have any items
		if (this.items.length == 0) {
			
			// No more items
			this.emit("empty");
			return;
			
		}
		
		// We can activate the next item now
		this.current = this.items[0];
		
		// Create promise resolve response. DO NOT directly pass a thenable, it won't work!
		var resp = {
			item: this.current.item
		}
		
		// Resolve promise
		this.current.activateHandler && this.current.activateHandler(resp);
		
		// Trigger event
		this.emit("activated", resp);
		
	}
	
	/** Removes a queued item. If the item is the currently activated one, the next item in the queue will be activated. */
	remove(item) {
		
		// Remove item from queue
		for (var i = 0 ; i < this.items.length ; i++)
			if (this.items[i].item == item)
				this.items.splice(i--, 1);
			
		// Emit event
		this.emit("removed", item);
			
		// Check if this was the current item
		if (this.current && this.current.item == item)
			this.current = null;
		
		// Possibly activate the next item
		setTimeout(this.checkActivated.bind(this), 1);
		
	}
	
}

/***/ }),

/***/ "./node_modules/js-alert/package.json":
/*!********************************************!*\
  !*** ./node_modules/js-alert/package.json ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"js-alert","version":"2.0.0","description":"A simple JavaScript popup alert manager.","main":"src/index.js","type":"module","scripts":{"test":"npm install && npm build","build":"webpack","prepublish":"npm run build"},"keywords":["browser","javascript","alert","popup","modal"],"author":"jjv360","license":"MIT","repository":{"type":"git","url":"https://github.com/jjv360/js-alert.git"},"devDependencies":{"@babel/core":"^7.20.12","@babel/preset-env":"^7.20.2","babel-loader":"^9.1.2","webpack":"^5.75.0","webpack-cli":"^5.0.1"},"dependencies":{"light-sanitize-html":"^1.0.2"}}');

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************************************************!*\
  !*** ./src/content/modalPasteViewer/contentModalPaste.ts ***!
  \***********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_icon_IconClose_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../assets/icon/IconClose.svg */ "./src/assets/icon/IconClose.svg");
/* harmony import */ var _assets_icon_IconClose_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_icon_IconClose_svg__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _assets_icon_IconPaste_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../assets/icon/IconPaste.svg */ "./src/assets/icon/IconPaste.svg");
/* harmony import */ var _assets_icon_IconPaste_svg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_assets_icon_IconPaste_svg__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _assets_icon_IconPlus_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../assets/icon/IconPlus.svg */ "./src/assets/icon/IconPlus.svg");
/* harmony import */ var _assets_icon_IconPlus_svg__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_assets_icon_IconPlus_svg__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _screens_OneScreenCopyModal_OneScreenCopyModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../screens/OneScreenCopyModal/OneScreenCopyModal */ "./src/screens/OneScreenCopyModal/OneScreenCopyModal.ts");
/* harmony import */ var _screens_TwoScreenCopyModal_TwoScreenCopyModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../screens/TwoScreenCopyModal/TwoScreenCopyModal */ "./src/screens/TwoScreenCopyModal/TwoScreenCopyModal.ts");
/* harmony import */ var _services_Icon_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/Icon.service */ "./src/services/Icon.service.ts");
/* harmony import */ var _utils_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/components */ "./src/utils/components.ts");
/* harmony import */ var _services_Entities_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../../services/Entities.service */ "./src/services/Entities.service.ts");
/* harmony import */ var _contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./contentModalPaste.scss */ "./src/content/modalPasteViewer/contentModalPaste.scss");
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
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};










var documentBody = document.body;
var clearBeforeNode = function () {
    var nodes = document.querySelectorAll('.exNeolant');
    nodes.forEach(function (element) {
        element.remove();
    });
};
clearBeforeNode();
var deleteView = function (id) {
    chrome.storage.local.get(["viewersState"], function (result) {
        var allView = result.viewersState && JSON.parse(result.viewersState);
        var saveViewersStorage = allView.filter(function (item) { return item.Id !== id; });
        chrome.storage.local.set({
            viewersState: JSON.stringify(saveViewersStorage)
        }, function () {
            console.log("Данные сохранены");
        });
    });
};
var glEntitiesFromPaste = new _utils_components__WEBPACK_IMPORTED_MODULE_7__.useState([], function () {
    insertContent();
    renderShowLoading();
});
var glCurrentRightPage = new _utils_components__WEBPACK_IMPORTED_MODULE_7__.useState('1', function () { });
var glViewerForPaste = new _utils_components__WEBPACK_IMPORTED_MODULE_7__.useState([], function () {
    insertContent();
});
var glIcons = new _utils_components__WEBPACK_IMPORTED_MODULE_7__.useState([], function () {
    insertContent();
});
var changeSelectedToggleiewer = function (id) {
    glViewerForPaste.update(glViewerForPaste.value.map(function (item) {
        if (item.Id === id) {
            item.isSelected = !(item === null || item === void 0 ? void 0 : item.isSelected);
        }
        return item;
    }));
};
var changeOrderViewerInEntities = function (id, order) {
    var newViewers = glViewerForPaste.value.map(function (item) {
        if (item.Id === id) {
            item.order = order;
        }
        return item;
    });
    glViewerForPaste.update(newViewers);
};
chrome.runtime.sendMessage({
    action: 'getEntities',
    payload: window.location.origin
});
var fetchIcons = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, _services_Icon_service__WEBPACK_IMPORTED_MODULE_6__.IconService.getIcons()];
            case 1:
                response = _a.sent();
                glIcons.update(response);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
fetchIcons();
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'postEntitiesForPasteInsert') {
        glEntitiesFromPaste.update(request.payload);
    }
});
chrome.storage.local.get(["viewersState"], function (result) {
    var allView = result.viewersState && JSON.parse(result.viewersState);
    var saveViewersStorage = Array.isArray(allView) ? allView : [];
    glViewerForPaste.update(saveViewersStorage);
});
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var _i = 0, _a = Object.entries(changes); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], _c = _b[1], oldValue = _c.oldValue, newValue = _c.newValue;
        if (!newValue)
            return;
        var viewers = JSON.parse(newValue);
        glViewerForPaste.update(viewers);
    }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.actions === 'isShowModal') {
        if (request.payload) {
            modalWrapepr.classList.add(_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].modalWrapper__active);
            insertContent();
        }
        else {
            modalWrapepr.classList.remove(_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].modalWrapper__active);
        }
    }
});
var modalWrapepr = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('div', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].modalWrapper, _contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].modalWrapper__active]);
var modal = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('div', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].modal]);
var wrapper = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('div', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].wrapperModal]);
var loadingModal = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('div');
function renderShowLoading() {
    var _a;
    var _b, _c;
    loadingModal.className = classnames__WEBPACK_IMPORTED_MODULE_0__(_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].modalLoading, (_a = {},
        _a[_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].modalLoading__show] = !((_b = glEntitiesFromPaste === null || glEntitiesFromPaste === void 0 ? void 0 : glEntitiesFromPaste.value) === null || _b === void 0 ? void 0 : _b.length),
        _a));
    if ((_c = glEntitiesFromPaste === null || glEntitiesFromPaste === void 0 ? void 0 : glEntitiesFromPaste.value) === null || _c === void 0 ? void 0 : _c.length) {
        setTimeout(function () {
            loadingModal.remove();
        }, 1000);
    }
    loadingModal.innerHTML = 'Загрузка...';
}
renderShowLoading();
wrapper.append(loadingModal);
var wrapperLeft = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('div', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].wrapperLeft]);
var navbarUl = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('ul', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].navbar__menu]);
var ulContainer = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('ul', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].list]);
var wrapperPageOne = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('div', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].wrapperPageOne]);
var wrapperRight = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('div', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].wrapperRight]);
var top = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('img', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].top]);
modalWrapepr.classList.add('exNeolant');
var leftMenuConfig = [
    {
        id: '1',
        label: 'Виды в текущем классе',
        title: (_assets_icon_IconPlus_svg__WEBPACK_IMPORTED_MODULE_3___default())
    },
    {
        id: '2',
        label: 'Коппировать',
        title: (_assets_icon_IconPaste_svg__WEBPACK_IMPORTED_MODULE_2___default())
    }
];
var renderLeftMenu = function () {
    leftMenuConfig.forEach(function (item, i) {
        var categoryItem = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('li', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].navbar__item]);
        categoryItem.onclick = function () {
            insertContent((i + 1).toString());
            glCurrentRightPage.update((i + 1).toString());
        };
        var categoryItemLink = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('div', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].navbar__link]);
        var categoryItemLink_img = (0,_utils_components__WEBPACK_IMPORTED_MODULE_7__.createElementNode)('img', [_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].navbar__link_img]);
        categoryItemLink_img.setAttribute('src', item.title);
        categoryItemLink.append(categoryItemLink_img);
        categoryItem.append(categoryItemLink);
        var label = document.createElement('span');
        label.innerText = item.label;
        categoryItemLink.append(label);
        navbarUl.append(categoryItem);
    });
    wrapperLeft.append(navbarUl);
};
renderLeftMenu();
wrapper.append(wrapperLeft);
wrapper.append(wrapperRight);
top.onclick = function () {
    modalWrapepr.classList.toggle(_contentModalPaste_scss__WEBPACK_IMPORTED_MODULE_9__["default"].modalWrapper__active);
    setTimeout(function () { clearBeforeNode(); }, 1000);
};
top.setAttribute('src', (_assets_icon_IconClose_svg__WEBPACK_IMPORTED_MODULE_1___default()));
modal.append(top);
modal.append(wrapper);
modalWrapepr.append(modal);
documentBody.append(modalWrapepr);
var addStateViewers = function (view) {
    chrome.storage.local.get(["viewersState"], function (result) {
        var allView = result.viewersState && JSON.parse(result.viewersState);
        var saveViewersStorage = Array.isArray(allView) ? allView : [];
        saveViewersStorage.push(view);
        chrome.storage.local.set({
            viewersState: JSON.stringify(saveViewersStorage)
        }, function () {
            console.log("Данные сохранены");
        });
    });
};
var pasteViewers = function (_a) {
    var glViewerForPaste = _a.glViewerForPaste, configPasteEntities = _a.configPasteEntities, glValueIcons = _a.glValueIcons, settingForPaste = _a.settingForPaste, urlValue = _a.urlValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var isApplySettingsCustom, isApplyIconCustom, isApplyNestedEntities, isApplyReWriteIconWithEdit, customSettings;
        return __generator(this, function (_b) {
            isApplySettingsCustom = configPasteEntities.find(function (_) { return _.id === '3'; }).value;
            isApplyIconCustom = configPasteEntities.find(function (_) { return _.id === '4'; }).value;
            isApplyNestedEntities = configPasteEntities.find(function (_) { return _.id === '2'; }).value;
            isApplyReWriteIconWithEdit = configPasteEntities.find(function (_) { return _.id === '5'; }).value;
            customSettings = {
                hideInStructureOfObject: false,
                hideInViewingModel: false,
                SendParams: false,
                hideEmptyFields: false,
                viewMode: 0
            };
            settingForPaste.forEach(function (setting) {
                if (setting.id === 'viewMode') {
                    customSettings[setting.id] = Number(setting === null || setting === void 0 ? void 0 : setting.value);
                    return;
                }
                customSettings[setting.id] = !!(setting === null || setting === void 0 ? void 0 : setting.value);
            });
            // @ts-ignore
            customSettings.Url = urlValue;
            glEntitiesFromPaste.value.forEach(function (entity) { return __awaiter(void 0, void 0, void 0, function () {
                var newViewers, promisesListResponse;
                return __generator(this, function (_a) {
                    if (!entity.isCurrent)
                        if (!isApplyNestedEntities)
                            return [2 /*return*/];
                    newViewers = [];
                    promisesListResponse = [];
                    glViewerForPaste.forEach(function (viewer) { return __awaiter(void 0, void 0, void 0, function () {
                        var settingForPost, IconForPost, dataPost, isHaveViewer, newViwer;
                        return __generator(this, function (_a) {
                            if (!viewer.isSelected)
                                return [2 /*return*/];
                            settingForPost = (isApplySettingsCustom ? __assign(__assign({}, viewer.Settings), customSettings) : viewer.Settings);
                            IconForPost = ((isApplyIconCustom && glValueIcons) ? glValueIcons : viewer.Icon);
                            dataPost = {
                                Caption: viewer.Caption,
                                Icon: IconForPost,
                                Attributes: viewer.Attributes,
                                Name: viewer.Name,
                                Settings: settingForPost
                            };
                            isHaveViewer = entity.Viewers.find(function (_) { return _.Caption === viewer.Caption; });
                            newViwer = (function () { return __awaiter(void 0, void 0, void 0, function () {
                                var dataCreate, response, response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!isHaveViewer) return [3 /*break*/, 2];
                                            dataCreate = __assign(__assign({}, dataPost), { Icon: (isApplyReWriteIconWithEdit && IconForPost) ? IconForPost : isHaveViewer.Icon, Id: isHaveViewer.Id });
                                            return [4 /*yield*/, _services_Entities_service__WEBPACK_IMPORTED_MODULE_8__.EntitiesService.changeViewerInEntities(entity.Id, dataCreate)];
                                        case 1:
                                            response = _a.sent();
                                            newViewers.push(dataCreate);
                                            console.log("\u0418\u0437\u043C\u0435\u043D\u0438\u043B\u0438 \u0432\u0438\u0434: ".concat(dataCreate.Caption, " \u0432 \u043A\u043B\u0430\u0441\u0441\u0435 ").concat(entity.Name));
                                            // console.log("🚀 response add change viewer id ", response)
                                            return [2 /*return*/, dataCreate];
                                        case 2: return [4 /*yield*/, _services_Entities_service__WEBPACK_IMPORTED_MODULE_8__.EntitiesService.pasteViewerInEntities(entity.Id, dataPost)];
                                        case 3:
                                            response = _a.sent();
                                            newViewers.push(__assign(__assign({}, dataPost), { Id: response.Id }));
                                            console.log("\u0421\u043E\u0437\u0434\u0430\u043B\u0438 \u0432\u0438\u0434: ".concat(dataPost.Caption, " \u0432 \u043A\u043B\u0430\u0441\u0441\u0435 ").concat(entity.Name));
                                            // console.log("🚀 response add new viewer id ", response)
                                            return [2 /*return*/, __assign(__assign({}, dataPost), { Id: response.Id })];
                                    }
                                });
                            }); })();
                            promisesListResponse.push(newViwer);
                            return [2 /*return*/];
                        });
                    }); });
                    Promise.all(promisesListResponse).then(function (e) { return __awaiter(void 0, void 0, void 0, function () {
                        var currentOrder, orderHash, responseOrdert;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    currentOrder = __spreadArray([], entity.Viewers, true);
                                    glViewerForPaste.forEach(function (viewer) { return __awaiter(void 0, void 0, void 0, function () {
                                        var newViewer, order;
                                        var _a;
                                        return __generator(this, function (_b) {
                                            if (!viewer.isSelected)
                                                return [2 /*return*/];
                                            newViewer = e.find(function (item) { return item.Caption === viewer.Caption; });
                                            order = ((_a = glViewerForPaste.find(function (_) { return _.Caption === newViewer.Caption; })) === null || _a === void 0 ? void 0 : _a.order) || 0;
                                            currentOrder.splice(order - 1, 0, newViewer);
                                            return [2 /*return*/];
                                        });
                                    }); });
                                    orderHash = {};
                                    currentOrder.forEach(function (_, ind) { return orderHash[_.Id] = ind; });
                                    return [4 /*yield*/, _services_Entities_service__WEBPACK_IMPORTED_MODULE_8__.EntitiesService.changeOrderPosition(entity.Id, orderHash)];
                                case 1:
                                    responseOrdert = _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
                });
            }); });
            return [2 /*return*/];
        });
    });
};
function insertContent(pageId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    wrapperRight.innerHTML = '';
                    _b = (_a = wrapperRight).append;
                    return [4 /*yield*/, getHtml(pageId || glCurrentRightPage.value)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}
var getHtml = function (idPage) { return __awaiter(void 0, void 0, void 0, function () {
    var component;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(idPage === '1')) return [3 /*break*/, 2];
                return [4 /*yield*/, (0,_screens_OneScreenCopyModal_OneScreenCopyModal__WEBPACK_IMPORTED_MODULE_4__["default"])({
                        addStateViewers: addStateViewers,
                        glEntitiesFromPaste: glEntitiesFromPaste,
                        glViewerForPaste: glViewerForPaste,
                        ulContainer: ulContainer,
                        wrapperPageOne: wrapperPageOne
                    })];
            case 1:
                component = _a.sent();
                return [2 /*return*/, component];
            case 2:
                if (idPage === '2') {
                    return [2 /*return*/, (0,_screens_TwoScreenCopyModal_TwoScreenCopyModal__WEBPACK_IMPORTED_MODULE_5__["default"])({
                            changeSelectedToggleiewer: changeSelectedToggleiewer,
                            deleteView: deleteView,
                            glIcons: glIcons,
                            glViewerForPaste: glViewerForPaste,
                            modalWrapepr: modalWrapepr,
                            pasteViewers: pasteViewers,
                            changeOrderViewerInEntities: changeOrderViewerInEntities
                        })];
                }
                return [2 /*return*/, ''];
        }
    });
}); };

})();

/******/ })()
;
//# sourceMappingURL=contentModalPaste.js.map