import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CopyBlock } from "react-code-blocks";

import { useGetAnimationQuery } from "@/rdx/services/gql";
import { AnimationViewer, Loader, Modal, Pill } from "@/components";
import { downloadAnimationFile } from "@/rdx/features/animations/actions";

const AnimationDetail: React.FC = () => {
  const { animationId } = useParams<{ animationId: string }>();
  const { data, error, isLoading } = useGetAnimationQuery({
    id: animationId ?? "",
  });

  const isDraft = /^off-id/.test(animationId ?? "");

  const handleDownload = React.useCallback(() => {
    void downloadAnimationFile(animationId ?? "");
  }, [animationId]);

  return (
    <div className="flex flex-col p-4">
      {error ? (
        <p className="text-gray-600">
          {" "}
          Ooops, seems something is wrong. Please try again later.
        </p>
      ) : (
        <div className="flex flex-col justify-center w-full py-4">
          {isLoading && <Loader />}
          {data && (
            <>
              <div className="w-full h-[300px]">
                <AnimationViewer
                  animationData={data.animationData}
                  shouldAutoplay
                  showControls
                  playOnHover={false}
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col text-sm text-subject-primary">
                    <div className="flex gap-2 items-center">
                      Animation Id: {isDraft && <Pill text="Draft" />}
                    </div>
                    {isDraft && (
                      <span className="text-black">
                        {`This is a temporary offline Id only (Once uploaded it'll be updated)`}
                      </span>
                    )}
                  </div>
                  {data.title ? (
                    <CopyBlock
                      text={animationId ?? ""}
                      language={"json"}
                      wrapLongLines
                    />
                  ) : (
                    "-"
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-sm text-subject-primary">Name: </div>
                  {data.title ? (
                    <h1 className="text-subject-base font-semibold text-2xl text-left">
                      {data.title}
                    </h1>
                  ) : (
                    "-"
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-sm text-subject-primary">Metadata: </div>
                  {data.metadata ? (
                    <CopyBlock
                      text={data.metadata ?? ""}
                      language={"json"}
                      wrapLongLines
                    />
                  ) : (
                    <p className="text-gray-600">No metadata</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-sm text-subject-primary">
                    Other details:{" "}
                  </div>
                  <p className="text-gray-600">Adding more details soon..</p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-sm text-subject-primary">Download:</div>
                  {isDraft ? (
                    <p className="flex flex-col gap-1 text-gray-600 leading-none p-2 px-4 bg-surface-background">
                      Lottie JSON
                      <span className="text-gray-600 text-sm">
                        Ooops, sorry, but this animation is in draft if you wish
                        to download this animation it should be uploaded first.
                      </span>
                    </p>
                  ) : (
                    <>
                      <p className="flex flex-col gap-1 text-gray-600 leading-none p-2 px-4 bg-surface-background">
                        Lottie JSON
                        <span className="text-gray-600 text-sm">
                          A text-based format that's easier for devs to
                          implement
                        </span>
                      </p>
                      <button
                        className="flex justify-center items-start self-start text-sm px-4 py-2 rounded-md bg-subject-primary cursor-pointer"
                        onClick={handleDownload}
                      >
                        Download animation
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const DetailPage = () => {
  const navigate = useNavigate();
  return (
    <Modal handleClose={() => navigate("/")}>
      <AnimationDetail />
    </Modal>
  );
};

export default AnimationDetail;
