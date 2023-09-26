import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  entitiesSliceReducer,
  viewerForPasteReducer
} from '@/shared/model/slice';

const rootReducer = combineReducers({
  entities: entitiesSliceReducer,
  viewerForPaste: viewerForPasteReducer
});
export const createStore = (initState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initState
  });
};
export const storeRedux = createStore();

export type RootStoreType = ReturnType<typeof storeRedux.getState>;
export type AppDispatch = typeof storeRedux.dispatch;
