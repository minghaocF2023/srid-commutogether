"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraType } from "react-camera-pro";
import StyledButton from "@/components/StyledButton";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
const StoryPage = () => {
  const searchParams = useSearchParams();
  let locationId = searchParams.get("id");
  const router = useRouter();
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string | null>(null);

  const takePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto() as string;
      setImage(photo);
    }
  };

  // useEffect(() => {
  //   if (searchParams.has("id")) {
  //     locationId = searchParams.get("id") as string;
  //   }
  // }, [searchParams]);

  // Placeholder function for posting the story
  const postStory = () => {
    if (!image) {
      return;
    }
    // Retrieve existing stories from localStorage
    const existingStories = localStorage.getItem("userStories");
    let storiesArray = existingStories ? JSON.parse(existingStories) : [];
    const imageObj = {
      image,
      locationId,
    };
    // Add the new image
    storiesArray.push(imageObj);

    // Save back to localStorage
    localStorage.setItem("userStories", JSON.stringify(storiesArray));

    // Reset the image after posting
    setImage(null);

    router.push("/stories?id=" + locationId);
  };

  return (
    <div className="w-full h-screen relative">
      {image ? (
        <img
          src={image}
          alt="Captured"
          className="w-full h-full object-cover"
        />
      ) : (
        <Camera
          ref={camera}
          facingMode="environment"
          // @ts-ignore
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
