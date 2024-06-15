import LottieLoaderData from "@/assets/lottie-loader.json";
import { AnimationViewer } from "./animation";

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-[100px] h-[100px] self-center">
      <div className="w-[100px] h-[100px]">
        <AnimationViewer
          animationData={LottieLoaderData}
          shouldAutoplay
          noPause
          playOnHover={false}
        />
      </div>
      <span className="text-subject-base"> Loading.. </span>
    </div>
  );
};
