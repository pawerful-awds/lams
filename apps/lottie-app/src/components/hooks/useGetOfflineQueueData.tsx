import { useAppSelector } from "@/rdx/hooks";

export const useGetOfflineQueueData = () => {
  const offlineData = useAppSelector((state) => state.offlineAnimationsQueue);
  return {
    data: offlineData,
  };
};
