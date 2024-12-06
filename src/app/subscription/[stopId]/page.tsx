"use client";
import React, { use, useState } from "react";
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
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);

  const routes: Route[] = [
    {
      id: "1",
      from: "San Jose",
      to: "San Francisco",
      time: "10:30 AM"
    },
    {
      id: "2",
      from: "San Jose",
      to: "Mountain View",
      time: "11:30 AM"
    },
    {
      id: "3",
      from: "Sunnyvale",
      to: "San Francisco",
      time: "12:30 AM"
    },
    {
      id: "4",
      from: "Sunnyvale",
      to: "San Jose",
      time: "13:30 AM"
    },
    {
      id: "5",
      from: "Mountain View",
      to: "San Francisco",
      time: "14:30 AM"
    },
    {
      id: "6",
      from: "Mountain View",
      to: "San Jose",
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

  // Filter routes to only show unsubscribed ones
  const availableRoutes = routes.filter(route => !hasSubscription(route.id));

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="flex items-center mb-6">
        <span 
          className="text-sm cursor-pointer flex items-center"
          onClick={() => router.back()}
        >
          ← back to home
        </span>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Subscribe a New Train</h1>

      <div className="space-y-2">
        {availableRoutes.map((route) => (
          <div
            key={route.id}
            className={`flex items-center justify-between p-3 rounded-lg bg-gray-50
              ${hoveredRouteId === route.id ? "border-2 border-black" : ""}`}
            onMouseEnter={() => setHoveredRouteId(route.id)} 
            onMouseLeave={() => setHoveredRouteId(null)}
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
              className="px-4 py-1.5 rounded-full text-sm bg-[#FFB800] text-white hover:bg-[#E5A700]"
            >
              Subscribe
            </button>
          </div>
        ))}
        
        {availableRoutes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No available routes to subscribe
          </div>
        )}
      </div>

      <Header />
    </div>
  );
};

export default SchedulePage; 