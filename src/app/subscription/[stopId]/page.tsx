"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useSubscriptionStore } from "@/lib/stores/subscriptionStore";
import { v4 as uuidv4 } from 'uuid';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';

interface Route {
  id: string;
  from: string;
  to: string;
  time: string;
}

interface PageProps {
  params: Promise<{ stopId: string }>;
}

const SchedulePage = ({ params }: PageProps) => {
  const router = useRouter();
  const { stopId } = use(params);
  const addSubscription = useSubscriptionStore((state) => state.addSubscription);
  const hasSubscription = useSubscriptionStore((state) => state.hasSubscription);

  const routes: Route[] = [
    {
      id: "1",
      from: "Mountain View",
      to: "San Francisco",
      time: "10:30 AM"
    },
    {
      id: "2",
      from: "Mountain View",
      to: "San Jose",
      time: "11:30 AM"
    },
    {
      id: "3",
      from: "Mountain View",
      to: "San Francisco",
      time: "12:30 AM"
    },
    {
      id: "4",
      from: "Mountain View",
      to: "San Francisco",
      time: "13:30 AM"
    },
    {
      id: "5",
      from: "Mountain View",
      to: "San Jose",
      time: "14:30 AM"
    },
    {
      id: "6",
      from: "Mountain View",
      to: "San Francisco",
      time: "15:30 AM"
    }
  ];

  const handleSubscribe = (route: Route) => {
    const subscription = {
      id: uuidv4(),
      stopId: stopId,
      stopName: route.from,
      departureTime: route.time,
      arrivalTime: "13:30",
      destination: route.to,
      date: new Date().toLocaleDateString(),
      routeId: route.id
    };
    
    addSubscription(subscription);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="flex items-center mb-6">
        <span className="text-sm">← back to home</span>
      </div>

      <h1 className="text-2xl font-semibold mb-6">New Subscription</h1>

      <div className="space-y-2">
        {routes.map((route) => {
          const isSubscribed = hasSubscription(route.id);
          
          return (
            <div
              key={route.id}
              className={`flex items-center justify-between p-3 rounded-lg bg-gray-50
                ${route.id === "3" ? 'border-2 border-black' : ''}`}
            >
              <div className="flex items-center flex-1">
                <DirectionsTransitIcon className="text-black mr-3" />
                <div>
                  <div className="text-sm">
                    {route.from} to {route.to}
                  </div>
                  <div className="text-xs text-gray-500">{route.time}</div>
                </div>
              </div>
              <button
                onClick={() => handleSubscribe(route)}
                disabled={isSubscribed}
                className={`px-4 py-1.5 rounded-full text-sm
                  ${isSubscribed 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#FFB800] text-white hover:bg-[#E5A700]'
                  }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>
          );
        })}
      </div>

      <Header />
    </div>
  );
};

export default SchedulePage; 