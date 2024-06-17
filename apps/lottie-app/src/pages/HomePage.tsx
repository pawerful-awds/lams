import React from "react";

import { useGetAnimationsQuery } from "@/rdx/services/gql";
import { Loader, AnimationList, useGetOfflineQueueData } from "@/components";

const HomePage: React.FC = () => {
  const { data: getAnimationsData, isLoading } = useGetAnimationsQuery();
  const { data: offlineData } = useGetOfflineQueueData();

  return (
    <div className="flex flex-col p-4 min-h-full">
      <h2 className="text-subject-base font-semibold text-2xl text-left">
        Welcome to LAMS
      </h2>

      <div className="flex flex-1 flex-col gap-4 justify-center w-full py-4 h-full">
        {isLoading ? (
          <Loader />
        ) : (
          <AnimationList
            offlineData={offlineData.queue}
            data={getAnimationsData}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
