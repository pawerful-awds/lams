import React from "react";

import { TTransformedGetAnimationsResponse } from "@/rdx/services/gql";
import { AnimationItemDetail } from "./AnimationItemDetail";
import { Pill } from "../Pill";

import IconWorkspace from "@/assets/icon-workspace.svg";
import IconDraft from "@/assets/icon-draft.svg";

export interface IAnimationListProps {
  data?: TTransformedGetAnimationsResponse;
  offlineData?: TTransformedGetAnimationsResponse;
}

interface IAnimationListSectionProps extends React.PropsWithChildren {
  heading?: string;
  hasDivider?: boolean;
  drafts?: boolean;
}

const AnimationListSection = ({
  children,
  heading,
  hasDivider = false,
  drafts = false,
}: IAnimationListSectionProps) => {
  return (
    <section className="flex flex-col w-full gap-4">
      {heading && (
        <h3 className="flex gap-2 justify-start items-center font-lf-semi-bold text-lg text-left text-gray-900">
          {drafts ? (
            <img
              src={IconDraft}
              className="w-[1.5rem] h-[1.5rem] text-subject-primary"
            />
          ) : (
            <img
              src={IconWorkspace}
              className="w-[1.5rem] h-[1.5rem] text-subject-primary"
            />
          )}
          {heading}
        </h3>
      )}
      <div className="gap-4 w-full flex-wrap grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7">
        {children}
      </div>
      {hasDivider && (
        <div className="flex w-full h-[1px] bg-stroke-neutral"></div>
      )}
    </section>
  );
};

export const AnimationList: React.FC<IAnimationListProps> = ({
  data,
  offlineData,
}) => {
  if (
    (!data || data.length === 0) &&
    (!offlineData || offlineData.length === 0)
  )
    return (
      <p className="flex max-w-[300px] mx-auto my-8 p-4 text-center text-gray-600">
        No animations in the list yet, you may upload your first animation by
        clicking the Upload Animation button
      </p>
    );

  const renderItems = (
    items: TTransformedGetAnimationsResponse,
    draft: boolean = false
  ) => {
    return items.map(({ id, title, animationData }) => {
      return (
        <div key={id} className="relative">
          {draft && <Pill text="Draft" float />}
          <AnimationItemDetail
            id={id ?? "ID not found"}
            title={title}
            animationData={animationData}
          />
        </div>
      );
    });
  };

  return (
    <>
      {offlineData && offlineData.length > 0 && (
        <AnimationListSection heading="Offline drafts" hasDivider drafts>
          {renderItems(offlineData, true)}
        </AnimationListSection>
      )}
      {data && data.length > 0 && (
        <AnimationListSection heading="Uploaded ">
          {renderItems(data)}
        </AnimationListSection>
      )}
    </>
  );
};
