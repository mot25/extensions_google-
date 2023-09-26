export const addHotReload = () => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      const currentTabId = tabs[0].id;

      await chrome.scripting.executeScript({
        target: { tabId: currentTabId },
        files: ['hotReloadNS.js']
      });
    }
  );
};
