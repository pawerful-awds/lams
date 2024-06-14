import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CopyBlock } from "react-code-blocks";

import { useGetAnimationQuery } from "@/rdx/services/gql";
import { AnimationViewer, Loader, Modal } from "@/components";

const AnimationDetail: React.FC = () => {
  const { animationId } = useParams<{ animationId: string }>();
  const { data, error, isLoading } = useGetAnimationQuery({
    id: animationId ?? "",
  });

  return (
    <div className="flex flex-col p-4">
      {error ? (
        <p> Ooops, seems something is wrong. Please try again later.</p>
      ) : (
        <div className="flex flex-col justify-center w-full py-4">
          {isLoading && <Loader />}
          {data && (
            <>
              <AnimationViewer
                animationData={data.animationData}
                shouldAutoplay
                width={300}
                height={300}
              />
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-subject-primary">
                    Animation Id:{" "}
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
                    "No metadata"
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-sm text-subject-primary">
                    Other details:{" "}
                  </div>
                  <p>Adding more details soon..</p>
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
