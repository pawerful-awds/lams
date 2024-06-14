import { Dispatch } from "@reduxjs/toolkit";

import { apiBaseUrl } from "@/config";
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

export const downloadAnimationFile = async (id: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/v1/download/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Oops, something is wrong with the download");
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    let fileName = "animation";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match && match.length === 2) {
        fileName = match[1];
      }
    }

    // Prepare for the blob and link it to <a>
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", fileName);

    // Append link to the body
    document.body.appendChild(link);
    // Trigger the download by simulating to click the link
    link.click();

    // Remove the link and bloburl
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};
