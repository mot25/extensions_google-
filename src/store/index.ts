import { combineReducers, configureStore } from '@reduxjs/toolkit';

import entitiesSlice from './slice/entitiesSlice/entitiesSlice';

const rootReducer = combineReducers({
  entities: entitiesSlice
});
export const createStore = (initState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initState
  });
};
const store = createStore();

export type RootStoreType = ReturnType<typeof store.getState>;
