import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TConnectivityState = {
  isOnline: boolean;
};

export const initialState = {
  isOnline: navigator.onLine,
} as TConnectivityState;

export const connectivity = createSlice({
  name: "connectivity",
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
  },
});

export const { setOnlineStatus } = connectivity.actions;
export default connectivity.reducer;
