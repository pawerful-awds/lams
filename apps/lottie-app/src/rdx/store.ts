import { configureStore } from "@reduxjs/toolkit";

import animationsReducer, {
  offlineAnimationQueueReducer,
} from "./features/animations";
import connectivityReducer from "./features/connectivity";
import { gqlApi, gqlUploadApi } from "./services/gql";
import { loggerMiddleware, offlineUploadMiddleware } from "./middleware";

const store = configureStore({
  reducer: {
    [gqlApi.reducerPath]: gqlApi.reducer,
    [gqlUploadApi.reducerPath]: gqlUploadApi.reducer,
    animations: animationsReducer,
    connectivity: connectivityReducer,
    offlineAnimationsQueue: offlineAnimationQueueReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      gqlApi.middleware,
      gqlUploadApi.middleware,
      loggerMiddleware,
      offlineUploadMiddleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
