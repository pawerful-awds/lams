import { Storage } from "../utils";

import { TAnimationsQueryBaseResponse } from "./services/gql";

export const ANIMATIONS_KEY = "lams";
export const animationStorage = new Storage<TAnimationsQueryBaseResponse[]>(
  ANIMATIONS_KEY
);

function encodeFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const b64 = reader.result?.toString();
      if (b64) {
        resolve(b64.split(",")[1]); // Remove "data:image/png;base64," prefix
      } else {
        reject(new Error("Failed to read file as base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

function decodeBase64ToFile(
  b64: string,
  fileName: string,
  fileType: string = ""
): File {
  const byteCharacters = atob(b64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], fileName, { type: fileType });
}

export const saveAnimationsToCache = (animations: TODO) => {
  animationStorage.setItem("animations", animations);
};

export const getAnimationsFromCache = () => {
  const result = animationStorage.getItem("animations");
  return result ?? [];
};

// QUEUE Storage
export const queueStorage = new Storage<TODO[]>(`${ANIMATIONS_KEY}:queue`);

export const saveUploadToQueue = (upload: TODO) => {
  const queue = getUploadQueue();
  encodeFileToBase64(upload.file)
    .then((base64Data) => {
      queue.push({
        ...upload,
        b64: base64Data,
        fileType: upload.file.type,
        fileName: upload.file.name,
      });
      queueStorage.setItem("list", queue);
    })
    .catch((error) => {
      console.error("Failed to encode file to base64:", error);
    });
};

export const getUploadQueue = () => {
  const result = queueStorage.getItem("list");
  return (
    result?.map((o) => ({
      metadata: o.metadata,
      title: o.title,
      file: decodeBase64ToFile(o.b64, o.fileName, o.fileType),
    })) ?? []
  );
};

export const clearUploadQueue = () => {
  queueStorage.removeItem("list");
  queueStorage.clear();
};
