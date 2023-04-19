chrome.tabs.onActivated.addListener((tab) => {
    chrome.tabs.get(tab.tabId, async (currentTab) => {
        await chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['content2.js']
        })
    })
})