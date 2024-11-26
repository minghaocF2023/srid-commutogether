"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MapIcon from "@mui/icons-material/Map";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedIcon from "@mui/icons-material/Verified";
import Fab from "@mui/material/Fab";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
const StyledFab = styled(Fab)({
  position: "relative",
  zIndex: 1,
  top: -15,
  left: 0,
  right: 0,
  margin: "0 auto",
  padding: "0.5rem",
});

const Header = () => {
  const theme = useTheme();
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.background.default,
        top: "auto",
        bottom: 0,
      }}
    >
      <Toolbar className="w-full">
        <div className="flex w-full">
          <div className="flex flex-1 justify-evenly">
            <Link href="/">
              <IconButton color="inherit" aria-label="open drawer">
                <div className="flex flex-col items-center justify-center">
                  <HomeIcon />
                  <span className="text-sm">Home</span>
                </div>
              </IconButton>
            </Link>
            <Link href="/social">
              <IconButton color="inherit" aria-label="open drawer">
                <div className="flex flex-col items-center justify-center">
                  <GroupsIcon />
                  <span className="text-sm">Social</span>
                </div>
              </IconButton>
            </Link>
          </div>
          <StyledFab className="p-2" color="primary" aria-label="add">
            <Link href="/bump">
              <div className="flex flex-col items-center justify-center p-2">
                <ThumbsUpDownIcon className="text-white" />
              </div>
            </Link>
          </StyledFab>
          <div className="flex flex-1 justify-evenly">
            <Link href="/map">
              <IconButton color="inherit">
                <div className="flex flex-col items-center justify-center">
                  <MapIcon />
                  <span className="text-sm">Map</span>
                </div>
              </IconButton>
            </Link>
            <Link href="/stamps">
              <IconButton color="inherit">
                <div className="flex flex-col items-center justify-center">
                  <VerifiedIcon />
                  <span className="text-sm">Stamps</span>
                </div>
              </IconButton>
            </Link>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
