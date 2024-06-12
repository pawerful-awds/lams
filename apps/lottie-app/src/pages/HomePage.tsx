import React from "react";
import { useSearchParams } from "react-router-dom";

import { Loader, AnimationList } from "../components";
import { useGetAnimationsQuery } from "../rdx/services/gql";

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const { data, error, isLoading } = useGetAnimationsQuery();

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-subject-base font-semibold text-2xl text-left">
        Welcome to LAMS
      </h2>

      <div className="flex justify-center w-full py-4">
        {isLoading && <Loader />}
        <AnimationList data={data} />
      </div>
    </div>
  );
};

export default HomePage;
