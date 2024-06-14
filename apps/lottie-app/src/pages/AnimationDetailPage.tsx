import React from "react";
import { useParams } from "react-router-dom";

import { useGetAnimationQuery } from "@/rdx/services/gql";
import { AnimationItemDetail, Loader } from "@/components";

const AnimationDetail: React.FC = () => {
  const { animationId } = useParams<{ animationId: string }>();
  const { data, error, isLoading } = useGetAnimationQuery({
    id: animationId ?? "",
  });

  return (
    <div className="flex flex-col p-4">
      <h2 className="flex flex-col text-subject-base font-semibold text-2xl text-left">
        Animation Detail
        <span className="text-[0.8em]">{animationId}</span>
      </h2>

      <div className="flex justify-center w-full py-4">
        {isLoading && <Loader />}
        {data && (
          <AnimationItemDetail
            id={data.id ?? "ID not found"}
            title={data.title}
            animationData={data.animationData}
            animationShouldAutoPlay
          />
        )}
        {error && <p>{JSON.stringify(error)}</p>}
      </div>
    </div>
  );
};

export default AnimationDetail;
