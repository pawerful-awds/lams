import React from "react";
import { Link } from "react-router-dom";

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
  return (
    <article>
      <AnimationViewer
        animationData={animationData}
        shouldAutoplay={animationShouldAutoPlay}
      />
      {id ? <h4>{id}</h4> : null}
      {title ? (
        <Link to={`/animation/${id}`}>
          <h3>{title}</h3>
        </Link>
      ) : null}
    </article>
  );
};
