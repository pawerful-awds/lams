import React from "react";

import { TTransformedGetAnimationsResponse } from "../../rdx/services/gql";
import { AnimationItemDetail } from "./AnimationItemDetail";

export interface IAnimationListProps {
  data: TTransformedGetAnimationsResponse | undefined;
}

export const AnimationList: React.FC<IAnimationListProps> = ({ data }) => {
  if (!data) return null;
  return (
    <section className="gap-4 w-full flex-wrap grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7">
      {data.map(({ id, title, animationData }) => {
        return (
          <div key={id} className="">
            <AnimationItemDetail
              id={id}
              title={title}
              animationData={animationData}
            />
          </div>
        );
      })}
    </section>
  );
};
