import React from "react";
import { useParams } from "react-router-dom";

import { AnimationItemDetail } from "../components";
import { useGetAnimationQuery } from "../rdx/services/gql";

const AnimationDetail: React.FC = () => {
  const { animationId } = useParams<{ animationId: string }>();
  const { data, error, isLoading } = useGetAnimationQuery({
    id: animationId ?? "",
  });

  return (
    <div>
      <h2>Animation Detail</h2>
      <p>Animation ID: {animationId}</p>
      {isLoading && <p>Loading..</p>}
      {data && (
        <AnimationItemDetail
          id={data.id}
          title={data.title}
          animationData={data.animationData}
          animationShouldAutoPlay
        />
      )}
      {error && <p>{JSON.stringify(error)}</p>}
    </div>
  );
};

export default AnimationDetail;
