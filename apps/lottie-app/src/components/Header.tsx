import React from "react";
import { Link } from "react-router-dom";

export interface IHeaderProps extends React.PropsWithChildren {}

export const Header: React.FC<IHeaderProps> = ({ children }) => {
  return (
    <header className="flex justify-between items-center bg-white w-full p-4 border-b border-stroke-neutral h-[64px] z-10">
      <Link to="/">
        <img src="/images/lottie-logo.svg" alt="Lottie Logo" />
      </Link>
      <div className="flex items-center gap-4">{children}</div>
    </header>
  );
};
