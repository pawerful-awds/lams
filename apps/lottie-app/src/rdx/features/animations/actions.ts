import { Dispatch } from "@reduxjs/toolkit";

import { validateLottieJSONFile } from "@/utils";
import { getUploadQueue, getAnimationsFromCache } from "../../cache";
import { setQueue, TAnimationUpload } from "./offlineQueue.slice";

export const syncQueueToState = () => async (dispatch: Dispatch) => {
  const queue = getUploadQueue();
  if (queue) {
    const initialList: TAnimationUpload[] = [];
    const queueData = queue.reduce<Promise<TAnimationUpload[]>>(
      async (prev, curr) => {
        const acc = await prev;
        const validFile = await validateLottieJSONFile(curr.file as File);
        if (validFile.isValid) {
          const createdAt = Date.now();
          acc.push({
            id: curr.id ?? `off-id-${createdAt}`,
            metadata: curr.metadata,
            title: curr.title,
            animationData: validFile.data ?? null,
            createdAt: curr.createdAt ?? createdAt,
          });
        }
        return acc;
      },
      Promise.resolve(initialList)
    );

    const payload = await Promise.resolve(queueData);
    console.log("# queueData", payload);

    dispatch(setQueue(payload));
  }
};

export const getDetailsFromQueueById = async (id: string) => {
  const hasOffId = /^off-id/.test(id);
  if (hasOffId) {
    const queue = getUploadQueue();
    const details = queue.find((a) => a.id === id);
    if (details) {
      const validFile = await validateLottieJSONFile(details.file);
      if (validFile.isValid) {
        return {
          ...details,
          metadata: validFile.data?.metadata ?? null,
          animationData: validFile.data,
        };
      }
    }
  } else {
    const details = getAnimationsFromCache();
    if (details) {
      return details.find((a) => a.id === id);
    }
  }
  return null;
};
