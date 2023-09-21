export const getPostEntitiesForPasteInsert = () => {
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === 'postEntitiesForPasteInsert') {
      dispatch(setEntitiesForPaste(request.payload));
    }
  });
};

export const getViewersStateFromStorage = () => {
  chrome.storage.local.get(['viewersState'], function (result) {
    const allView = result.viewersState && JSON.parse(result.viewersState);
    const saveViewersStorage: ViewerType[] = Array.isArray(allView)
      ? allView
      : [];
    setViewerForPaste(saveViewersStorage);
  });
};
export const subscribeViewersStateFromStorage = () => {
  chrome.storage.onChanged.addListener(changes => {
    for (const [, { newValue }] of Object.entries(changes)) {
      if (!newValue) return;
      const viewers = JSON.parse(newValue);
      setViewerForPaste(viewers);
    }
  });
};
