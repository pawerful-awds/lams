import React from "react";

import { useAppDispatch, useAppSelector } from "@/rdx/hooks";
import { setOnlineStatus } from "@/rdx/features/connectivity/connectivity.slice";

export const useConnectivity = () => {
  const dispatch = useAppDispatch();
  const isOnline = useAppSelector((state) => state.connectivity.isOnline);

  React.useEffect(() => {
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (navigator.onLine) {
      handleOnline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isOnline,
  };
};
