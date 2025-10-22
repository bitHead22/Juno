import { getMyOpenings } from "@/api/apiOpenings";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import OpeningCard from "./opening-card";
import { useEffect } from "react";

const CreatedOpenings = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedOpenings,
    data: createdOpenings,
    fn: fnCreatedOpenings,
  } = useFetch(getMyOpenings, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedOpenings();
  }, []);

  return (
    <div>
      {loadingCreatedOpenings ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdOpenings?.length ? (
            createdOpenings.map((opening) => {
              return (
                <OpeningCard
                  key={opening.id}
                  opening={opening}
                  onOpeningSaved={fnCreatedOpenings}
                  isMyOpening
                />
              );
            })
          ) : (
            <div>No Openings Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedOpenings;