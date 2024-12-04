"use client"
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import albums from '../../data/photos.json';
import Link from "next/link";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Button, Box, Typography, ImageList, ImageListItem } from '@mui/material';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from 'swiper/modules';

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumId: string | null = searchParams.get('id');
  let photosData, hasUserStory;
  for (const album of albums['albums']) {
    if (album['albumId'] === albumId) {
      photosData = album['photos'];
      hasUserStory = album['containsUserUploads'];
      break;
    }
  }
  if (!photosData) {
    notFound();
  }

  return (
    <Box className="w-full h-screen p-4 pb-14">
      <Box>
        <Button onClick={() => router.back()} variant="text" color="inherit">Back To Map</Button>
      </Box>
      <Box className="flex justify-between">
        <Typography variant="h4">
          Mountain View
        </Typography>
        <Link href="/story">
          <ControlPointIcon fontSize="large"/>
        </Link>
      </Box>
      {hasUserStory && <Box className="flex flex-col" >
        <Typography variant="h6">
          My Story
        </Typography>
        <Box className="w-full" >
          <Swiper
            className='h-[150px]'
            slidesPerView={2}
            spaceBetween={10}
            navigation={true}
            centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination, Navigation]}
          >
            {photosData.map((item) => (item.isUserUpload &&
              <SwiperSlide key={item.photoId}>
                <img
                  src={item.photoUrl}
                  alt={item.location}
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>}
      <Typography variant="h6">
        Explore
      </Typography>
      <ImageList variant="masonry" cols={2} gap={10}>
        {photosData.map((item) => (!item.isUserUpload &&
          <ImageListItem key={item.photoId}>
            <img
              src={item.photoUrl}
              alt={item.location}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default Home;

