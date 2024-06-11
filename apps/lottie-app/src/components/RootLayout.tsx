import React from "react";
import { Outlet } from "react-router-dom";

import { FileUpload } from "./FileUpload";
import { useConnectivity } from "./hooks";

export const RootLayout: React.FC = () => {
  const { isOnline } = useConnectivity();
  return (
    <>
      <header>
        Header here
        <FileUpload>Upload animation</FileUpload>
      </header>
      <main>
        <small>Connectivity: {isOnline ? "is online" : "is offline"}</small>
        <Outlet />
      </main>
      <footer>Footer here</footer>
    </>
  );
};
