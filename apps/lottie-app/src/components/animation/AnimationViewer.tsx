import React from "react";
import {
  DotLottiePlayer,
  Controls,
  DotLottieCommonPlayer,
} from "@dotlottie/react-player";

export interface IAnimationViewerProps {
  animationData: Record<string, TODO> | null;
  shouldAutoplay?: boolean;
  noPause?: boolean;
  showControls?: boolean;
  playOnHover?: boolean;
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
  showControls,
  playOnHover = true,
}) => {
  const dotLottieRef = React.useRef<DotLottieCommonPlayer>(null);

  React.useEffect(() => {
    if (dotLottieRef.current) {
      dotLottieRef.current.setHover(playOnHover);
    }
  }, [playOnHover]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <DotLottiePlayer
        ref={dotLottieRef}
        src={deepClone(animationData) ?? {}}
        autoplay={shouldAutoplay}
        loop
      >
        {showControls && <Controls />}
      </DotLottiePlayer>
    </div>
  );
};
