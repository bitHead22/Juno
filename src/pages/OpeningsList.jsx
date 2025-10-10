import { getOpenings } from "@/api/apiOpenings";
import OpeningCard from "@/components/opening-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const OpeningsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [club_id, setClub_id] = useState("");

  const { isLoaded } = useUser();

  const {
    fn: fnOpenings,
    data: openings,
    loading: loadingOpenings,
  } = useFetch(getOpenings, {
    location,
    club_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) fnOpenings();
  }, [isLoaded, location, club_id, searchQuery]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Openings
      </h1>

      {/*Add filters*/}

      {loadingOpenings && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingOpenings === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {openings?.length ? (
            openings.map((opening) => {
              return (
                <OpeningCard
                  key={opening.id}
                  opening={opening}
                  savedInit={opening?.saved?.length > 0}
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

export default OpeningsList;
