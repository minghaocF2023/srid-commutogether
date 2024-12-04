"use client";

import React, { useRef, useState } from "react";
import { Camera, CameraType } from "react-camera-pro";
import StyledButton from "@/components/StyledButton";

const StoryPage = () => {
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string | null>(null);

  const takePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto() as string;
      setImage(photo);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      {image ? (
        <img src={image} alt="Captured" className="w-full h-auto" />
      ) : (
        <Camera
          ref={camera}
          aspectRatio={16 / 9}
          facingMode="environment"
        />
      )}
      <StyledButton
        text={image ? "Retake Photo" : "Take Photo"}
        onClick={() => {
          if (image) {
            setImage(null);
          } else {
            takePhoto();
          }
        }}
        styleType="primary"
        variant="contained"
        className="mt-4"
      />
    </div>
  );
};

export default StoryPage;
