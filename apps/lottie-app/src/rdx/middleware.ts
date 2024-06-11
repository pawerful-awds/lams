import { Middleware } from "@reduxjs/toolkit";

import { setOnlineStatus } from "./features/connectivity";
import { gqlUploadApi } from "./services/gql";
import { getUploadQueue, clearUploadQueue } from "./cache";
import { AppDispatch } from "./store";

export const offlineUploadMiddleware: Middleware =
  (api: { dispatch: AppDispatch }) => (next) => async (action: any) => {
    if (action.type === setOnlineStatus.type && action.payload === true) {
      const queue = getUploadQueue();
      for (const upload of queue) {
        await api
          .dispatch(gqlUploadApi.endpoints.uploadAnimation.initiate(upload))
          .unwrap();
      }
      clearUploadQueue();
    }
    return next(action);
  };
