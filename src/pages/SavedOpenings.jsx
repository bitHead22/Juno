import { getSavedOpenings } from "@/api/apiOpenings";
import OpeningCard from "@/components/opening-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedOpenings = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedOpenings,
    data: savedOpenings,
    fn: fnSavedOpenings,
  } = useFetch(getSavedOpenings);

  useEffect(() => {
    if (isLoaded) {
      fnSavedOpenings();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingSavedOpenings) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Openings
      </h1>

      {loadingSavedOpenings === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedOpenings?.length ? (
            savedOpenings?.map((saved) => {
              return (
                <OpeningCard
                  key={saved.id}
                  opening={saved?.opening}
                  onOpeningSaved={fnSavedOpenings}
                  savedInit={true}
                />
              );
            })
          ) : (
            <div>No Saved Openings 👀</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedOpenings;