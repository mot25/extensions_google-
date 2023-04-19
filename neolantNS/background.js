
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.action.setBadgeText({
//         text: 'OFF'
//     });
// });

// const extensions = 'https://developer.chrome.com/docs/extensions';
// const webstore = 'https://developer.chrome.com/docs/webstore';

// // When the user clicks on the extension action
// chrome.action.onClicked.addListener(async (tab) => {
//     console.log("🚀 ~ tab:", tab)

//     if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
//         // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
//         const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

//         // Next state will always be the opposite
//         const nextState = prevState === 'ON' ? 'OFF' : 'ON';

//         // Set the action badge to the next state
//         await chrome.action.setBadgeText({
//             tabId: tab.id,
//             text: nextState
//         });

//         if (nextState === 'ON') {
//             // Insert the CSS file when the user turns the extension on
//             await chrome.scripting.insertCSS({
//                 files: ['focus-mode.css'],
//                 target: { tabId: tab.id }
//             });
//         } else if (nextState === 'OFF') {
//             // Remove the CSS file when the user turns the extension off
//             await chrome.scripting.removeCSS({
//                 files: ['focus-mode.css'],
//                 target: { tabId: tab.id }
//             });
//         }
//     }
// });

// chrome.tabs.query({ active: true }, function (tabs) {
//     // получаем объект текущей вкладки
//     var currentTabs = tabs;
//     var currentTab = tabs[0];
//     // выводим информацию о текущей вкладке в консоль
//     console.log(currentTabs);
// });

// chrome.action.onClicked.addListener((tab) => {
//     console.log("🚀 ~ tab1 :", tab)

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ['content_cloneall.js']
//     });
// });

// chrome.runtime.onMessage.addListener((msg, sender, res) => {
//     console.log("🚀 ~ res:", res)

//     console.log("🚀 ~ sender:", sender)

//     console.log("🚀 ~ msg:", msg)


//     chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//         console.log("🚀 ~ tabs:", tabs2)

//         if (msg.from == 'popup') {

//             if (msg.mode == 'cloneobj') {

//                 chrome.scripting.executeScript({
//                     target: { tabId: tabs[0].id },
//                     files: ['content_clone.js']
//                 });

//             }
//             if (msg.mode == 'cloneallobj') {

//                 // chrome.scripting.executeScript({
//                 //     target: { tabId: tabs[0].id },
//                 //     files: ['content_cloneall.js']
//                 // });

//             }
//             if (msg.mode == 'cloneview') {

//                 try {
//                     chrome.storage.local.set({ updateTextTo: 'fdfdfdf' });


//                     chrome.scripting.executeScript({
//                         target: { tabId: tabs[0].id },
//                         files: ['content_cloneview.js'],

//                     });
//                 } catch (err) {
//                     console.error(`failed to execute script: ${err}`);
//                 }

//             }
//         }

//     });

// });
