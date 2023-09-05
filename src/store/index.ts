import { combineReducers, configureStore } from '@reduxjs/toolkit';

import entitiesSlice from './slice/entitiesSlice';

const rootReducer = combineReducers({
  [entitiesSlice.name]: entitiesSlice.reducer
});
const store = configureStore({ reducer: rootReducer });

export type RootStoreType = ReturnType<typeof store.getState>;

export default store;
