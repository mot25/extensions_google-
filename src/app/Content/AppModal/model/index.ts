import { usageDispatch } from '@/shared/lib/hooks';
import { setEntitiesForPaste, setViewerForPaste } from '@/shared/model/slice';
import { ViewerType } from '@/shared/type';

export const getPostEntitiesForPasteInsert = () => {
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === 'postEntitiesForPasteInsert') {
      usageDispatch(setEntitiesForPaste(request.payload));
    }
  });
};

export const getViewersStateFromStorage = () => {
  chrome.storage.local.get(['viewersState'], function (result) {
    const allView = result.viewersState && JSON.parse(result.viewersState);
    const saveViewersStorage: ViewerType[] = Array.isArray(allView)
      ? allView
      : [];
    usageDispatch(setViewerForPaste(saveViewersStorage));
  });
};
export const subscribeViewersStateFromStorage = () => {
  chrome.storage.onChanged.addListener(changes => {
    for (const [, { newValue }] of Object.entries(changes)) {
      if (!newValue) return;
      const viewers = JSON.parse(newValue);
      usageDispatch(setViewerForPaste(viewers));
    }
  });
};
