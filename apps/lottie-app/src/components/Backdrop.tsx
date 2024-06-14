import React from "react";
import classnames from "classnames";
import { motion } from "framer-motion";

export interface IBackdropProps extends React.PropsWithChildren {
  onClick: () => void;
}

export const Backdrop = ({ onClick, children }: IBackdropProps) => {
  const _Backdrop = classnames(
    "fixed p-4 top-0 bottom-0 left-0 right-0 w-full h-full z-[1000] flex items-center justify-center bg-white/90"
  );
  return (
    <>
      <motion.div
        onClick={onClick}
        className={_Backdrop}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </>
  );
};
