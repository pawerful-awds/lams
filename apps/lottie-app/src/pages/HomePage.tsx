import React from "react";
import {
  useParams,
  useLocation,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";

import { useGetAnimationsQuery } from "../rdx/services/gql";
import { Loader, AnimationList, useGetOfflineQueueData } from "../components";

export const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="modal-wrapper" onClick={() => navigate("/")}>
      <div>
        <p>Detail page</p>
        <p>
          {id}
          This will become the new detail page for animations
        </p>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const q = searchParams.get("q");
  const { data: getAnimationsData, isLoading } = useGetAnimationsQuery();
  const { data: offlineData } = useGetOfflineQueueData();

  return (
    <div className="flex flex-col p-4 min-h-full">
      <h2 className="text-subject-base font-semibold text-2xl text-left">
        Welcome to LAMS
        <Link to="/detail/123" state={{ backgroundLocation: location }}>
          For details
        </Link>
      </h2>

      <div className="flex flex-1 flex-col gap-4 justify-center w-full py-4 h-full">
        {isLoading ? (
          <Loader />
        ) : (
          <AnimationList
            offlineData={offlineData.queue}
            data={getAnimationsData}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
