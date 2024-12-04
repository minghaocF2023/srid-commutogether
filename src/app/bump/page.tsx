// app/bump/page.tsx

"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import StyledButton from "@/components/StyledButton";

const BumpPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={4}
      bgcolor="background.default"
    >
      <Image
        src="/bump/bump_simulate.png"
        alt="Bump Simulation"
        width={300}
        height={300}
      />
      <Typography
        variant="h4"
        component="h1"
        mt={4}
        mb={2}
        textAlign="center"
        color="text.primary"
      >
        Bump your phone with your friends ...
      </Typography>
      <Link href="/bump/simulate" passHref>
        <StyledButton
          text="Simulate Bumping"
          onClick={() => {}}
          styleType="primary"
          variant="contained"
          className="mt-4"
        />
      </Link>
    </Box>
  );
};

export default BumpPage;
