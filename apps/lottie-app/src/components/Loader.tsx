import LottieLoaderData from "../assets/lottie-loader.json";
import { AnimationViewer } from "./animation";

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-[100px] h-[100px]">
      <AnimationViewer
        width={100}
        height={100}
        animationData={LottieLoaderData}
        shouldAutoplay
        noPause
      />
      <span className="text-subject-base"> Loading.. </span>
    </div>
  );
};
