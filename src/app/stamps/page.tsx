"use client";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import React from "react";
import Image from "next/image";
import { Button, Divider, Paper } from "@mui/material";
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
      className="overflow-y-auto mb-10"
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-end mb-5">
        <h1 className="text-2xl">Stamp Collection</h1>
        <Button
          sx={{ paddingY: "5px" }}
          className="text-white"
          variant="contained"
        >
          New Stamp
        </Button>
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
        <span className="mb-2">Mountain View</span>
        <Stamp />
        <Stamp />
        <Stamp />

        <Divider className="my-5" />
        <span className="mb-2">Mountain View</span>
        <Stamp />
        <Stamp />
        <Stamp />
        <span className="mb-2">Mountain View</span>
        <Stamp />
        <Stamp />
        <Stamp />
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
