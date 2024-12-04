"use client";
import { useSearchParams } from "next/navigation";
import useLocalStorage from "@/hook/useLocalStorage";
import { useEffect, useState } from "react";
import Image from "next/image";
import StyledLink from "@/components/StyledLink";
import { LocationData } from "@/types/stamps";
const View = () => {
  const searchParams = useSearchParams();
  const [stampData] = useLocalStorage<{ [key: string]: LocationData }>(
    "stampData",
    {}
  );
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.has("location")) {
      setLocation(searchParams.get("location"));
    }
  }, [searchParams]);

  return (
    <>
      {location ? (
        <div className="p-4 flex flex-col items-center justify-center gap-10">
          <h1 className="text-3xl text-center mt-10 text-slate-500">
            {stampData[location].name}
          </h1>
          <Image
            src={stampData[location].image}
            alt=""
            width={350}
            height={350}
          />
          <p className="text-center text-slate-500 ">
            {stampData[location].intro}
          </p>
          <StyledLink
            className="w-full"
            variant="contained"
            text="Back to Stamp"
            styleType="primary"
            href={"/stamps"}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default View;
