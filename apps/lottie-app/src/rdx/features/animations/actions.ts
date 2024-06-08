import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAnimations = createAsyncThunk(
  "animations/getAnimations",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("/graphql", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        error: "Something wrong with the request [Fetching list of animations]",
      });
    }
  }
);
