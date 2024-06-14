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
          Connectivity: {isOnline ? "online 🟢" : "offline 🔴"}
        </small>
        <FileUpload />
      </Header>
      <main className="flex flex-col w-full flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
