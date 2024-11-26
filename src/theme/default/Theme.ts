"use client";

import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#F5A524",
    },
    secondary: {
      main: "#AB59F0",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
  },
});

export default Theme;