import React from "react";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useUser } from "@clerk/clerk-react";
import { saveOpening } from "@/api/apiOpenings";
import { useState, useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
const OpeningCard = ({
  opening,
  isMyOpening = false,
  savedInit = false,
  onOpeningSaved = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

    const {
    loading: loadingSavedOpening,
    data: savedOpening,
    fn: fnSavedOpening,
  } = useFetch(saveOpening,
    {alreadySaved:saved,});


    const handleSaveOpening = async () => {
    await fnSavedOpening({
      user_id: user.id,
      opening_id: opening.id,
    });
    onOpeningSaved();
  };

    useEffect(() => {
    if (savedOpening !== undefined) setSaved(savedOpening?.length > 0);
  }, [savedOpening]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {opening.title}
                    {isMyOpening && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
         <div className="flex justify-between">
          {opening.club && <img src={opening.club.logo_url} className="h-6" />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {opening.location}
          </div>
        </div>
        <hr />
        {opening.description.substring(0, opening.description.indexOf("."))}.
      </CardContent>
      <CardFooter>
                <Link to={`/openingDetails/${opening.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {!isMyOpening && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveOpening}
            disabled={loadingSavedOpening}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OpeningCard;
