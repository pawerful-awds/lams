import { configureStore } from "@reduxjs/toolkit";

import animationsReducer from "./features/animations";

const store = configureStore({
  reducer: {
    animations: animationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
