import { configureStore } from "@reduxjs/toolkit";

import animationsReducer from "./features/animations";
import connectivityReducer from "./features/connectivity";
import { gqlApi, gqlUploadApi } from "./services/gql";

const store = configureStore({
  reducer: {
    animations: animationsReducer,
    connectivity: connectivityReducer,
    [gqlApi.reducerPath]: gqlApi.reducer,
    [gqlUploadApi.reducerPath]: gqlUploadApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gqlApi.middleware, gqlUploadApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
