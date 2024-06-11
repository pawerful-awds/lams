import { Storage } from "../utils";

import { TAnimationsQueryBaseResponse } from "./services/gql";

export const ANIMATIONS_KEY = "lams";
export const animationStorage = new Storage<{
  animations: TAnimationsQueryBaseResponse[];
  queue: TODO[];
}>(ANIMATIONS_KEY);

export const saveAnimationsToCache = (animations: TODO) => {
  animationStorage.setItem("animations", animations);
};

export const getAnimationsFromCache = () => {
  const result = animationStorage.getItem("animations");
  return result?.animations ?? [];
};

// QUEUE Storage
export const queueStorage = new Storage<TODO[]>(`${ANIMATIONS_KEY}:queue`);

export const saveUploadToQueue = (upload: TODO) => {
  const queue = getUploadQueue();
  queue.push(upload);
  queueStorage.setItem("list", queue);
};

export const getUploadQueue = () => {
  const result = queueStorage.getItem("list");
  return result ?? [];
};

export const clearUploadQueue = () => {
  queueStorage.removeItem("list");
};
