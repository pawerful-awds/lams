import React from "react";
import { useUploadAnimationMutation } from "../rdx/services/gql";

export interface IFileUploadProps {
  children: string;
}

export const FileUpload: React.FC<IFileUploadProps> = ({ children }) => {
  const [uploadAnimation] = useUploadAnimationMutation();
  const [file, setFile] = React.useState<File | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      try {
        await uploadAnimation({
          metadata: "",
          file,
        }).unwrap();
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
    setFile(file);
  };

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
