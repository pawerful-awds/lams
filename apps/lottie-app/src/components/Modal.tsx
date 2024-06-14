import React from "react";
import { motion } from "framer-motion";

import { Portal } from "./Portal";
import { Backdrop } from "./Backdrop";

const slideLeft = {
  hidden: {
    x: "100vw",
    opacity: 0,
  },
  visible: {
    x: "0",
    opacity: 1,
    transition: {
      duration: 1,
      type: "spring",
      damping: 50,
      stiffness: 400,
    },
  },
  exit: {
    y: "100vw",
    opacity: 0,
  },
};

export interface IModalProps extends React.PropsWithChildren {
  handleClose?: () => void;
}

function ModalContent({ children }: React.PropsWithChildren) {
  return (
    <>
      <motion.div
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="fixed bottom-0 right-0 w-auto max-w-[500px] h-full flex pt-6 px-4 items-center flex-col justify-start bg-white  drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
        variants={slideLeft}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="overflow-y-auto w-full pb-8">{children}</div>
      </motion.div>
    </>
  );
}

export const Modal = ({ handleClose, children }: IModalProps) => {
  React.useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  return (
    <Portal>
      <Backdrop onClick={() => handleClose?.()}>
        <ModalContent>{children}</ModalContent>
      </Backdrop>
    </Portal>
  );
};
