import { createSlice } from '@reduxjs/toolkit';

import { RootStoreType } from '@/app';
import { ViewerType } from '@/type/entities.dto';

type initialStateType = {
  viewerForPaste: ViewerType[];
};
const initialState: initialStateType = {
  viewerForPaste: []
};
const slice = createSlice({
  initialState,
  name: 'sliceAppModalPaste',
  reducers: {
    setViewerForPaste: (state, action) => {
      state.viewerForPaste = action.payload;
    }
  }
});

export const { setViewerForPaste } = slice.actions;

export const viewerForPasteReducer = slice.reducer;

export const viewerForPasteSelector = (state: RootStoreType) =>
  state.viewerForPaste.viewerForPaste;
