import React from 'react';
import Lottie from 'react-lottie';

import sampleAnimationData from "../sample-animation.json";

export interface IAnimationViewerProps {
    animationId: String;
}

export const AnimationViewer: React.FC<IAnimationViewerProps> = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: sampleAnimationData,
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
