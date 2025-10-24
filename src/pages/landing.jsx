import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import clubs from "../data/clubs.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center ">
        <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Find Your Favourite Club
          <span className="flex items-center gap-2 sm:gap-6">
            at
            <img
              src="/logo.png"
              className="h-24 sm:h-24 lg:h-48 sm:pt-10"
              alt="Juno Logo"
            />
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
          Explore all of your favourite club listings or find the perfect
          candidate.
        </p>
      </section>
      <div className="flex flex-wrap gap-3 sm:gap-6 justify-center">
        <Link to={"/openingList"}>
          <Button variant="blue" size="xl"  className="text-sm px-4 py-2 sm:text-base sm:px-6 sm:py-3 lg:text-lg lg:px-8 lg:py-4">
            Find Opening
          </Button>
        </Link>
        <Link to={"/postOpening"}>
          <Button className="bg-red-500 text-sm px-4 py-2 sm:text-base sm:px-6 sm:py-3 lg:text-lg lg:px-8 lg:py-4" size="xl" >
            Post a Opening
          </Button>
        </Link>
      </div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-2 items-center">
          {clubs.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 ">
              <img
                src={path}
                alt={name}
                className="h-12 sm:h-16 lg:h-20 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Students</CardTitle>
          </CardHeader>
          <CardContent>
            Discover club openings, apply for positions, and track your
            applications all in one place.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Clubs</CardTitle>
          </CardHeader>
          <CardContent>
            Post your open positions, manage applicants, and find the perfect
            new members for your team.
          </CardContent>
        </Card>
      </section>

      <Accordion type="multiple" className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;
