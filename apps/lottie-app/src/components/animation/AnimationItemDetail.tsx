import React from "react";
import { Link, useLocation } from "react-router-dom";

import { AnimationViewer } from "./AnimationViewer";

export interface IAnimationItemDetailProps {
  animationData: Record<string, TODO> | null;
  id: string;
  title: string;
  animationShouldAutoPlay?: boolean;
}

export const AnimationItemDetail: React.FC<IAnimationItemDetailProps> = ({
  animationData,
  id,
  title,
  animationShouldAutoPlay = false,
}) => {
  const location = useLocation();
  return (
    <article className="relative w-full transition duration-100 ease-out bg-white border border-stroke-neutral rounded-md animation-card overflow-hidden group p-4">
      <AnimationViewer
        animationData={animationData}
        shouldAutoplay={animationShouldAutoPlay}
        width={200}
        height={200}
      />
      <div>
        {id ? <h4 className="text-[0.6em]">{id}</h4> : null}
        {title ? (
          <Link
            to={`/animation/${id}`}
            state={{ backgroundLocation: location }}
          >
            {title}
          </Link>
        ) : null}
      </div>
    </article>
  );
};
