import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  list: [],
};

export const animations = createSlice({
  name: "animations",
  initialState,
  reducers: {
    reset: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // TODO: add async reducers here eg. getAnimations, uploadAnimations and etc
  },
});

export const { reset } = animations.actions;
export default animations.reducer;
