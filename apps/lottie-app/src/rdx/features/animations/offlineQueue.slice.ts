import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TAnimationResponse } from "../../services/gql";

export type TAnimationUpload = TAnimationResponse & {
  file?: File;
};

export interface OfflineAnimationQueueState {
  queue: TAnimationUpload[];
}

const initialState: OfflineAnimationQueueState = {
  queue: [],
};

const offlineAnimationQueueSlice = createSlice({
  name: "offlineAnimationQueue",
  initialState,
  reducers: {
    addToQueue: (state, action: PayloadAction<TAnimationUpload>) => {
      state.queue.push(action.payload);
    },

    setQueue: (state, action: PayloadAction<TAnimationUpload[]>) => {
      state.queue = action.payload;
    },

    clearQueue: (state) => {
      state.queue = [];
    },
  },
});

export const { addToQueue, setQueue, clearQueue } =
  offlineAnimationQueueSlice.actions;
export default offlineAnimationQueueSlice.reducer;
