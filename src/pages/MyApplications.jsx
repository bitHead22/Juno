import CreatedApplications from "@/components/my-applications";
import CreatedOpenings from "@/components/created-openings";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyApplications = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        {user?.unsafeMetadata?.role === "candidate"
          ? "My Applications"
          : "My Created Openings"}
      </h1>
      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedOpenings />
      )}
    </div>
  );
};

export default MyApplications;