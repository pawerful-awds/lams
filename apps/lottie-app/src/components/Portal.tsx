import React from "react";
import ReactDOM from "react-dom";

export interface IPortalProps extends React.PropsWithChildren {
  container?: HTMLElement;
}

export const Portal = ({ children, container }: IPortalProps) => {
  const [mounted, setMounted] = React.useState(false);
  const portal = React.useRef<React.ReactPortal>();

  React.useEffect(() => {
    const mountNode = container || document.body;
    portal.current = ReactDOM.createPortal(children, mountNode) || null;
    setMounted(true);

    return () => {
      portal.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return mounted ? portal.current : null;
};
