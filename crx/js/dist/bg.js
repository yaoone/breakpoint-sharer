/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ({

/***/ 8:
/***/ function(module, exports) {

/**
 * store all breakpoints
 */
let allBreakpoints = [];
let targetTab = null
let debuggerWindow = null;

chrome.browserAction.onClicked.addListener((tab) => {
    if (debuggerWindow){
        alert('Debugger Window is already displayed');
    } else {
        let debuggee = {tabId: tab.id};
        targetTab = tab;
        chrome.debugger.attach(debuggee, '1.0', () => {
            debuggerWindow = chrome.windows.create({
                url: `debugger.html?tabId=${tab.id}`,
                type: 'popup',
                width: 600,
                height: 700
            }, (a) => {
                debuggerWindow = a;
            });
        });
    }
});

chrome.debugger.onEvent.addListener((debuggeeId, method) => {
    //
});

chrome.debugger.onDetach.addListener((debuggeeId) => {
    allBreakpoints.splice(0);
    debuggerWindow = null;
    targetTab = null;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.msg === "GET_ALL_BREAKPOINTS"){
        sendResponse(allBreakpoints);
    } else if (request.msg === 'SYNC_ALL_BREAKPOINTS'){
        allBreakpoints = request.breakpoints;
    }
});

chrome.windows.onRemoved.addListener((windowId) => {
    if (debuggerWindow.id === windowId){
        chrome.debugger.detach({tabId: targetTab.id}, (result) => {
            debuggerWindow = null;
            targetTab = null;
        });
    }
});


/***/ }

/******/ });