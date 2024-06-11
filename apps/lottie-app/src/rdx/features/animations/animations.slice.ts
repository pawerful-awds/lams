import { createSlice } from "@reduxjs/toolkit";

export type TAnimationState = {
  list: string[];
};

export const initialState = {
  list: [],
} as TAnimationState;

export const animations = createSlice({
  name: "animations",
  initialState,
  reducers: {
    reset: () => {
      return { ...initialState };
    },
  },
  // extraReducers: (builder) => {
  //   // TODO: add async reducers here eg. getAnimations, uploadAnimations and etc
  // },
});

export const { reset } = animations.actions;
export default animations.reducer;
