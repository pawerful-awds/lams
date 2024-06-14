import React from "react";

import { getUploadQueue } from "../../rdx/cache";
import { validateLottieJSONFile } from "../../utils";
import { TTransformedGetAnimationsResponse } from "../../rdx/services/gql";

export const useGetOfflineQueueData = () => {
  const queue = getUploadQueue();
  const [offlineData, setOfflineData] =
    React.useState<TTransformedGetAnimationsResponse>();

  const getOfflineData = React.useMemo(
    () => () => {
      queue.forEach(({ file, ...d }) => {
        validateLottieJSONFile(file).then(async ({ isValid, data }) => {
          if (isValid) {
            setOfflineData((prevState) => {
              const createdAt = Date.now();
              return [
                ...(prevState ?? []),
                {
                  id: `off-id-${createdAt}`,
                  metadata: d.metadata,
                  title: d.title,
                  animationData: data ?? null,
                  createdAt: createdAt,
                },
              ];
            });
          } else {
            throw new Error("Uploaded file is not a valid lottie json");
          }
        });
      });
    },
    [queue]
  );

  React.useEffect(() => {
    void getOfflineData();
  }, [getOfflineData]);

  return {
    offlineData,
  };
};
