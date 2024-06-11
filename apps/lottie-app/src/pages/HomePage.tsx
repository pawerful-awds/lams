import React from "react";
import { useSearchParams } from "react-router-dom";

import { AnimationItemDetail } from "../components";
import { useGetAnimationsQuery } from "../rdx/services/gql";

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const { data, error, isLoading } = useGetAnimationsQuery();

  return (
    <div>
      <h2>Welcome to LAMS</h2>
      <p>Query: {q}</p>
      {isLoading && <p>Loading..</p>}
      {data && (
        <ul>
          {data.map(({ id, title, animationData }) => {
            return (
              <li key={id}>
                <AnimationItemDetail
                  id={id}
                  title={title}
                  animationData={animationData}
                />
              </li>
            );
          })}
        </ul>
      )}
      {error && <p>{JSON.stringify(error)}</p>}
    </div>
  );
};

export default HomePage;
