"use client";
import StyledLink from "@/components/StyledLink";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type LocationData = {
  name: string;
  image: string;
  intro: string;
};

const data: { [key: string]: LocationData } = {
  mtv: {
    name: "Mountain View",
    image: "/stamps/lib.jpeg",
    intro:
      "Mountain View is a city in Santa Clara County, in the San Francisco Bay Area of California. It is named for its views of the Santa Cruz Mountains.",
  },
  sf: {
    name: "San Francisco",
    image: "/stamps/sf.png",
    intro:
      "San Francisco, officially the City and County of San Francisco, is a cultural, commercial, and financial center in the northern part of the U.S. state of California.",
  },
  sj: {
    name: "San Jose",
    image: "/stamps/sj.png",
    intro:
      "San Jose, officially the City of San José, is the cultural, financial, and political center of Silicon Valley, and the largest city in Northern California by both population and area.",
  },
};

const Collect = () => {
  const [location, setLocation] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("location")) {
      setLocation(searchParams.get("location"));
    } else {
      setLocation(null);
    }
  }, [searchParams]);

  return (
    <div className="p-4 w-full h-full">
      <div className="flex">
        <StyledLink
          variant="text"
          styleType="secondary"
          href={location ? "/stamps/collect" : "/stamps"}
          className="text-black"
          text="< Back"
        />
      </div>
      {location !== null ? (
        <div className="flex flex-col items-center justify-center gap-10">
          <h1 className="text-3xl text-center mt-10 text-slate-500">
            {data[location].name}
          </h1>
          <Image src={data[location].image} alt="" width={350} height={350} />
          <p className="text-center text-slate-500 h-[12rem]">
            {data[location].intro}
          </p>
          <StyledLink
            href={{
              pathname: "/stamps/collect",
              query: { location: location },
            }}
            text="Collect Stamp"
            variant="contained"
            styleType="primary"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-10">
          <h1 className="text-3xl text-center mt-10 text-slate-500">
            To Collect Stamps...
          </h1>
          <Image src={"/stamps/scan.png"} alt="" width={350} height={350} />
          <h1 className="text-2xl text-center text-slate-500">
            Please Tap on Clipper Scanner
          </h1>
          <StyledLink
            href={{ pathname: "/stamps/collect", query: { location: "mtv" } }}
            text="Simulate Tapping at MTV station"
            variant="contained"
            styleType="primary"
          />
        </div>
      )}
    </div>
  );
};

export default Collect;
