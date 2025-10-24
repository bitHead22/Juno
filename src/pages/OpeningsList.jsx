import { getClubs } from "@/api/apiClubs";
import { getOpenings } from "@/api/apiOpenings";
import OpeningCard from "@/components/opening-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

    const {
    // loading: loadingCompanies,
    data: clubs,
    fn: fnClubs,
  } = useFetch(getClubs);

    useEffect(() => {
    if (isLoaded) {
      fnClubs();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnOpenings();
  }, [isLoaded, location, club_id, searchQuery]);

const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

    const clearFilters = () => {
    setSearchQuery("");
    setClub_id("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Openings
      </h1>

      {/*Add filters*/}

      <form
        onSubmit={handleSearch}
        className="h-14 flex flex-row w-full gap-2 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search Openings by Title.."
          name="search-query"
          className="h-full flex-1  px-4 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>

        <div className="flex flex-col sm:flex-row gap-2">
        <Select
          value={club_id}
          onValueChange={(value) => setClub_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Club" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 text-white border rounded-md shadow-md">
            <SelectGroup>
              {clubs?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="sm:w-1/2 bg-red-500"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

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
