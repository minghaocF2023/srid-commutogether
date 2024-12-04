"use client"
import { Avatar, Alert, Box, Typography, ImageList, ImageListItem, Snackbar, SnackbarCloseReason } from "@mui/material";
import StyledLink from "@/components/StyledLink";
import { useState, useEffect } from 'react';
import StyledButton from '@/components/StyledButton';
import { useSearchParams, useRouter, notFound } from 'next/navigation';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

type UserData = {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  self: boolean;
}

const Profile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user: string | null = searchParams.get('user');
  const userId: number = user ? +user : 0;
  let userData: UserData;
  if (userId < usersData.length) {
    userData = usersData[userId];
  } else {
    notFound();
  }

  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [requestSent, setRequestSent] = useState<boolean>(() => {
    // Check if the request status is saved in localStorage for this user
    const savedRequestStatus = localStorage.getItem(`requestSent_${userId}`);
    return savedRequestStatus ? JSON.parse(savedRequestStatus) : false;
  });

  useEffect(() => {
    // Persist the request status in localStorage when it changes
    localStorage.setItem(`requestSent_${userId}`, JSON.stringify(requestSent));
  }, [requestSent, userId]);

  const handleUnimplemented = () => {
    setOpen(true);
  };

  const handleSendRequest = () => {
    setRequestSent(true);
  };

  const handleClose = (
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="w-full h-screen p-4 pb-14">
      <div className="flex justify-between items-end mb-5">
        <h1 className="text-2xl">Profile</h1>
        <StyledButton
          className={(edit || !userData.self) ? 'invisible' : ''}
          text="Settings"
          onClick={() => setEdit(true)}
          styleType="primary"
        />
      </div>
      <div className="flex justify-stretch mb-4 h-[120px]">
        <Avatar alt={userData.name} src={userData.avatar} sx={{ width: 120, height: 120 }} />
        <div className="flex flex-col justify-start m-5">
          <Typography variant="h5">
            {userData.name} {edit && '✎'}
          </Typography>
          <Typography variant="subtitle1" className="text-slate-500">
            {userData.email}
          </Typography>
          {userData.self ?
            (edit && <StyledButton
              text="Change Profile"
              onClick={handleUnimplemented}
              styleType='primary'
            />) :
            <Box>
              {requestSent ? (
                <StyledButton
                  className="me-2"
                  text="Requested"
                  styleType='secondary' // Different color to indicate request has been sent
                />
              ) : (
                <StyledButton
                  className="me-2"
                  text="Send Request"
                  onClick={handleSendRequest}
                  styleType='primary'
                />
              )}
              <PersonAddAltIcon />
            </Box>
          }
        </div>
      </div>
      <div className="flex flex-col justify-stretch pb-4">
        <Typography variant="subtitle1">Bio {edit && '✎'}</Typography>
        <Alert icon={false} severity="info">
          {userData.bio}
        </Alert>
      </div>
      <div className="flex flex-col justify-stretch pb-4">
        <div className='flex h-max justify-between'>
          <Typography variant="subtitle1">Public Album</Typography>
          {edit && <StyledButton
            className={edit ? '' : 'invisible'}
            text='Add new'
            onClick={handleUnimplemented}
            styleType='primary'
          />}
        </div>
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
        <Snackbar
          open={open}
          autoHideDuration={1000}
          onClose={handleClose}
          message="Not implemented"
        />
      </div>
      {edit ?
        <div className='flex justify-between'>
          <StyledButton text='Back' styleType='secondary' onClick={() => setEdit(false)} />
          <StyledButton text='Save' styleType='primary' onClick={() => setEdit(false)} />
        </div> :
        <StyledButton
          text='Back'
          styleType='secondary'
          onClick={() => router.back()}
        />
      }
    </div>
  );
};


const usersData = [
  {
    name: 'Tommy Chan',
    email: 'tommy@google.com',
    avatar: "Tommy_Flanagan.webp",
    bio: 'Hi I am Tommy I like taking Caltrain!',
    self: true,
  },
  {
    name: 'Samuel Lin',
    email: 'samuel@gmail.com',
    avatar: "Samuel.jpeg",
    bio: 'Hi I am Samuel I like taking Caltrain!',
    self: false,
  },
  {
    name: 'Sherry Hsu',
    email: 'sherry@gmail.com',
    avatar: "Sherry.jpg",
    bio: 'Hi I am Sherry I like taking Caltrain!',
    self: false,
  },
]

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
