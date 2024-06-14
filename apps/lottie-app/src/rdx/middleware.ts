import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";

import { gqlUploadApi } from "./services/gql";
import { setOnlineStatus } from "./features/connectivity";
import { clearQueue } from "./features/animations";
import { getUploadQueue, clearUploadQueue } from "./cache";
import { AppDispatch } from "./store";

export const offlineUploadMiddleware: Middleware =
  (api: MiddlewareAPI<AppDispatch>) => (next) => async (action: TODO) => {
    // Check if online
    if (action.type === setOnlineStatus.type && action.payload === true) {
      const queue = getUploadQueue();
      for (const upload of queue) {
        await api
          .dispatch(gqlUploadApi.endpoints.uploadAnimation.initiate(upload))
          .unwrap();
      }
      // once uploaded clear them from state and queue
      api.dispatch(clearQueue());
      clearUploadQueue();
    }
    return next(action);
  };

export const loggerMiddleware: Middleware =
  (store: MiddlewareAPI<AppDispatch>) => (next) => (action: TODO) => {
    console.groupCollapsed(`LAMS logger -> ${action.type}`);
    console.log("# Dispatching action:", action);
    const result = next(action);
    console.log("# State after action:", store.getState());
    console.groupEnd();
    return result;
  };
