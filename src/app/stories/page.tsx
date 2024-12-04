"use client"
import Link from "next/link";
import { Button, Box, Typography, ImageList, ImageListItem } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
  const router = useRouter();
  return (
    <Box className="w-full h-screen p-4 pb-14">
      <Box>
        <Button onClick={() => router.back()} variant="text" color="inherit">Back To Map</Button>
      </Box>
      <Box>
        <Typography variant="h4">
          Mountain View
        </Typography>
      </Box>
      <Box className="flex flex-col" >
        <Typography variant="h6">
          My Story
        </Typography>
        <Box className="w-full" >
          <Swiper
            className='h-[100px]'
            slidesPerView={2}
            spaceBetween={30}
            navigation={true}
            centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination, Navigation]}
          >
            <SwiperSlide>1</SwiperSlide>
            <SwiperSlide>2</SwiperSlide>
            <SwiperSlide>3</SwiperSlide>
            <SwiperSlide><ControlPointIcon/></SwiperSlide>
          </Swiper>
        </Box>
      </Box>
      <Typography variant="h6">
        Explore
      </Typography>
      <ImageList sx={{ height: 390 }} cols={2} rowHeight={164}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
]

export default Home;

