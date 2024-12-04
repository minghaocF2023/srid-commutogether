"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Fab, Typography } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ReplayIcon from "@mui/icons-material/Replay";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import useLocalStorage from "@/hook/useLocalStorage";

const Video = styled("video")({
  width: "100%",
  height: "100vh",
  objectFit: "cover",
});

const CaptureButton = styled(Fab)({
  position: "fixed",
  bottom: "80px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "70px",
  height: "70px",
  backgroundColor: "#F5A524",
  "&:hover": {
    backgroundColor: "#D48E1A",
  },
});

const CapturedImage = styled("img")({
  width: "100%",
  height: "100vh",
  objectFit: "cover",
});

const FlashOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "white",
  opacity: 0.5,
  transition: "opacity 0.2s ease-in-out",
  zIndex: 2,
});

const StoryPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Using useLocalStorage hook for capturedPhoto
  const [capturedPhoto, setCapturedPhoto] = useLocalStorage<string>(
    "capturedPhoto",
    ""
  );

  const [hasCameraAccess, setHasCameraAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Request Camera Access on Mount
  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setHasCameraAccess(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Unable to access the camera. Please check permissions.");
      } finally {
        setIsLoading(false);
      }
    };

    getCameraStream();

    // Cleanup: Stop all video streams when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle Photo Capture
  const handleCapture = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas image to a data URL
    const dataURL = canvas.toDataURL("image/png");
    setCapturedPhoto(dataURL);

    // Trigger flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);
  };

  // Handle Retake Photo
  const handleRetake = () => {
    setCapturedPhoto("");
  };

  // Handle Post Story
  const handlePostStory = () => {
    // Implement the logic to post the story
    // For example, redirect to another page or show a success message
    alert("Story posted successfully!");
    // Clear the captured photo after posting
    setCapturedPhoto("");
  };

  return (
    <Box className="relative w-full h-full">
      {/* Loading State */}
      {isLoading && (
        <Box className="flex items-center justify-center w-full h-full">
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box className="flex flex-col items-center justify-center w-full h-full p-4">
          <Typography variant="h6" color="error" className="mb-4">
            {error}
          </Typography>
          <Typography variant="body1" className="text-center">
            Please enable camera permissions in your browser settings.
          </Typography>
        </Box>
      )}

      {/* Flash Overlay */}
      {isFlashing && <FlashOverlay />}

      {/* Video Feed */}
      {!isLoading && hasCameraAccess && !capturedPhoto && (
        <Video ref={videoRef} autoPlay muted playsInline />
      )}

      {/* Captured Photo */}
      {capturedPhoto && (
        <Box className="absolute top-0 left-0 w-full h-full">
          <CapturedImage src={capturedPhoto} alt="Captured" />
          <Box
            className="absolute bottom-20 left-0 w-full flex justify-center"
            sx={{ px: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                width: "100%",
                maxWidth: 400,
                justifyContent: "space-between",
              }}
            >
              <Fab
                variant="extended"
                color="primary"
                onClick={handleRetake}
                sx={{
                  flexGrow: 1,
                  backgroundColor: "#4A5568",
                  "&:hover": {
                    backgroundColor: "#2D3748",
                  },
                }}
              >
                <ReplayIcon sx={{ mr: 1 }} />
                Retake
              </Fab>
              <Fab
                variant="extended"
                color="secondary"
                onClick={handlePostStory}
                sx={{
                  flexGrow: 1,
                  backgroundColor: "#38A169",
                  "&:hover": {
                    backgroundColor: "#2F855A",
                  },
                }}
              >
                <SendIcon sx={{ mr: 1 }} />
                Post Story
              </Fab>
            </Box>
          </Box>
        </Box>
      )}

      {/* Camera Capture Button */}
      {!isLoading && hasCameraAccess && !capturedPhoto && (
        <CaptureButton aria-label="capture" onClick={handleCapture}>
          <CameraAltIcon />
        </CaptureButton>
      )}

      {/* Hidden Canvas for Capturing Photo */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </Box>
  );
};

export default StoryPage;
