import React from "react";

import { useUploadAnimationMutation } from "../rdx/services/gql";
import { clearUploadQueue, getUploadQueue } from "../rdx/cache";
import { validateLottieJSONFile } from "../utils";

export interface IFileUploadProps {
  children: string;
}

export type TUploadObject = {
  file: File;
  title: string;
  metadata: TODO;
};

export const FileUpload: React.FC<IFileUploadProps> = ({ children }) => {
  const [uploadAnimation] = useUploadAnimationMutation();
  const [file, setFile] = React.useState<File | null>(null);

  async function validateAndUpload(upload: TUploadObject): Promise<void>;
  async function validateAndUpload(file: File): Promise<void>;
  async function validateAndUpload(
    payload: File | TUploadObject
  ): Promise<void> {
    const file = payload && "file" in payload ? payload.file : payload;
    try {
      const { name } = file;
      validateLottieJSONFile(file).then(async ({ isValid, data }) => {
        if (isValid) {
          await uploadAnimation({
            title: name,
            metadata: data?.meta ? JSON.stringify(data?.meta) : "",
            file,
          }).unwrap();
        } else {
          throw new Error("Uploaded file is not a valid lottie json");
        }
      });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Validate and upload the animation
    if (event.target.files && event.target.files?.length > 0) {
      const file = event.target.files?.[0];
      await validateAndUpload(file);
      setFile(file);
    }
  };

  const uploadAnimationFromQueue = async () => {
    const uploadQueue = getUploadQueue();
    try {
      for (const uploadAnimation of uploadQueue) {
        // Upload item to server
        await validateAndUpload(uploadAnimation);
      }
      // Clear the queue after all items are uploaded
      clearUploadQueue();
      console.log("Upload queue cleared");
    } catch (error) {
      console.error("Error uploading files from queue:", error);
    }
  };

  React.useEffect(() => {
    window.addEventListener("online", () => {
      // When online, upload animations from the queue and clear the queue
      uploadAnimationFromQueue();
    });
  }, []);

  return (
    <div className="flex">
      <label
        htmlFor="fileInput"
        className="block mb-2 font-medium text-gray-700"
      >
        {`${children}:`}
      </label>
      <input
        id="fileInput"
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col space-y-2">
        {file && <div key={file.name}>{file.name}</div>}
        {!file && <p className="text-gray-500">No files selected</p>}
      </div>
    </div>
  );
};
