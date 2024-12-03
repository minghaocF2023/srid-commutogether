"use client";

import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#F5A524",
    },
    secondary: {
      main: "#B3B3B3",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
  },
});

export default Theme;
