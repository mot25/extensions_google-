import { ViewerType } from '@/shared/type';

export const addStateViewers = (view: ViewerType) => {
  chrome.storage.local.get(['viewersState'], function (result) {
    const allView = result.viewersState && JSON.parse(result.viewersState);
    const saveViewersStorage = Array.isArray(allView) ? allView : [];
    saveViewersStorage.push(view);
    chrome.storage.local.set({
      viewersState: JSON.stringify(saveViewersStorage)
    });
  });
};
