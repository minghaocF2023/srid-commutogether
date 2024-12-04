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

  // Placeholder function for posting the story
  const postStory = () => {
    // Implement your post story logic here
    console.log("Story posted!");
    // Reset the image after posting if needed
    setImage(null);
  };

  return (
    <div className="w-full h-screen relative">
      {image ? (
        <img src={image} alt="Captured" className="w-full h-full object-cover" />
      ) : (
        <Camera
          ref={camera}
          facingMode="environment"
          className="w-full h-full object-cover"
        />
      )}

      {/* Button Container */}
      <div className="absolute bottom-16 w-full flex justify-center">
        {image ? (
          <>
            {/* Retake Photo Button */}
            <StyledButton
              text="Retake Photo"
              onClick={() => setImage(null)}
              styleType="primary"
              variant="contained"
              className="mr-2"
            />
            {/* Post Story Button */}
            <StyledButton
              text="Post Story"
              onClick={postStory}
              styleType="secondary"
              variant="contained"
              className="ml-2"
            />
          </>
        ) : (
          /* Take Photo Button */
          <StyledButton
            text="Take Photo"
            onClick={takePhoto}
            styleType="primary"
            variant="contained"
          />
        )}
      </div>
    </div>
  );
};

export default StoryPage;
