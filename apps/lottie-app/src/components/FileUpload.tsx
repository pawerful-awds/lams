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
    <div className="flex flex-col justify-center items-center rounded-md bg-subject-primary p-2 px-4 cursor-pointer">
      <label
        htmlFor="fileUpload"
        className="block font-medium text-white cursor-pointer"
      >
        Upload Animation
      </label>
      <input
        id="fileUpload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      {/* <div className="flex flex-col text-[0.8rem] text-white">
        {file && <div key={file.name}>{file.name}</div>}
        {!file && <p className="text-white">No files selected</p>}
      </div> */}
    </div>
  );
};
