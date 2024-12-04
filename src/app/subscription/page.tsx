"use client";
import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { ArrowBack, Close, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

const NewSubscriptionPage = () => {
  const router = useRouter();
  const stops = [
    { id: "A3", name: "Mountain View" },
  ];

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="flex items-center mb-6">
        <span className="text-sm">← back to home</span>
      </div>

      <h1 className="text-2xl font-semibold mb-6">New Subscription</h1>

      <h2 className="text-lg mb-4">Choose a stop</h2>

      <div className="flex items-center bg-gray-100 p-3 rounded-lg mb-4">
        <ArrowBack className="text-gray-400 mr-2" />
        <div className="border-r border-gray-300 h-6 mx-2"></div>
        <Close className="text-gray-400 ml-2" />
      </div>

      <div className="space-y-2">
        {stops.map((stop) => (
          <div
            key={stop.id}
            className="flex items-center p-4 bg-purple-50 rounded-lg cursor-pointer border-2 border-purple-200"
            onClick={() => router.push(`/subscription/${stop.id}`)}
          >
            <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3">
              A
            </span>
            <span className="text-gray-800">{stop.name}</span>
          </div>
        ))}
      </div>

      <Header />
    </div>
  );
};

export default NewSubscriptionPage; 