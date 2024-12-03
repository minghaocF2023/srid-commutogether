"use client"
import { Avatar } from "@mui/material";
import Link from "next/link";

const Home = () => {
  return (
    <div className="flex justify-around p-4">
      <p>Hi, Tommy</p>
      <Link href="/profile">
        <Avatar alt="Tommy" src="Tommy_Flanagan.webp" sx={{ width: 56, height: 56 }} />
      </Link>
    </div>
  );
};

export default Home;
