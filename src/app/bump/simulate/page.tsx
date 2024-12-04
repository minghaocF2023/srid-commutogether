// app/bump/simulate/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import Image from "next/image";
import useLocalStorage from "@/hook/useLocalStorage";
import Link from "next/link";
import StyledButton from "@/components/StyledButton";

const SimulateBumpPage = () => {
  // Initialize bump counts from localStorage
  const [bumpCountWithAlice, setBumpCountWithAlice] = useLocalStorage<number>(
    "bumpCountWithAlice",
    0
  );
  const [totalBumpCount, setTotalBumpCount] = useLocalStorage<number>(
    "totalBumpCount",
    0
  );

  // State for managing bump limits
  const [totalBumpLimit, setTotalBumpLimit] = useState<number>(10);

  // State for handling loading state during bump simulation
  const [isBumping, setIsBumping] = useState<boolean>(true);

  useEffect(() => {
    // Function to handle bump simulation
    const simulateBump = () => {
      setIsBumping(true);
      // Simulate a 3-second delay
      setTimeout(() => {
        // Increment counts
        setBumpCountWithAlice(bumpCountWithAlice + 1);
        setTotalBumpCount(totalBumpCount + 1);
        setIsBumping(false);

        // Check if totalBumpCount has reached the initial limit
        if (totalBumpCount + 1 >= 10 && totalBumpLimit === 10) {
          setTotalBumpLimit(50); // Increase the total bump limit
        }
      }, 3000);
    };

    simulateBump();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs once on mount

  // Determine heart color based on totalBumpLimit
  const getHeartEmoji = (count: number, limit: number) => {
    return count >= limit ? "🩶" : "🤎";
  };

  // Ensure that bump counts do not exceed their limits
  useEffect(() => {
    if (bumpCountWithAlice > 10) {
      setBumpCountWithAlice(10);
    }
    if (totalBumpCount > totalBumpLimit) {
      setTotalBumpCount(totalBumpLimit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalBumpLimit]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={4}
      bgcolor="background.default"
      textAlign="center"
    >
      {/* Fist Bump GIF */}
      <Image
        src="/bump/fist_bump.gif"
        alt="Fist Bump"
        width={300}
        height={300}
      />

      {/* Loading Indicator */}
      {isBumping ? (
        <>
          <Typography
            variant="h5"
            component="h2"
            mt={4}
            mb={2}
            color="text.primary"
          >
            Simulating Bump...
          </Typography>
          <CircularProgress color="primary" />
        </>
      ) : (
        <>
          {/* Success Message */}
          <Typography
            variant="h5"
            component="h2"
            mt={4}
            mb={2}
            color="text.primary"
          >
            You've bumped with your friend!
          </Typography>

          {/* Bump Counts */}
          <Box mt={2} mb={4}>
            {/* With Alice Count */}
            <Typography variant="h6" color="text.secondary">
              With Alice: {bumpCountWithAlice}/10 {getHeartEmoji(bumpCountWithAlice, 10)}
            </Typography>

            {/* Total Bump Count */}
            <Typography variant="h6" color="text.secondary" mt={1}>
              Total BUMP🍻: {totalBumpCount}/{totalBumpLimit} {getHeartEmoji(totalBumpCount, totalBumpLimit)}
            </Typography>
          </Box>
          
        </>
      )}
    </Box>
  );
};

export default SimulateBumpPage;
