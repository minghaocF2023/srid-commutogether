"use client"
import Image from 'next/image'
import { Avatar, Alert, Typography, ImageList, ImageListItem } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import StyledLink from "@/components/StyledLink";

const Profile = () => {
  return (
    <div className="w-full p-4 overflow-hidden">
      <div className="flex justify-between items-end mb-5">
        <h1 className="text-2xl">Profile</h1>
        <StyledLink
          text="Settings"
          href={"/stamps/collect"}
          styleType="primary"
        />
      </div>
      <div className="flex justify-stretch pb-5">
        <Avatar alt="Tommy" src="Tommy_Flanagan.webp" sx={{ width: 120, height: 120 }} />
        <div className="flex flex-col justify-start m-5">
          <Typography variant="h5">
            Tommy Chan
          </Typography>
          <Typography variant="subtitle1" className="text-slate-500">
            tommy@google.com
          </Typography>
        </div>
      </div>
      <div className="flex flex-col justify-stretch pb-4">
        <Typography variant="subtitle1">Bio</Typography>
        <Alert icon={false} severity="info">
          Hi I am Tommy I like taking Caltrain!
        </Alert>
      </div>
      <div className="flex flex-col justify-stretch pb-4">
        <Typography variant="subtitle1">Public Album</Typography>
        <ImageList sx={{ height: 390 }} cols={3} rowHeight={164}>
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
      </div>
      <StyledLink
        text='Back to Home'
        styleType='secondary'
        href={"/"}
      />
    </div>
  );
};

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f',
    title: 'Snacks',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383',
    title: 'Tower',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1627328715728-7bcc1b5db87d',
    title: 'Tree',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1627000086207-76eabf23aa2e',
    title: 'Camping Car',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1627328561499-a3584d4ee4f7',
    title: 'Mountain',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
  },
];
export default Profile;

