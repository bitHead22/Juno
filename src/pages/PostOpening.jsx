import { getClubs } from "@/api/apiClubs";
import { addNewOpening } from "@/api/apiOpenings";
import AddClubDrawer from "@/components/add-club-drawer";
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
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  club_id: z.string().min(1, { message: "Select or Add a new Club" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostOpening = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateOpening,
    error: errorCreateOpening,
    data: dataCreateOpening,
    fn: fnCreateOpening,
  } = useFetch(addNewOpening);

  const onSubmit = (data) => {
    fnCreateOpening({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateOpening?.length > 0) navigate("/openingList");
  }, [loadingCreateOpening]);

  const {
    loading: loadingClubs,
    data: clubs,
    fn: fnClubs,
  } = useFetch(getClubs);

  useEffect(() => {
    if (isLoaded) {
      fnClubs();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingClubs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/openingList" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post an Opening
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Input placeholder="Opening Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Opening Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="club_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Club">
                    {field.value
                      ? clubs?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Club"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {clubs?.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddClubDrawer fetchClubs={fnClubs} />
        </div>
        {errors.club_id && (
          <p className="text-red-500">{errors.club_id.message}</p>
        )}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        {errors.errorCreateOpening && (
          <p className="text-red-500">{errors?.errorCreateOpening?.message}</p>
        )}
        {errorCreateOpening?.message && (
          <p className="text-red-500">{errorCreateOpening?.message}</p>
        )}
        {loadingCreateOpening && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostOpening;