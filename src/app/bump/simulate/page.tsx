// app/bump/simulate/page.tsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import Image from "next/image";
import useLocalStorage from "@/hook/useLocalStorage";
import { useRouter } from "next/navigation";
import StyledButton from "@/components/StyledButton";

type SocialData = {
  name: string;
  stampImage: string;
  image: string;
  description: string;
  timestamp: string;
  collected: boolean;
  count: number;
};

const SimulateBumpPage = () => {
  // Initialize bump counts from localStorage
  const [bumpCountWithSamuel, setBumpCountWithSamuel] = useLocalStorage<number>(
    "bumpCountWithSamuel",
    0
  );
  const [totalBumpCount, setTotalBumpCount] = useLocalStorage<number>(
    "totalBumpCount",
    0
  );

  const [, setSocialData] = useLocalStorage<{
    [key: string]: SocialData;
  }>("socialStampData", {});

  // State for managing bump limits
  const [bumpLimitWithSamuel, setBumpLimitWithSamuel] = useState<number>(10);
  const [totalBumpLimit, setTotalBumpLimit] = useState<number>(10);

  // State for handling loading state during bump simulation
  const [isBumping, setIsBumping] = useState<boolean>(false); // Initially false
  const hasMounted = useRef(false);
  const router = useRouter(); 

  // Function to handle bump simulation
  const simulateBump = () => {
    setIsBumping(true);
    // Simulate a 3-second delay
    setTimeout(() => {
      // Increment counts, ensuring they don't exceed current limits
      setBumpCountWithSamuel((prev) => prev + 1);
      setTotalBumpCount((prev) => prev + 1);
      setIsBumping(false);
      setSocialData((prevData) => ({
        ...prevData,
        bf: {
          ...prevData.bf,
          collected: true,
          timestamp: new Date().toLocaleString("en-US"),
          count: totalBumpCount + 1,
        },
      }));
    }, 3000);
  };

  // Effect to simulate bump when component mounts
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      simulateBump();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to handle bumpCountWithSamuel reaching its limit
  useEffect(() => {
    if (bumpCountWithSamuel >= bumpLimitWithSamuel) {
      // Example: Increase the limit by 10 each time it's reached
      setBumpLimitWithSamuel((prev) => prev + 10);
    }
  }, [bumpCountWithSamuel, bumpLimitWithSamuel]);

  // Effect to handle totalBumpCount reaching its limit
  useEffect(() => {
    if (totalBumpCount >= totalBumpLimit) {
      // Example: Increase the limit by 50 each time it's reached
      setTotalBumpLimit((prev) => prev + 50);
    }
  }, [totalBumpCount, totalBumpLimit]);

  // Function to get the appropriate heart emoji based on count and limit
  const getHeartEmoji = (count: number) => {
    if (count < 10) return "🤎"; // Brown Heart
    else if (count < 50) return "🩶"; // Light Gray Heart as Silver
    else return "💛"; // Yellow Heart as Gold
  };

  // Ensure that bump counts do not exceed their limits
  useEffect(() => {
    if (bumpCountWithSamuel > bumpLimitWithSamuel) {
      setBumpCountWithSamuel(bumpLimitWithSamuel);
    }
    if (totalBumpCount > totalBumpLimit) {
      setTotalBumpCount(totalBumpLimit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bumpLimitWithSamuel, totalBumpLimit]);

  useEffect(() => {
    if (!isBumping) {
      const timer = setTimeout(() => {
        // 3.1 Redirect to the profile page
        router.push("/profile?user=1");
      }, 3000); // 3-second delay
  
      // 3.2 Cleanup the timer on unmount or if isBumping changes
      return () => clearTimeout(timer);
    }
  }, [isBumping, router]);

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
      <Image
        src="/bump/fist_bump.gif"
        alt="Fist Bump"
        width={300}
        height={300}
      />

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
            {/* With Samuel Count */}
            <Typography variant="h6" color="text.secondary">
              With Samuel: {bumpCountWithSamuel}/{bumpLimitWithSamuel}{" "}
              {getHeartEmoji(bumpCountWithSamuel)}
            </Typography>

            {/* Total Bump Count */}
            <Typography variant="h6" color="text.secondary" mt={1}>
              Total BUMP🍻: {totalBumpCount}/{totalBumpLimit}{" "}
              {getHeartEmoji(totalBumpCount)}
            </Typography>
          </Box>

        </>
      )}
    </Box>
  );
};

export default SimulateBumpPage;
