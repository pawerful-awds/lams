import { configureStore } from "@reduxjs/toolkit";

import animationsReducer from "./features/animations";
import { gqlApi } from "./services/gql";

const store = configureStore({
  reducer: {
    animations: animationsReducer,
    [gqlApi.reducerPath]: gqlApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gqlApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
