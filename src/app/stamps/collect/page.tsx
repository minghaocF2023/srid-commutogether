"use client";
import StyledLink from "@/components/StyledLink";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import StyledButton from "@/components/StyledButton";
import useLocalStorage from "@/hook/useLocalStorage";
import { LocationData } from "@/types/stamps";

const data: { [key: string]: LocationData } = {
  mtv: {
    name: "Mountain View",
    stampImage: "/stamps/mtv_stamp.png",
    image: "/stamps/lib.jpeg",
    intro:
      "Mountain View is a city in Santa Clara County, in the San Francisco Bay Area of California. It is named for its views of the Santa Cruz Mountains.",
    collected: false,
  },
  mil: {
    name: "Millbrae",
    stampImage: "/stamps/mil_stamp.png",
    image: "/stamps/mil.jpg",
    intro: "Millbrae is a city in San Mateo County, California, United States.",
    collected: false,
  },
  sv: {
    name: "Sunnyvale",
    stampImage: "/stamps/sv_stamp.png",
    image: "/stamps/sv.jpg",
    intro:
      "Sunnyvale is a city located in Santa Clara County, California, in Silicon Valley.",
    collected: false,
  },
};

const Collect = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [collected, setCollected] = useState(false);
  const searchParams = useSearchParams();
  const [, setStampData] = useLocalStorage("stampData", data);

  useEffect(() => {
    if (searchParams.has("location")) {
      setLocation(searchParams.get("location"));
    } else {
      setLocation(null);
    }
  }, [searchParams]);

  const handleCollect = () => {
    setStampData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[location!].collected = true;
      return updatedData;
    });

    setCollected(true);
  };

  return (
    <>
      {collected ? (
        <div className="p-4 w-full h-full">
          <div className="flex flex-col gap-5 mt-10 items-center justify-center">
            <Image
              src={data[location!].stampImage}
              alt=""
              width={350}
              height={350}
            />
            <div className="text-3xl text-center ">{data[location!].name}</div>
            <div className="text-3xl text-center text-slate-500">
              Stamp Collected!
            </div>
            <StyledLink
              className="w-full"
              variant="contained"
              text="Back to Stamp"
              styleType="primary"
              href={"/stamps"}
            />
          </div>
        </div>
      ) : (
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
              <Image
                src={data[location].image}
                alt=""
                width={350}
                height={350}
              />
              <p className="text-center text-slate-500">
                {data[location].intro}
              </p>
              <StyledButton
                className="w-full"
                onClick={handleCollect}
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
                href={{
                  pathname: "/stamps/collect",
                  query: { location: "mtv" },
                }}
                className="w-full"
                text="Simulate Tapping at MTV station"
                variant="contained"
                styleType="primary"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Collect;
