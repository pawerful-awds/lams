import { Dispatch } from "@reduxjs/toolkit";

import { validateLottieJSONFile } from "@/utils";
import { getUploadQueue } from "../../cache";
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
