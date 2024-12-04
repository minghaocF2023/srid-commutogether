// app/bump/simulate/page.tsx

"use client";

import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import useLocalStorage from "@/hook/useLocalStorage";
import Link from "next/link";
import StyledButton from "@/components/StyledButton";

const SimulateBumpPage = () => {
  const [bumpCount, setBumpCount] = useLocalStorage<number>("bumpCount", 0);

  useEffect(() => {
    // Increment the bump count when the component mounts
    setBumpCount((prevCount) => prevCount + 1);
  }, [setBumpCount]);

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
        src="/bump/fist_bump.gif"
        alt="Fist Bump"
        width={300}
        height={300}
      />
      <Typography
        variant="h5"
        component="h2"
        mt={4}
        mb={2}
        textAlign="center"
        color="text.primary"
      >
        You've bumped with your friend!
      </Typography>
      <Typography variant="body1" mb={4} color="text.secondary">
        Total Bumps with Alice: {bumpCount}
      </Typography>
      <Link href="/bump" passHref>
        <StyledButton
          text="Back to Bump"
          onClick={() => {}}
          styleType="secondary"
          variant="outlined"
          className="mt-2"
        />
      </Link>
    </Box>
  );
};

export default SimulateBumpPage;
