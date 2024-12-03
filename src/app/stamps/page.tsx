"use client";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import React from "react";
import Image from "next/image";
import { Paper } from "@mui/material";
import StyledLink from "@/components/StyledLink";
import useLocalStorage from "@/hook/useLocalStorage";
import { useRouter } from "next/navigation";

type LocationData = {
  name: string;
  stampImage: string;
  image: string;
  intro: string;
  collected: boolean;
};

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="overflow-y-scroll max-h-full mb-10"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Stamps = () => {
  const [value, setValue] = useState(0);
  const [stampData] = useLocalStorage("stampData", data);
  const router = useRouter();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleView = (location: string) => {
    if (!stampData[location].collected) {
      return;
    }

    router.push(`/stamps/view?location=${location}`);
  };

  return (
    <div className="w-full h-screen p-4 pb-14">
      <div className="flex justify-between items-end mb-5">
        <h1 className="text-2xl">Stamp Collection</h1>
        <StyledLink
          text="New Stamp"
          href={"/stamps/collect"}
          styleType="primary"
        />
      </div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Location" {...a11yProps(0)} />
          <Tab label="Transportation" {...a11yProps(1)} />
          <Tab label="Social" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {Object.keys(stampData).map((location) => (
          <Paper className="mb-3" key={location}>
            <div className="flex justify-between items-center">
              <div
                onClick={() => handleView(location)}
                className={`${
                  stampData[location].collected ? "" : "grayscale"
                } flex gap-4 items-center relative`}
              >
                <Image
                  className="rounded-md "
                  src={stampData[location].image}
                  alt=""
                  width={350}
                  height={100}
                />
                <Image
                  className="rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
                  src={stampData[location].stampImage}
                  alt=""
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </Paper>
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </div>
  );
};

const Stamp = () => {
  return (
    <Paper className=" mb-3">
      <Image
        className="rounded-md"
        src="/stamps/lib.jpeg"
        alt=""
        width={500}
        height={100}
      />
      <div className="flex justify-between items-center"></div>
    </Paper>
  );
};

export default Stamps;
