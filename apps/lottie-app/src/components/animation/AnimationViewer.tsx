import React from "react";
import Lottie from "react-lottie";

export interface IAnimationViewerProps {
  width?: number;
  height?: number;
  animationData: Record<string, TODO> | null;
  shouldAutoplay?: boolean;
  noPause?: boolean;
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
  width = 300,
  height = 300,
  animationData,
  shouldAutoplay = false,
  noPause = false,
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
      <Lottie
        options={defaultOptions}
        height={height}
        width={width}
        isClickToPauseDisabled={noPause}
      />
    </div>
  );
};
