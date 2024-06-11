import React from "react";
import Lottie from "react-lottie";

import sampleAnimationData from "../../sample-animation.json";

export interface IAnimationViewerProps {
  animationData: Record<string, TODO> | null;
  shouldAutoplay?: boolean;
}

const deepClone = (obj: TODO): Record<string, TODO> => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
  );
};

export const AnimationViewer: React.FC<IAnimationViewerProps> = ({
  animationData,
  shouldAutoplay = false,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: shouldAutoplay,
    animationData: deepClone(animationData) ?? {},
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};
