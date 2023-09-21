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
const store = createStore();

export type RootStoreType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
