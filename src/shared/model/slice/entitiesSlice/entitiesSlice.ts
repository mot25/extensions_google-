import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootStoreType } from '@/app';
import { EntitiesType } from '@/type/entities.dto';

type initialStateType = {
  entitiesForPaste: EntitiesType[];
};
const initialState: initialStateType = {
  entitiesForPaste: []
};
const entitiesSlice = createSlice({
  initialState,
  name: 'entities',
  reducers: {
    setEntitiesForPaste: (state, action: PayloadAction<EntitiesType[]>) => {
      state.entitiesForPaste = action.payload;
    }
  }
});
export const { setEntitiesForPaste } = entitiesSlice.actions;
export const entitiesSliceReducer = entitiesSlice.reducer;

// selector
export const entitiesAllSelector = (store: RootStoreType) =>
  store.entities.entitiesForPaste;
