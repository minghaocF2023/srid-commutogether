"use client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import albums from "../../data/photos.json";
import Link from "next/link";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import {
  Button,
  Box,
  Typography,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import React, { useState, useEffect } from "react";

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumId: string | null = searchParams.get("id");
  const [photosData, setPhotosData] = useState([]);
  const [albumName, setAlbumName] = useState<string>("");

  useEffect(() => {
    // @ts-ignore
    let initialPhotos = [];
    let foundAlbumName = "";
    for (const album of albums["albums"]) {
      if (album["albumId"] === albumId) {
        initialPhotos = album["photos"];
        foundAlbumName = album["name"];
        break;
      }
    }

    if (!initialPhotos.length) {
      notFound();
    }

    setAlbumName(foundAlbumName);

    // Retrieve user stories from localStorage
    const existingStories = localStorage.getItem("userStories");
    let storiesArray = existingStories ? JSON.parse(existingStories) : [];

    // filter user stories by albumId
    storiesArray = storiesArray.filter(
      (story: { locationId: string; image: string }) =>
        story.locationId === albumId
    );
    // Map user stories to the same format as initialPhotos
    const userPhotos = storiesArray.map(
      (image: { locationId: string; image: string }, index: number) => ({
        photoId: `user-${index}`,
        photoUrl: image.image,
        location: "User Upload",
        isUserUpload: true,
      })
    );

    // Combine userPhotos with initialPhotos
    // @ts-ignore
    setPhotosData([...userPhotos, ...initialPhotos]);
  }, [albumId]);

  return (
    <Box className="flex flex-col w-full h-screen p-4 pb-16">
      <Box>
        <Button onClick={() => router.back()} variant="text" color="inherit">
          Back To Map
        </Button>
      </Box>
      <Box className="flex justify-between">
        <Typography variant="h4">{albumName}</Typography>
        <Link href={`/story?id=${albumId}`}>
          <ControlPointIcon fontSize="large" />
        </Link>
      </Box>
      {/* My Story Section */}
      {/* @ts-ignore */}
      {photosData.some((item) => item.isUserUpload) && (
        <Box className="flex flex-col">
          <Typography variant="h6">My Story</Typography>
          <Box className="w-full">
            <Swiper
              className="h-[150px]"
              slidesPerView={2}
              spaceBetween={10}
              navigation={true}
              centeredSlides={true}
              pagination={{ clickable: true }}
              modules={[Pagination, Navigation]}
            >
              {photosData.map(
                (item) =>
                  // @ts-ignore
                  item.isUserUpload && (
                    // @ts-ignore
                    <SwiperSlide key={item.photoId}>
                      <img
                        // @ts-ignore
                        src={item.photoUrl}
                        // @ts-ignore
                        alt={item.location}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    </SwiperSlide>
                  )
              )}
            </Swiper>
          </Box>
        </Box>
      )}
      {/* Explore Section */}
      <Typography variant="h6">Explore</Typography>
      <Box className="flex-1 overflow-y-auto">
        <ImageList variant="masonry" cols={2} gap={10}>
          {photosData.map(
            (item) =>
              // @ts-ignore
              !item.isUserUpload && (
                // @ts-ignore
                <ImageListItem key={item.photoId}>
                  {/* @ts-ignore */}
                  <img src={item.photoUrl} alt={item.location} loading="lazy" />
                </ImageListItem>
              )
          )}
        </ImageList>
      </Box>
    </Box>
  );
};

export default Home;
