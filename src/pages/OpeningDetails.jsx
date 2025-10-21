import React from "react";
import { getSingleOpening, updateHiringStatus } from "@/api/apiOpenings";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyOpeningDrawer } from "@/components/apply-opening";
import {ApplicationCard} from "@/components/application-card";
const OpeningDetails = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    loading: loadingOpening,
    data: opening,
    fn: fnOpening,
  } = useFetch(getSingleOpening, {
    opening_id: id,
  });

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      opening_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnOpening());
  };

  useEffect(() => {
    if (isLoaded) fnOpening();
  }, [isLoaded]);

  if (!isLoaded || loadingOpening) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {opening?.title}
        </h1>
        <img
          src={opening?.club?.logo_url}
          className="h-12"
          alt={opening?.title}
        />
      </div>

      <div className="flex justify-between ">
        <div className="flex gap-2">
          <MapPinIcon /> {opening?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {opening?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {opening?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      {/*Hiring status*/}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {opening?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${
              opening?.isOpen ? "bg-green-950" : "bg-red-950"
            }`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " + (opening?.isOpen ? "( Open )" : "( Closed )")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{opening?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={opening?.requirements}
        className="wmde-markdown bg-transparent sm:text-lg"
      />

      {/*render applications */}
      {opening?.recruiter_id !== user?.id && (
        <ApplyOpeningDrawer
          opening={opening}
          user={user}
          fetchOpening={fnOpening}
          applied={opening?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}

      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {opening?.applications?.length > 0 && opening?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
          {opening?.applications.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OpeningDetails;
