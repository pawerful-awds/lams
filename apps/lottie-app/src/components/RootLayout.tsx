import React from "react";
import { Outlet } from "react-router-dom";

import { FileUpload } from "./FileUpload";
import { useConnectivity } from "./hooks";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const RootLayout: React.FC = () => {
  const { isOnline } = useConnectivity();
  return (
    <>
      <Header>
        <small className="text-black">
          Connectivity: {isOnline ? "is online 🟢" : "is offline 🔴"}
        </small>
        <FileUpload>Upload animation</FileUpload>
      </Header>
      <main className="flex flex-col w-full ">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
